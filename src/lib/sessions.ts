import type { Session, SessionEntry, SetEntry } from '../types'

/** RPE de 6 à 10 par demi-points. */
export const RPE_VALUES: readonly number[] = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10]

export function newId(): string {
  return crypto.randomUUID()
}

export function createSession(date: string, id: string = newId()): Session {
  return { id, date, name: '', entries: [] }
}

/** Série valide : répétitions entières ≥ 1, poids ≥ 0, RPE absent ou dans RPE_VALUES. */
export function normalizeSet(set: { reps: number; weight: number; rpe?: number }): SetEntry | null {
  const reps = Math.round(set.reps)
  if (!Number.isFinite(reps) || reps < 1) return null
  if (!Number.isFinite(set.weight) || set.weight < 0) return null
  const out: SetEntry = { reps, weight: Math.round(set.weight * 100) / 100 }
  if (set.rpe !== undefined && RPE_VALUES.includes(set.rpe)) out.rpe = set.rpe
  return out
}

/**
 * Copie d'une séance à une nouvelle date : mêmes exercices et mêmes séries
 * (point de départ), sans les notes.
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

/** Toutes les performances d'un exercice, de la plus récente à la plus ancienne. */
export function exerciseHistory(sessions: readonly Session[], exerciseId: string): Performance[] {
  const out: Performance[] = []
  for (const s of sessions) {
    const sets = s.entries.filter((e) => e.exerciseId === exerciseId).flatMap((e) => e.sets)
    if (sets.length) out.push({ date: s.date, sessionId: s.id, sets })
  }
  return out.sort((a, b) => b.date.localeCompare(a.date))
}

/**
 * Dernière performance connue d'un exercice, hors séance courante et pas plus
 * récente que `onOrBefore` (pour ne pas citer le futur quand on saisit une séance passée).
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

/** « 3×12 @ 45 kg, 10 @ 50 kg » : les séries identiques consécutives sont regroupées. */
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

/** Tri par date décroissante. */
export function sortSessions(sessions: readonly Session[]): Session[] {
  return [...sessions].sort((a, b) => b.date.localeCompare(a.date))
}

/** Parse un nombre saisi, virgule ou point décimal. NaN si invalide ou vide. */
export function parseNumberInput(raw: string): number {
  const s = raw.trim().replace(',', '.')
  return s === '' || !/^\d*\.?\d*$/.test(s) ? NaN : Number(s)
}
