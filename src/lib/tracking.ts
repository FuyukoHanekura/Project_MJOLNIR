import type { BodyWeight, Session, SetEntry } from '../types'
import { dayIndex } from './date'

const round = (n: number, digits = 1) => {
  const f = 10 ** digits
  return Math.round(n * f) / f
}

/* ---------- Poids de corps ---------- */

export interface BodyWeightPoint {
  date: string
  kg: number
  /** Average of the measurements of the last `windowDays` days (current day included). */
  avg: number
}

/** Body weights sorted by date, with a rolling average over a window of calendar days. */
export function withMovingAverage(points: readonly BodyWeight[], windowDays = 7): BodyWeightPoint[] {
  const sorted = [...points].sort((a, b) => a.date.localeCompare(b.date))
  return sorted.map((p, i) => {
    const day = dayIndex(p.date)
    let sum = 0
    let n = 0
    for (let j = i; j >= 0; j--) {
      if (day - dayIndex(sorted[j].date) >= windowDays) break
      sum += sorted[j].kg
      n++
    }
    return { date: p.date, kg: p.kg, avg: round(sum / n, 2) }
  })
}

export const MIN_BODY_KG = 20
export const MAX_BODY_KG = 400

export function isValidBodyWeight(kg: number): boolean {
  return Number.isFinite(kg) && kg >= MIN_BODY_KG && kg <= MAX_BODY_KG
}

/* ---------- Sets of an exercise ---------- */

/** Sets of an exercise grouped by date (several sessions on the same day are merged). */
function setsByDate(sessions: readonly Session[], exerciseId: string): Map<string, SetEntry[]> {
  const byDate = new Map<string, SetEntry[]>()
  for (const s of sessions) {
    const sets = s.entries.filter((e) => e.exerciseId === exerciseId).flatMap((e) => e.sets)
    if (sets.length) byDate.set(s.date, [...(byDate.get(s.date) ?? []), ...sets])
  }
  return byDate
}

/** Estimated one-rep max (Epley formula). 0 if the weight is zero. */
export function estimateOneRepMax(weight: number, reps: number): number {
  if (weight <= 0 || reps < 1) return 0
  return round(reps === 1 ? weight : weight * (1 + reps / 30))
}

export type ProgressMetric = 'maxWeight' | 'e1rm' | 'volume' | 'maxReps'

export interface ProgressPoint {
  date: string
  maxWeight: number
  e1rm: number
  /** Sum of reps × weight. */
  volume: number
  maxReps: number
}

/** Progress of an exercise, one value per date, from oldest to most recent. */
export function progression(sessions: readonly Session[], exerciseId: string): ProgressPoint[] {
  return [...setsByDate(sessions, exerciseId)]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, sets]) => ({
      date,
      maxWeight: Math.max(...sets.map((s) => s.weight)),
      e1rm: Math.max(...sets.map((s) => estimateOneRepMax(s.weight, s.reps))),
      volume: round(sets.reduce((v, s) => v + s.reps * s.weight, 0)),
      maxReps: Math.max(...sets.map((s) => s.reps)),
    }))
}

/** Metrics that have a value: a bodyweight exercise only has reps. */
export function availableMetrics(points: readonly ProgressPoint[]): ProgressMetric[] {
  const metrics: ProgressMetric[] = []
  if (points.some((p) => p.maxWeight > 0)) metrics.push('maxWeight', 'e1rm', 'volume')
  if (points.length) metrics.push('maxReps')
  return metrics
}

/* ---------- RPE ---------- */

export interface RpePoint {
  date: string
  /** Average RPE of the sets logged that day. */
  avg: number
  /** Number of sets with RPE. */
  sets: number
}

/** Average RPE curve of an exercise. Sets without RPE are ignored. */
export function rpeTrend(sessions: readonly Session[], exerciseId: string): RpePoint[] {
  const out: RpePoint[] = []
  for (const [date, sets] of [...setsByDate(sessions, exerciseId)].sort(([a], [b]) => a.localeCompare(b))) {
    const rpes = sets.flatMap((s) => (s.rpe === undefined ? [] : [s.rpe]))
    if (rpes.length) out.push({ date, avg: round(rpes.reduce((a, b) => a + b, 0) / rpes.length, 2), sets: rpes.length })
  }
  return out
}

/* ---------- Records ---------- */

export interface SetRecord {
  date: string
  reps: number
  weight: number
  /** Record value (weight, estimated 1RM or reps, depending on the case). */
  value: number
}

export interface Records {
  maxWeight?: SetRecord
  e1rm?: SetRecord
  maxReps?: SetRecord
}

/**
 * Personal records of an exercise. On a tie, the first record reached is kept.
 * Max weight and estimated 1RM only apply to sets with weight > 0.
 */
export function personalRecords(sessions: readonly Session[], exerciseId: string): Records {
  const records: Records = {}
  const ascending = [...setsByDate(sessions, exerciseId)].sort(([a], [b]) => a.localeCompare(b))
  for (const [date, sets] of ascending) {
    for (const s of sets) {
      if (s.weight > 0) {
        // At equal weight, more reps make a better record.
        const w = records.maxWeight
        if (!w || s.weight > w.weight || (s.weight === w.weight && s.reps > w.reps)) {
          records.maxWeight = { date, reps: s.reps, weight: s.weight, value: s.weight }
        }
        const e = estimateOneRepMax(s.weight, s.reps)
        if (!records.e1rm || e > records.e1rm.value) records.e1rm = { date, reps: s.reps, weight: s.weight, value: e }
      }
      const r = records.maxReps
      if (!r || s.reps > r.reps || (s.reps === r.reps && s.weight > r.weight)) {
        records.maxReps = { date, reps: s.reps, weight: s.weight, value: s.reps }
      }
    }
  }
  return records
}

/** Ids of exercises with at least one set, from most recently practised to oldest. */
export function exercisesWithData(sessions: readonly Session[]): string[] {
  const last = new Map<string, string>()
  for (const s of sessions) {
    for (const e of s.entries) {
      if (e.sets.length && (last.get(e.exerciseId) ?? '') < s.date) last.set(e.exerciseId, s.date)
    }
  }
  return [...last].sort((a, b) => b[1].localeCompare(a[1]) || a[0].localeCompare(b[0])).map(([id]) => id)
}

/** True if `date` is within the last `days` days (today included). */
export function isRecent(date: string, today: string, days: number): boolean {
  const diff = dayIndex(today) - dayIndex(date)
  return diff >= 0 && diff < days
}
