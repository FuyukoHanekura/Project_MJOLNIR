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
  /** Moyenne des mesures des `windowDays` derniers jours (jour courant inclus). */
  avg: number
}

/** Poids de corps triés par date, avec moyenne glissante sur une fenêtre de jours calendaires. */
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

/* ---------- Séries d'un exercice ---------- */

/** Séries d'un exercice regroupées par date (plusieurs séances le même jour sont fusionnées). */
function setsByDate(sessions: readonly Session[], exerciseId: string): Map<string, SetEntry[]> {
  const byDate = new Map<string, SetEntry[]>()
  for (const s of sessions) {
    const sets = s.entries.filter((e) => e.exerciseId === exerciseId).flatMap((e) => e.sets)
    if (sets.length) byDate.set(s.date, [...(byDate.get(s.date) ?? []), ...sets])
  }
  return byDate
}

/** Estimation de la charge maximale sur 1 répétition (formule d'Epley). 0 si poids nul. */
export function estimateOneRepMax(weight: number, reps: number): number {
  if (weight <= 0 || reps < 1) return 0
  return round(reps === 1 ? weight : weight * (1 + reps / 30))
}

export type ProgressMetric = 'maxWeight' | 'e1rm' | 'volume' | 'maxReps'

export interface ProgressPoint {
  date: string
  maxWeight: number
  e1rm: number
  /** Somme de répétitions × poids. */
  volume: number
  maxReps: number
}

/** Évolution d'un exercice, une valeur par date, de la plus ancienne à la plus récente. */
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

/** Métriques qui ont une valeur : un exercice au poids du corps n'a que les répétitions. */
export function availableMetrics(points: readonly ProgressPoint[]): ProgressMetric[] {
  const metrics: ProgressMetric[] = []
  if (points.some((p) => p.maxWeight > 0)) metrics.push('maxWeight', 'e1rm', 'volume')
  if (points.length) metrics.push('maxReps')
  return metrics
}

/* ---------- RPE ---------- */

export interface RpePoint {
  date: string
  /** RPE moyen des séries renseignées ce jour-là. */
  avg: number
  /** Nombre de séries avec RPE. */
  sets: number
}

/** Courbe du RPE moyen d'un exercice. Les séries sans RPE sont ignorées. */
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
  /** Valeur du record (charge, 1RM estimé ou répétitions selon le cas). */
  value: number
}

export interface Records {
  maxWeight?: SetRecord
  e1rm?: SetRecord
  maxReps?: SetRecord
}

/**
 * Records personnels d'un exercice. À valeur égale, le premier record atteint est conservé.
 * Charge max et 1RM estimé ne concernent que les séries avec poids > 0.
 */
export function personalRecords(sessions: readonly Session[], exerciseId: string): Records {
  const records: Records = {}
  const ascending = [...setsByDate(sessions, exerciseId)].sort(([a], [b]) => a.localeCompare(b))
  for (const [date, sets] of ascending) {
    for (const s of sets) {
      if (s.weight > 0) {
        // À charge égale, plus de répétitions fait un meilleur record.
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

/** Ids des exercices ayant au moins une série, du plus récemment pratiqué au plus ancien. */
export function exercisesWithData(sessions: readonly Session[]): string[] {
  const last = new Map<string, string>()
  for (const s of sessions) {
    for (const e of s.entries) {
      if (e.sets.length && (last.get(e.exerciseId) ?? '') < s.date) last.set(e.exerciseId, s.date)
    }
  }
  return [...last].sort((a, b) => b[1].localeCompare(a[1]) || a[0].localeCompare(b[0])).map(([id]) => id)
}

/** Vrai si `date` est dans les `days` derniers jours (aujourd'hui inclus). */
export function isRecent(date: string, today: string, days: number): boolean {
  const diff = dayIndex(today) - dayIndex(date)
  return diff >= 0 && diff < days
}
