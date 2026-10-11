import type { Session, SessionEntry, SetEntry } from '../types'

/** RPE from 6 to 10 in half points. */
export const RPE_VALUES: readonly number[] = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10]

/**
 * Unique identifier (UUID v4 format). `crypto.randomUUID` only exists in a secure context
 * (HTTPS or localhost): over HTTP on the local network (testing on a phone), we fall back to
 * `getRandomValues`, which remains available.
 */
export function newId(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  const b = crypto.getRandomValues(new Uint8Array(16))
  b[6] = (b[6] & 0x0f) | 0x40
  b[8] = (b[8] & 0x3f) | 0x80
  const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

export function createSession(date: string, id: string = newId()): Session {
  return { id, date, name: '', entries: [] }
}

/** Valid set: whole reps ≥ 1, weight ≥ 0, RPE absent or in RPE_VALUES. */
export function normalizeSet(set: { reps: number; weight: number; rpe?: number }): SetEntry | null {
  const reps = Math.round(set.reps)
  if (!Number.isFinite(reps) || reps < 1) return null
  if (!Number.isFinite(set.weight) || set.weight < 0) return null
  const out: SetEntry = { reps, weight: Math.round(set.weight * 100) / 100 }
  if (set.rpe !== undefined && RPE_VALUES.includes(set.rpe)) out.rpe = set.rpe
  return out
}

/**
 * Copy of a session to a new date: same exercises and same sets
 * (as a starting point), without the notes.
 */
export function duplicateSession(source: Session, date: string, id: string = newId()): Session {
  return {
    id,
    date,
    name: source.name,
    entries: source.entries.map((e) => ({ exerciseId: e.exerciseId, sets: e.sets.map((s) => ({ ...s })) })),
  }
}

export interface Performance {
  date: string
  sessionId: string
  sets: SetEntry[]
}

/** All performances of an exercise, from most recent to oldest. */
export function exerciseHistory(sessions: readonly Session[], exerciseId: string): Performance[] {
  const out: Performance[] = []
  for (const s of sessions) {
    const sets = s.entries.filter((e) => e.exerciseId === exerciseId).flatMap((e) => e.sets)
    if (sets.length) out.push({ date: s.date, sessionId: s.id, sets })
  }
  return out.sort((a, b) => b.date.localeCompare(a.date))
}

/**
 * Last known performance of an exercise, excluding the current session and no more
 * recent than `onOrBefore` (so as not to cite the future when logging a past session).
 */
export function lastPerformance(
  sessions: readonly Session[],
  exerciseId: string,
  opts: { excludeSessionId?: string; onOrBefore?: string } = {},
): Performance | undefined {
  const candidates = sessions.filter(
    (s) => s.id !== opts.excludeSessionId && (opts.onOrBefore === undefined || s.date <= opts.onOrBefore),
  )
  return exerciseHistory(candidates, exerciseId)[0]
}

/** “3×12 @ 45 kg, 10 @ 50 kg”: identical consecutive sets are grouped. */
export function formatSets(sets: readonly SetEntry[], fmt: (n: number) => string = String): string {
  const parts: string[] = []
  for (let i = 0; i < sets.length; ) {
    let j = i
    while (j < sets.length && sets[j].reps === sets[i].reps && sets[j].weight === sets[i].weight) j++
    const n = j - i
    const { reps, weight } = sets[i]
    const load = weight > 0 ? ` @ ${fmt(weight)} kg` : ''
    parts.push(n > 1 ? `${n}×${reps}${load}` : `${reps}${load}`)
    i = j
  }
  return parts.join(', ')
}

export function countSets(entries: readonly SessionEntry[]): number {
  return entries.reduce((n, e) => n + e.sets.length, 0)
}

/** Sorted by date, newest first. */
export function sortSessions(sessions: readonly Session[]): Session[] {
  return [...sessions].sort((a, b) => b.date.localeCompare(a.date))
}

/** Parses a typed number, comma or decimal point. NaN if invalid or empty. */
export function parseNumberInput(raw: string): number {
  const s = raw.trim().replace(',', '.')
  return s === '' || !/^\d*\.?\d*$/.test(s) ? NaN : Number(s)
}
