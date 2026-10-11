import { describe, expect, it } from 'vitest'
import type { Exercise } from '../types'
import { buildExercisePack, findConflicts, packFileName, PACK_KIND, PACK_VERSION, readPackMeta, resolveConflicts } from './exercisePack'
import { parseExerciseList } from './exportFormat'

const ex = (id: string, over: Partial<Exercise> = {}): Exercise => ({
  id,
  name: `Nom ${id}`,
  nameEn: `Name ${id}`,
  group: 'back',
  movementPattern: 'custom',
  equipmentType: 'cable',
  primaryMuscles: ['lats'],
  secondaryMuscles: [],
  alternatives: [],
  antagonists: [],
  complements: [],
  instructions: 'x',
  instructionsEn: 'x',
  isCustom: true,
  ...over,
})

const SEED = new Set(['tirage_vertical'])
const NOW = new Date('2026-10-12T10:00:00Z')

describe('buildExercisePack', () => {
  it('writes the pack metadata and never includes personal notes', () => {
    const pack = buildExercisePack([ex('custom_a', { notes: 'secret' })], { name: ' My pack ', description: ' Hello ' }, SEED, NOW)
    expect(pack).toMatchObject({ kind: PACK_KIND, version: PACK_VERSION, name: 'My pack', description: 'Hello', exportedAt: NOW.toISOString() })
    expect(JSON.stringify(pack)).not.toContain('secret')
    expect(pack.exercises[0]).not.toHaveProperty('notes')
  })

  it('omits an empty description', () => {
    expect(buildExercisePack([], { name: 'P', description: '  ' }, SEED, NOW)).not.toHaveProperty('description')
  })

  it('keeps relations to pack members and built-in exercises, drops the others', () => {
    const pack = buildExercisePack(
      [ex('custom_a', { alternatives: ['custom_b', 'custom_other', 'tirage_vertical'], complements: ['custom_other'] }), ex('custom_b')],
      { name: 'P' },
      SEED,
      NOW,
    )
    expect(pack.exercises[0].alternatives).toEqual(['custom_b', 'tirage_vertical'])
    expect(pack.exercises[0].complements).toEqual([])
  })

  it('is read back by the exercise validator', () => {
    const pack = buildExercisePack([ex('custom_a', { alternatives: ['tirage_vertical'] })], { name: 'P' }, SEED, NOW)
    const r = parseExerciseList(pack.exercises, { takenIds: new Set(), seedIds: SEED })
    expect(r.issues).toEqual([])
    expect(r.exercises[0].id).toBe('custom_a')
  })
})

describe('packFileName / readPackMeta', () => {
  it('slugifies the pack name', () => {
    expect(packFileName('Mes exercices été')).toBe('pack-mes_exercices_ete.json')
    expect(packFileName('???')).toBe('pack-exercises.json')
  })

  it('reads the metadata of a pack, and nothing for a plain list', () => {
    expect(readPackMeta({ kind: PACK_KIND, version: 1, name: ' A ', description: 'd' })).toEqual({ ok: true, meta: { name: 'A', description: 'd' } })
    expect(readPackMeta({ kind: PACK_KIND, version: 1 })).toEqual({ ok: true, meta: { name: 'Pack' } })
    expect(readPackMeta([])).toEqual({ ok: true })
    expect(readPackMeta({ exercises: [] })).toEqual({ ok: true })
  })

  it('rejects a pack from a newer format', () => {
    expect(readPackMeta({ kind: PACK_KIND, version: PACK_VERSION + 1, name: 'X' })).toEqual({ ok: false, error: 'newerPack' })
  })
})

describe('conflicts', () => {
  const existing = new Set(['custom_a'])
  const taken = new Set(['custom_a', 'tirage_vertical'])
  const incoming = [ex('custom_a', { name: 'Neuf', nameEn: 'New', complements: ['custom_b'] }), ex('custom_b', { alternatives: ['custom_a'] })]

  it('finds the exercises that share an id with an existing custom exercise', () => {
    expect(findConflicts(incoming, existing).map((e) => e.id)).toEqual(['custom_a'])
  })

  it('ignore: drops conflicting exercises', () => {
    expect(resolveConflicts(incoming, existing, taken, 'ignore').map((e) => e.id)).toEqual(['custom_b'])
  })

  it('replace: keeps everything, so the merge overwrites', () => {
    expect(resolveConflicts(incoming, existing, taken, 'replace')).toEqual(incoming)
  })

  it('copy: gives the conflicting exercise a new id and name, and remaps relations inside the pack', () => {
    const r = resolveConflicts(incoming, existing, taken, 'copy')
    const copy = r.find((e) => e.nameEn === 'New (2)')
    expect(copy).toBeDefined()
    expect(copy?.id).not.toBe('custom_a')
    expect(copy?.name).toBe('Neuf (2)')
    expect(r.find((e) => e.id === 'custom_b')?.alternatives).toEqual([copy?.id])
  })

  it('does nothing when there is no conflict, whatever the mode', () => {
    for (const mode of ['ignore', 'replace', 'copy'] as const) {
      expect(resolveConflicts([ex('custom_z')], existing, taken, mode)).toEqual([ex('custom_z')])
    }
  })

  it('copy: two copies get distinct ids', () => {
    const two = [ex('custom_a'), ex('custom_a2', { nameEn: 'Name custom_a' })]
    const r = resolveConflicts(two, new Set(['custom_a', 'custom_a2']), new Set(['custom_a', 'custom_a2']), 'copy')
    expect(new Set(r.map((e) => e.id)).size).toBe(2)
  })
})
