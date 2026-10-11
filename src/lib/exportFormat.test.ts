import { describe, expect, it } from 'vitest'
import { EXERCISES_SEED } from '../data/exercises.seed'
import type { Exercise, Session } from '../types'
import {
  buildExportFile,
  bulkExerciseArray,
  computeImport,
  EXPORT_VERSION,
  exportFileName,
  exportReminderDue,
  parseBodyWeight,
  parseExercise,
  parseExerciseList,
  parseExportText,
  parseSession,
  runMigrations,
  slugify,
  uniqueExerciseId,
  type CurrentData,
  type ExerciseContext,
  type ParsedExport,
} from './exportFormat'

const SEED_IDS = new Set(EXERCISES_SEED.map((e) => e.id))
const ctx = (taken: string[] = []): ExerciseContext => ({ takenIds: new Set([...SEED_IDS, ...taken]), seedIds: SEED_IDS })

const valid = { name: 'Développé nuque', group: 'shoulders', equipmentType: 'barbell', primaryMuscles: ['shoulders'] }
const seed = (id: string): Exercise => {
  const e = EXERCISES_SEED.find((x) => x.id === id)
  if (!e) throw new Error(id)
  return { ...e }
}
const custom = (id: string, extra: Partial<Exercise> = {}): Exercise => ({ ...seed('crunch'), id, name: id, isCustom: true, alternatives: [], antagonists: [], complements: [], ...extra })
const session = (id: string, date: string): Session => ({ id, date, name: id, entries: [{ exerciseId: 'crunch', sets: [{ reps: 10, weight: 0 }] }] })
const empty: ParsedExport = { sessions: [], bodyWeights: [], exercises: [], exerciseNotes: [] }

describe('slugify / uniqueExerciseId', () => {
  it('removes accents, punctuation and spaces', () => {
    expect(slugify('  Développé  nuque (barre) ')).toBe('developpe_nuque_barre')
    expect(slugify('!!!')).toBe('')
  })
  it('prefixes custom_ and avoids collisions', () => {
    expect(uniqueExerciseId('Curl', new Set())).toBe('custom_curl')
    expect(uniqueExerciseId('Curl', new Set(['custom_curl']))).toBe('custom_curl_2')
    expect(uniqueExerciseId('Curl', new Set(['custom_curl', 'custom_curl_2']))).toBe('custom_curl_3')
    expect(uniqueExerciseId('???', new Set())).toBe('custom_exercice')
  })
})

describe('parseExercise', () => {
  it('fills optional fields with default values', () => {
    const r = parseExercise(valid, ctx())
    expect(r.ok && r.exercise).toMatchObject({
      id: 'custom_developpe_nuque',
      name: 'Développé nuque',
      nameEn: 'Développé nuque',
      movementPattern: 'custom',
      secondaryMuscles: [],
      alternatives: [],
      instructions: '',
      isCustom: true,
    })
  })

  it('requires name, group, equipment and primary muscle', () => {
    const reason = (raw: unknown) => {
      const r = parseExercise(raw, ctx())
      return r.ok ? 'ok' : r.reason
    }
    expect(reason('texte')).toBe('notObject')
    expect(reason({ ...valid, name: '  ' })).toBe('noName')
    expect(reason({ ...valid, group: 'cou' })).toBe('badGroup')
    expect(reason({ ...valid, equipmentType: 'elastique' })).toBe('badEquipment')
    expect(reason({ ...valid, primaryMuscles: [] })).toBe('noPrimaryMuscle')
    expect(reason({ ...valid, primaryMuscles: ['biceps_long'] })).toBe('unknownMuscle')
    expect(reason({ ...valid, secondaryMuscles: ['inconnu'] })).toBe('unknownMuscle')
  })

  it('refuses to replace a built-in exercise', () => {
    const r = parseExercise({ ...valid, id: 'tractions' }, ctx())
    expect(r).toEqual({ ok: false, reason: 'seedIdConflict' })
  })

  it('rejects a malformed id and keeps a valid id', () => {
    expect(parseExercise({ ...valid, id: 'Mon Id!' }, ctx())).toEqual({ ok: false, reason: 'badId' })
    const r = parseExercise({ ...valid, id: 'mon_exo' }, ctx())
    expect(r.ok && r.exercise.id).toBe('mon_exo')
  })

  it('cleans up: duplicates, secondary muscle already primary, self-reference, non-http video', () => {
    const r = parseExercise(
      { ...valid, id: 'a', primaryMuscles: ['shoulders', 'shoulders'], secondaryMuscles: ['shoulders', 'triceps'], alternatives: ['a', 'b', 'b'], videoUrl: 'javascript:alert(1)' },
      ctx(),
    )
    expect(r.ok && r.exercise).toMatchObject({ primaryMuscles: ['shoulders'], secondaryMuscles: ['triceps'], alternatives: ['b'] })
    expect(r.ok && r.exercise.videoUrl).toBeUndefined()
    const ok = parseExercise({ ...valid, videoUrl: 'https://exemple.test/v' }, ctx())
    expect(ok.ok && ok.exercise.videoUrl).toBe('https://exemple.test/v')
  })

  it('defaults the English machine name', () => {
    const r = parseExercise({ ...valid, machineType: 'Poulie haute' }, ctx())
    expect(r.ok && r.exercise).toMatchObject({ machineType: 'Poulie haute', machineTypeEn: 'Poulie haute' })
  })

  it('generates distinct ids for two exercises with the same name in one file', () => {
    const c = ctx()
    const a = parseExercise(valid, c)
    const b = parseExercise(valid, c)
    expect(a.ok && b.ok && a.exercise.id !== b.exercise.id).toBe(true)
  })
})

describe('parseExerciseList / bulkExerciseArray', () => {
  it('imports the valid lines and reports the others with their position', () => {
    const r = parseExerciseList([valid, { name: 'Sans groupe' }, 42, { ...valid, name: 'Autre' }], ctx())
    expect(r.exercises.map((e) => e.name)).toEqual(['Développé nuque', 'Autre'])
    expect(r.issues).toEqual([
      { kind: 'exercise', index: 2, reason: 'badGroup', label: 'Sans groupe' },
      { kind: 'exercise', index: 3, reason: 'notObject', label: undefined },
    ])
  })
  it('accepts an array or { exercises: [...] }', () => {
    expect(bulkExerciseArray([1])).toEqual([1])
    expect(bulkExerciseArray({ exercises: [2] })).toEqual([2])
    expect(bulkExerciseArray({ autre: [] })).toBeUndefined()
    expect(bulkExerciseArray('x')).toBeUndefined()
  })
  it('the same id several times: the last one wins', () => {
    const r = parseExerciseList([{ ...valid, id: 'x', name: 'A' }, { ...valid, id: 'x', name: 'B' }], ctx())
    expect(r.exercises).toHaveLength(1)
    expect(r.exercises[0].name).toBe('B')
  })
})

describe('parseSession / parseBodyWeight', () => {
  it('validates the date and cleans up the sets', () => {
    const r = parseSession({
      id: 's1',
      date: '2026-03-10',
      name: 'Pull',
      entries: [{ exerciseId: 'crunch', sets: [{ reps: 10, weight: 20, rpe: 8 }, { reps: 0, weight: 5 }, { reps: 'x', weight: 1 }] }, { sets: [] }],
    })
    expect(r.ok && r.session.entries).toEqual([{ exerciseId: 'crunch', sets: [{ reps: 10, weight: 20, rpe: 8 }] }])
    expect(r.ok && r.droppedSets).toBe(2)
  })
  it('rejects an invalid date and generates a missing id', () => {
    expect(parseSession({ date: '2026-02-30' })).toEqual({ ok: false, reason: 'badDate' })
    expect(parseSession(null)).toEqual({ ok: false, reason: 'notObject' })
    const r = parseSession({ date: '2026-02-20', entries: [] })
    expect(r.ok && r.session.id.length).toBeGreaterThan(10)
  })
  it('validates the body weight', () => {
    expect(parseBodyWeight({ date: '2026-03-10', kg: 75.456 })).toEqual({ ok: true, value: { date: '2026-03-10', kg: 75.46 } })
    expect(parseBodyWeight({ date: '2026-03-10', kg: 5 })).toEqual({ ok: false, reason: 'badWeight' })
    expect(parseBodyWeight({ date: 'x', kg: 70 })).toEqual({ ok: false, reason: 'badDate' })
  })
})

describe('buildExportFile', () => {
  it('exports custom exercises and notes on built-in exercises, not the catalogue itself', () => {
    const file = buildExportFile(
      [seed('crunch'), { ...seed('tractions'), notes: 'ma note', videoUrl: 'https://x.test' }, custom('zz'), custom('aa', { notes: 'perso' })],
      [session('b', '2026-02-01'), session('a', '2026-01-01')],
      [{ date: '2026-02-01', kg: 70 }, { date: '2026-01-01', kg: 71 }],
      new Date('2026-03-10T12:00:00Z'),
    )
    expect(file.version).toBe(EXPORT_VERSION)
    expect(file.exportedAt).toBe('2026-03-10T12:00:00.000Z')
    expect(file.exercises.map((e) => e.id)).toEqual(['aa', 'zz'])
    expect(file.exercises[0].notes).toBe('perso')
    expect(file.exerciseNotes).toEqual([{ id: 'tractions', notes: 'ma note', videoUrl: 'https://x.test' }])
    expect(file.sessions.map((s) => s.id)).toEqual(['a', 'b'])
    expect(file.bodyWeights.map((w) => w.date)).toEqual(['2026-01-01', '2026-02-01'])
  })
  it('names the file after the date', () => {
    expect(exportFileName('2026-03-10')).toBe('carnet-de-salle-2026-03-10.json')
  })
})

describe('runMigrations', () => {
  const migrations = {
    1: (d: Record<string, unknown>) => ({ ...d, renamed: d.old }),
    2: (d: Record<string, unknown>) => ({ ...d, extra: true }),
  }
  it('chains the migrations in order and updates the version', () => {
    expect(runMigrations({ version: 1, old: 'x' }, 1, 3, migrations)).toEqual({ version: 3, old: 'x', renamed: 'x', extra: true })
  })
  it('does nothing if already up to date', () => {
    expect(runMigrations({ version: 3 }, 3, 3, migrations)).toEqual({ version: 3 })
  })
  it('fails if a migration is missing', () => {
    expect(() => runMigrations({ version: 1 }, 1, 3, { 1: (d) => d })).toThrow(/2 -> 3/)
  })
})

describe('parseExportText', () => {
  const file = (over: Record<string, unknown> = {}) => JSON.stringify({ version: 1, exportedAt: 'x', exercises: [], exerciseNotes: [], sessions: [], bodyWeights: [], ...over })

  it('rejects an unreadable file or one without a version', () => {
    expect(parseExportText('{pas du json', ctx())).toEqual({ ok: false, error: 'notJson' })
    expect(parseExportText('[1,2]', ctx())).toEqual({ ok: false, error: 'notObject' })
    expect(parseExportText('{"sessions":[]}', ctx())).toEqual({ ok: false, error: 'noVersion' })
    expect(parseExportText('{"version":"1"}', ctx())).toEqual({ ok: false, error: 'noVersion' })
    expect(parseExportText('{"version":0}', ctx())).toEqual({ ok: false, error: 'noVersion' })
    expect(parseExportText('{"version":1.5}', ctx())).toEqual({ ok: false, error: 'noVersion' })
  })
  it('rejects a file from a newer version than the app', () => {
    expect(parseExportText(file({ version: EXPORT_VERSION + 1 }), ctx())).toEqual({ ok: false, error: 'newerVersion' })
  })
  it('accepts a minimal file (missing sections)', () => {
    const r = parseExportText('{"version":1}', ctx())
    expect(r.ok && r.data).toEqual({ sessions: [], bodyWeights: [], exercises: [], exerciseNotes: [] })
  })
  it('reads back a full export without loss', () => {
    const built = buildExportFile(
      [{ ...seed('tractions'), notes: 'n' }, custom('mon_exo', { notes: 'perso' })],
      [session('s1', '2026-01-01')],
      [{ date: '2026-01-01', kg: 70 }],
    )
    const r = parseExportText(JSON.stringify(built), ctx())
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.issues).toEqual([])
    expect(r.data.sessions).toEqual(built.sessions)
    expect(r.data.bodyWeights).toEqual(built.bodyWeights)
    expect(r.data.exerciseNotes).toEqual(built.exerciseNotes)
    expect(r.data.exercises[0]).toMatchObject({ id: 'mon_exo', notes: 'perso', isCustom: true })
  })
  it('imports what is valid, reports the rest', () => {
    const r = parseExportText(
      file({
        sessions: [{ id: 'ok', date: '2026-01-01', entries: [] }, { id: 'ko', date: 'hier' }],
        bodyWeights: [{ date: '2026-01-01', kg: 70 }, { date: '2026-01-02', kg: 9999 }],
        exercises: [valid, { ...valid, id: 'tractions' }],
        exerciseNotes: [{ id: 'crunch', notes: 'ok' }, { notes: 'sans id' }, { id: 'vide' }],
      }),
      ctx(),
    )
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.data.sessions).toHaveLength(1)
    expect(r.data.bodyWeights).toHaveLength(1)
    expect(r.data.exercises).toHaveLength(1)
    expect(r.data.exerciseNotes).toEqual([{ id: 'crunch', notes: 'ok' }])
    expect(r.issues.map((i) => `${i.kind}:${i.index}:${i.reason}`)).toEqual([
      'session:2:badDate',
      'bodyWeight:2:badWeight',
      'exercise:2:seedIdConflict',
      'note:2:badId',
    ])
  })
})

describe('computeImport', () => {
  const current: CurrentData = {
    exercises: [seed('crunch'), { ...seed('tractions'), notes: 'ancienne note', videoUrl: 'https://old.test' }, custom('perso_a'), custom('perso_b')],
    sessions: [session('s1', '2026-01-01'), session('s2', '2026-01-02')],
    bodyWeights: [{ date: '2026-01-01', kg: 80 }],
  }
  const incoming: ParsedExport = {
    sessions: [{ ...session('s2', '2026-01-02'), name: 'importée' }, session('s3', '2026-01-03')],
    bodyWeights: [{ date: '2026-01-01', kg: 79 }, { date: '2026-01-05', kg: 78 }],
    exercises: [custom('perso_b', { name: 'maj' }), custom('perso_c', { alternatives: ['crunch', 'inexistant'] })],
    exerciseNotes: [{ id: 'crunch', notes: 'nouvelle' }, { id: 'fantome', notes: 'x' }],
  }

  it('merge: adds, replaces on equal id, deletes nothing', () => {
    const p = computeImport(current, incoming, 'merge')
    expect(p.sessionIdsDelete).toEqual([])
    expect(p.exerciseIdsDelete).toEqual([])
    expect(p.bodyWeightDatesDelete).toEqual([])
    expect(p.summary).toEqual({
      sessions: { added: 1, updated: 1 },
      bodyWeights: { added: 1, updated: 1 },
      exercises: { added: 1, updated: 1 },
      notes: 1,
    })
    expect(p.sessionsPut.find((s) => s.id === 's2')?.name).toBe('importée')
  })

  it('merge: restores the notes without touching the other built-in exercises', () => {
    const p = computeImport(current, incoming, 'merge')
    expect(p.exercisesPut.find((e) => e.id === 'crunch')?.notes).toBe('nouvelle')
    expect(p.exercisesPut.some((e) => e.id === 'tractions')).toBe(false) // local notes kept
    expect(p.issues).toEqual([{ kind: 'note', index: 2, reason: 'unknownExercise', label: 'fantome' }])
  })

  it('removes relations to exercises that will not exist', () => {
    const p = computeImport(current, incoming, 'merge')
    expect(p.exercisesPut.find((e) => e.id === 'perso_c')?.alternatives).toEqual(['crunch'])
  })

  it('replace: deletes sessions, weights and custom exercises, then imports', () => {
    const p = computeImport(current, incoming, 'replace')
    expect(p.sessionIdsDelete.sort()).toEqual(['s1', 's2'])
    expect(p.bodyWeightDatesDelete).toEqual(['2026-01-01'])
    expect(p.exerciseIdsDelete.sort()).toEqual(['perso_a', 'perso_b'])
    expect(p.summary.sessions).toEqual({ added: 2, updated: 0 })
    expect(p.summary.exercises).toEqual({ added: 2, updated: 0 })
  })

  it('replace: erases notes absent from the file and keeps those in the file', () => {
    const p = computeImport(current, incoming, 'replace')
    const tractions = p.exercisesPut.find((e) => e.id === 'tractions')
    expect(tractions).toBeDefined()
    expect(tractions?.notes).toBeUndefined()
    expect(tractions?.videoUrl).toBeUndefined()
    expect(p.exercisesPut.find((e) => e.id === 'crunch')?.notes).toBe('nouvelle')
  })

  it('replace: relations to a deleted custom exercise disappear', () => {
    const p = computeImport(current, { ...incoming, exercises: [custom('perso_c', { alternatives: ['perso_a', 'crunch'] })] }, 'replace')
    expect(p.exercisesPut.find((e) => e.id === 'perso_c')?.alternatives).toEqual(['crunch'])
  })

  it('an empty file in replace mode empties the data', () => {
    const p = computeImport(current, empty, 'replace')
    expect(p.sessionIdsDelete).toHaveLength(2)
    expect(p.sessionsPut).toEqual([])
  })

  it('never writes built-in exercises other than notes', () => {
    const p = computeImport(current, empty, 'merge')
    expect(p.exercisesPut).toEqual([])
  })
})

describe('exportReminderDue', () => {
  const base = { today: '2026-03-11' }
  it('disabled at 0 weeks or with no data', () => {
    expect(exportReminderDue({ ...base, weeks: 0, lastExportAt: '2020-01-01' })).toBe(false)
    expect(exportReminderDue({ ...base, weeks: 4 })).toBe(false)
  })
  it('compares with the last export', () => {
    expect(exportReminderDue({ ...base, weeks: 4, lastExportAt: '2026-02-11' })).toBe(true) // 28 jours
    expect(exportReminderDue({ ...base, weeks: 4, lastExportAt: '2026-02-12' })).toBe(false) // 27 jours
  })
  it('without an export, compares with the oldest data', () => {
    expect(exportReminderDue({ ...base, weeks: 2, oldestDataDate: '2026-02-25' })).toBe(true)
    expect(exportReminderDue({ ...base, weeks: 2, oldestDataDate: '2026-03-01' })).toBe(false)
  })
  it('the last export takes precedence over the oldest data', () => {
    expect(exportReminderDue({ ...base, weeks: 2, lastExportAt: '2026-03-10', oldestDataDate: '2025-01-01' })).toBe(false)
  })
})
