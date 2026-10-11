import { MUSCLE_BY_ID } from '../data/muscles'
import type { BodyWeight, EquipmentType, Exercise, ExerciseGroup, ExerciseNote, ExportFile, Session } from '../types'
import { dayIndex, parseLocalDate } from './date'
import { EQUIPMENT_TYPES, GROUPS } from './exercises'
import { newId, normalizeSet } from './sessions'
import { isValidBodyWeight } from './tracking'

/** Export format version (schema integer). Any format change adds a migration. */
export const EXPORT_VERSION = 1

/* ---------- Rapport ---------- */

export type IssueKind = 'session' | 'bodyWeight' | 'exercise' | 'note'
export type IssueReason =
  | 'notObject'
  | 'badDate'
  | 'badWeight'
  | 'noName'
  | 'badGroup'
  | 'badEquipment'
  | 'noPrimaryMuscle'
  | 'unknownMuscle'
  | 'seedIdConflict'
  | 'badId'
  | 'unknownExercise'

/** Item skipped on import: `index` is its position (starting at 1) in the file. */
export interface ImportIssue {
  kind: IssueKind
  index: number
  reason: IssueReason
  /** Readable name or id of the item, when known. */
  label?: string
}

/* ---------- Utilitaires de lecture ---------- */

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)
const asString = (v: unknown): string => (typeof v === 'string' ? v.trim() : '')
const asStrings = (v: unknown): string[] => (Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === 'string' && x !== ''))] : [])
const asHttpUrl = (v: unknown): string | undefined => {
  const s = asString(v)
  return /^https?:\/\/\S+$/i.test(s) ? s : undefined
}

/** Lowercase without accents, words separated by “_”: “Développé nuque” → “developpe_nuque”. */
export function slugify(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 48)
}

/** Stable id of a custom exercise, unique among `taken`. */
export function uniqueExerciseId(name: string, taken: ReadonlySet<string>): string {
  const base = `custom_${slugify(name) || 'exercice'}`
  if (!taken.has(base)) return base
  for (let n = 2; ; n++) if (!taken.has(`${base}_${n}`)) return `${base}_${n}`
}

const ID_PATTERN = /^[a-z0-9][a-z0-9_]{0,63}$/

/* ---------- Exercise validation ---------- */

export interface ExerciseContext {
  /** Ids already in use (built-in and existing exercises): used to generate unique ids. */
  takenIds: Set<string>
  /** Built-in ids: an imported exercise cannot replace them. */
  seedIds: ReadonlySet<string>
}

export type ExerciseResult = { ok: true; exercise: Exercise } | { ok: false; reason: IssueReason }

/**
 * Validates and completes a custom exercise (entered in the form, bulk imported or read from
 * an export). Only the name, group, equipment and one primary muscle are required.
 */
export function parseExercise(raw: unknown, ctx: ExerciseContext): ExerciseResult {
  if (!isRecord(raw)) return { ok: false, reason: 'notObject' }
  const name = asString(raw.name)
  if (!name) return { ok: false, reason: 'noName' }
  if (!GROUPS.includes(raw.group as ExerciseGroup)) return { ok: false, reason: 'badGroup' }
  if (!EQUIPMENT_TYPES.includes(raw.equipmentType as EquipmentType)) return { ok: false, reason: 'badEquipment' }

  const primary = asStrings(raw.primaryMuscles)
  const secondary = asStrings(raw.secondaryMuscles).filter((m) => !primary.includes(m))
  if ([...primary, ...secondary].some((m) => !MUSCLE_BY_ID.has(m))) return { ok: false, reason: 'unknownMuscle' }
  if (primary.length === 0) return { ok: false, reason: 'noPrimaryMuscle' }

  let id = asString(raw.id)
  if (id) {
    if (!ID_PATTERN.test(id)) return { ok: false, reason: 'badId' }
    if (ctx.seedIds.has(id)) return { ok: false, reason: 'seedIdConflict' }
  } else {
    id = uniqueExerciseId(name, ctx.takenIds)
  }
  ctx.takenIds.add(id)

  const relations = (v: unknown) => asStrings(v).filter((x) => x !== id)
  const instructions = asString(raw.instructions)
  const exercise: Exercise = {
    id,
    name,
    nameEn: asString(raw.nameEn) || name,
    group: raw.group as ExerciseGroup,
    movementPattern: asString(raw.movementPattern) || 'custom',
    equipmentType: raw.equipmentType as EquipmentType,
    primaryMuscles: primary,
    secondaryMuscles: secondary,
    alternatives: relations(raw.alternatives),
    antagonists: relations(raw.antagonists),
    complements: relations(raw.complements),
    instructions,
    instructionsEn: asString(raw.instructionsEn) || instructions,
    isCustom: true,
  }
  const machineType = asString(raw.machineType)
  if (machineType) {
    exercise.machineType = machineType
    exercise.machineTypeEn = asString(raw.machineTypeEn) || machineType
  }
  const videoUrl = asHttpUrl(raw.videoUrl)
  if (videoUrl) exercise.videoUrl = videoUrl
  const notes = asString(raw.notes)
  if (notes) exercise.notes = notes
  return { ok: true, exercise }
}

/** Validates a list of exercises (bulk import file or section of an export). */
export function parseExerciseList(raw: unknown, ctx: ExerciseContext): { exercises: Exercise[]; issues: ImportIssue[] } {
  const list = Array.isArray(raw) ? raw : []
  const byId = new Map<string, Exercise>()
  const issues: ImportIssue[] = []
  list.forEach((item, i) => {
    const r = parseExercise(item, ctx)
    if (r.ok) byId.set(r.exercise.id, r.exercise)
    else issues.push({ kind: 'exercise', index: i + 1, reason: r.reason, label: isRecord(item) ? asString(item.name) || undefined : undefined })
  })
  return { exercises: [...byId.values()], issues }
}

/**
 * Bulk import file: an array of exercises, or an object `{ "exercises": [...] }`.
 * undefined if the content has neither shape.
 */
export function bulkExerciseArray(raw: unknown): unknown[] | undefined {
  if (Array.isArray(raw)) return raw
  if (isRecord(raw) && Array.isArray(raw.exercises)) return raw.exercises
  return undefined
}

/* ---------- Session and body weight validation ---------- */

type SessionResult = { ok: true; session: Session; droppedSets: number } | { ok: false; reason: IssueReason }

export function parseSession(raw: unknown): SessionResult {
  if (!isRecord(raw)) return { ok: false, reason: 'notObject' }
  const date = asString(raw.date)
  if (!parseLocalDate(date)) return { ok: false, reason: 'badDate' }

  let droppedSets = 0
  const entries = (Array.isArray(raw.entries) ? raw.entries : []).flatMap((e) => {
    const exerciseId = isRecord(e) ? asString(e.exerciseId) : ''
    if (!exerciseId || !isRecord(e)) return []
    const sets = (Array.isArray(e.sets) ? e.sets : []).flatMap((s) => {
      const set = isRecord(s) ? normalizeSet({ reps: Number(s.reps), weight: Number(s.weight), rpe: typeof s.rpe === 'number' ? s.rpe : undefined }) : null
      if (!set) droppedSets++
      return set ? [set] : []
    })
    return [{ exerciseId, sets }]
  })

  const session: Session = { id: asString(raw.id) || newId(), date, name: asString(raw.name).slice(0, 60), entries }
  const notes = asString(raw.notes)
  if (notes) session.notes = notes.slice(0, 2000)
  return { ok: true, session, droppedSets }
}

export function parseBodyWeight(raw: unknown): { ok: true; value: BodyWeight } | { ok: false; reason: IssueReason } {
  if (!isRecord(raw)) return { ok: false, reason: 'notObject' }
  const date = asString(raw.date)
  if (!parseLocalDate(date)) return { ok: false, reason: 'badDate' }
  const kg = Number(raw.kg)
  if (!isValidBodyWeight(kg)) return { ok: false, reason: 'badWeight' }
  return { ok: true, value: { date, kg: Math.round(kg * 100) / 100 } }
}

/* ---------- Export ---------- */

/**
 * Builds the export file: custom exercises, notes on built-in exercises, sessions, weights.
 * Demo data is excluded.
 */
export function buildExportFile(
  exercises: readonly Exercise[],
  sessions: readonly Session[],
  bodyWeights: readonly BodyWeight[],
  now: Date = new Date(),
): ExportFile {
  const byId = (a: { id: string }, b: { id: string }) => a.id.localeCompare(b.id)
  const exerciseNotes: ExerciseNote[] = exercises
    .filter((e) => !e.isCustom && (e.notes || e.videoUrl))
    .sort(byId)
    .map((e) => ({ id: e.id, ...(e.notes ? { notes: e.notes } : {}), ...(e.videoUrl ? { videoUrl: e.videoUrl } : {}) }))
  return {
    version: EXPORT_VERSION,
    exportedAt: now.toISOString(),
    exercises: exercises.filter((e) => e.isCustom).sort(byId),
    exerciseNotes,
    sessions: sessions.filter((s) => !s.demo).sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id)),
    bodyWeights: bodyWeights.filter((w) => !w.demo).sort((a, b) => a.date.localeCompare(b.date)),
  }
}

export function exportFileName(date: string): string {
  return `carnet-de-salle-${date}.json`
}

/* ---------- Migrations ---------- */

type Migration = (data: Record<string, unknown>) => Record<string, unknown>

/**
 * `MIGRATIONS[n]` turns a version n file into version n+1. Empty as long as the format
 * is at version 1; on each change, bump EXPORT_VERSION and add the migration.
 */
export const MIGRATIONS: Readonly<Record<number, Migration>> = {}

export function runMigrations(
  data: Record<string, unknown>,
  from: number,
  to: number,
  migrations: Readonly<Record<number, Migration>> = MIGRATIONS,
): Record<string, unknown> {
  let current = data
  for (let v = from; v < to; v++) {
    const step = migrations[v]
    if (!step) throw new Error(`Migration manquante : ${v} -> ${v + 1}`)
    current = { ...step(current), version: v + 1 }
  }
  return current
}

/* ---------- Reading an export file ---------- */

export type FileError = 'notJson' | 'notObject' | 'noVersion' | 'newerVersion'

export interface ParsedExport {
  sessions: Session[]
  bodyWeights: BodyWeight[]
  exercises: Exercise[]
  exerciseNotes: ExerciseNote[]
}

export type ParseResult =
  | { ok: true; data: ParsedExport; issues: ImportIssue[]; droppedSets: number }
  | { ok: false; error: FileError }

/** Reads the text of an export: JSON, version, migrations, then item-by-item validation. */
export function parseExportText(text: string, ctx: ExerciseContext): ParseResult {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    return { ok: false, error: 'notJson' }
  }
  if (!isRecord(raw)) return { ok: false, error: 'notObject' }
  const version = raw.version
  if (typeof version !== 'number' || !Number.isInteger(version) || version < 1) return { ok: false, error: 'noVersion' }
  if (version > EXPORT_VERSION) return { ok: false, error: 'newerVersion' }
  const data = runMigrations(raw, version, EXPORT_VERSION)

  const issues: ImportIssue[] = []
  let droppedSets = 0

  const sessionsById = new Map<string, Session>()
  ;(Array.isArray(data.sessions) ? data.sessions : []).forEach((item, i) => {
    const r = parseSession(item)
    if (r.ok) {
      sessionsById.set(r.session.id, r.session)
      droppedSets += r.droppedSets
    } else issues.push({ kind: 'session', index: i + 1, reason: r.reason })
  })

  const weightsByDate = new Map<string, BodyWeight>()
  ;(Array.isArray(data.bodyWeights) ? data.bodyWeights : []).forEach((item, i) => {
    const r = parseBodyWeight(item)
    if (r.ok) weightsByDate.set(r.value.date, r.value)
    else issues.push({ kind: 'bodyWeight', index: i + 1, reason: r.reason })
  })

  const list = parseExerciseList(data.exercises, ctx)
  issues.push(...list.issues)

  const exerciseNotes: ExerciseNote[] = []
  ;(Array.isArray(data.exerciseNotes) ? data.exerciseNotes : []).forEach((item, i) => {
    const id = isRecord(item) ? asString(item.id) : ''
    if (!id) {
      issues.push({ kind: 'note', index: i + 1, reason: 'badId' })
      return
    }
    const r = item as Record<string, unknown>
    const note: ExerciseNote = { id }
    const notes = asString(r.notes)
    if (notes) note.notes = notes
    const videoUrl = asHttpUrl(r.videoUrl)
    if (videoUrl) note.videoUrl = videoUrl
    if (note.notes || note.videoUrl) exerciseNotes.push(note)
  })

  return {
    ok: true,
    data: { sessions: [...sessionsById.values()], bodyWeights: [...weightsByDate.values()], exercises: list.exercises, exerciseNotes },
    issues,
    droppedSets,
  }
}

/* ---------- Plan d'import ---------- */

export type ImportMode = 'merge' | 'replace'

export interface CurrentData {
  exercises: readonly Exercise[]
  sessions: readonly Session[]
  bodyWeights: readonly BodyWeight[]
}

export interface Counter {
  added: number
  updated: number
}

export interface ImportSummary {
  sessions: Counter
  bodyWeights: Counter
  exercises: Counter
  /** Built-in exercises whose notes or video were restored. */
  notes: number
}

export interface ImportPlan {
  exercisesPut: Exercise[]
  exerciseIdsDelete: string[]
  sessionsPut: Session[]
  sessionIdsDelete: string[]
  bodyWeightsPut: BodyWeight[]
  bodyWeightDatesDelete: string[]
  summary: ImportSummary
  /** Skipped items detected while computing the plan (notes of an unknown exercise). */
  issues: ImportIssue[]
}

/**
 * Computes the writes to perform, without touching the database.
 * - “Merge”: adds what is missing; on equal id or date, the file replaces the existing item.
 * - “Replace”: clears sessions, weights and custom exercises, then imports the file (notes
 *   on built-in exercises absent from the file are erased). Settings are not affected.
 */
export function computeImport(current: CurrentData, data: ParsedExport, mode: ImportMode): ImportPlan {
  const replace = mode === 'replace'
  const issues: ImportIssue[] = []

  const baseExercises = current.exercises.filter((e) => !e.isCustom)
  const keptCustom = replace ? [] : current.exercises.filter((e) => e.isCustom)
  const finalIds = new Set([...baseExercises, ...keptCustom, ...data.exercises].map((e) => e.id))

  // References to exercises that do not exist in the final result are removed.
  const clean = (e: Exercise): Exercise => ({
    ...e,
    alternatives: e.alternatives.filter((id) => finalIds.has(id)),
    antagonists: e.antagonists.filter((id) => finalIds.has(id)),
    complements: e.complements.filter((id) => finalIds.has(id)),
  })

  const count = <K>(existing: ReadonlySet<K>, incoming: readonly K[]): Counter => {
    const updated = incoming.filter((k) => existing.has(k)).length
    return { added: incoming.length - updated, updated }
  }
  const existingCustom = new Set(current.exercises.filter((e) => e.isCustom).map((e) => e.id))

  // Notes and videos of built-in exercises.
  const notesById = new Map(data.exerciseNotes.map((n) => [n.id, n]))
  const exercisesPut: Exercise[] = data.exercises.map(clean)
  let restoredNotes = 0
  data.exerciseNotes.forEach((n, i) => {
    if (!baseExercises.some((e) => e.id === n.id)) issues.push({ kind: 'note', index: i + 1, reason: 'unknownExercise', label: n.id })
  })
  for (const base of baseExercises) {
    const note = notesById.get(base.id)
    if (!note && !(replace && (base.notes || base.videoUrl))) continue
    const next: Exercise = { ...base }
    if (replace) {
      delete next.notes
      delete next.videoUrl
    }
    if (note?.notes) next.notes = note.notes
    if (note?.videoUrl) next.videoUrl = note.videoUrl
    if (note) restoredNotes++
    exercisesPut.push(next)
  }

  return {
    exercisesPut,
    exerciseIdsDelete: replace ? [...existingCustom] : [],
    sessionsPut: data.sessions,
    sessionIdsDelete: replace ? current.sessions.map((s) => s.id) : [],
    bodyWeightsPut: data.bodyWeights,
    bodyWeightDatesDelete: replace ? current.bodyWeights.map((w) => w.date) : [],
    summary: {
      sessions: replace ? { added: data.sessions.length, updated: 0 } : count(new Set(current.sessions.map((s) => s.id)), data.sessions.map((s) => s.id)),
      bodyWeights: replace ? { added: data.bodyWeights.length, updated: 0 } : count(new Set(current.bodyWeights.map((w) => w.date)), data.bodyWeights.map((w) => w.date)),
      exercises: replace ? { added: data.exercises.length, updated: 0 } : count(existingCustom, data.exercises.map((e) => e.id)),
      notes: restoredNotes,
    },
    issues,
  }
}

/* ---------- Rappel d'export ---------- */

export const REMINDER_WEEK_OPTIONS: readonly number[] = [0, 1, 2, 4, 8, 12]
export const DEFAULT_REMINDER_WEEKS = 4

/**
 * Should we remind the user to export? Reference: the last export, otherwise the oldest data.
 * With no data and no export, never; `weeks` at 0 disables the reminder.
 */
export function exportReminderDue(opts: { weeks: number; today: string; lastExportAt?: string; oldestDataDate?: string }): boolean {
  if (opts.weeks <= 0) return false
  const reference = opts.lastExportAt ?? opts.oldestDataDate
  if (!reference) return false
  const days = dayIndex(opts.today) - dayIndex(reference)
  return Number.isFinite(days) && days >= opts.weeks * 7
}
