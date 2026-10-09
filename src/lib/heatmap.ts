import type { Exercise, Session } from '../types'
import { addDays, dayIndex, mondayOf } from './date'

/** Pleine chaleur : 15 séries par semaine et par muscle. */
export const REFERENCE_SETS_PER_WEEK = 15

/** Fenêtre en jours ; 0 = tout l'historique. */
export type Period = 7 | 30 | 90 | 0
export const PERIODS: readonly Period[] = [7, 30, 90, 0]

type MuscleSource = Pick<Exercise, 'primaryMuscles' | 'secondaryMuscles'>

export interface MuscleStats {
  /** Séries pondérées par muscle sur la période : 1 par série pour un principal, 0,5 pour un secondaire. */
  load: Record<string, number>
  /** Dernière séance travaillant le muscle en principal (toutes périodes confondues). */
  last: Record<string, string>
  /** Durée de la période en semaines (au moins 1 pour « Tout »). */
  weeks: number
}

/**
 * Volume par muscle sur la période. Les séances postérieures à `today` sont ignorées.
 * Les exercices inconnus (supprimés) sont ignorés.
 */
export function muscleStats(
  sessions: readonly Session[],
  exercises: ReadonlyMap<string, MuscleSource>,
  period: Period,
  today: string,
): MuscleStats {
  const start = period ? addDays(today, -(period - 1)) : null
  const load: Record<string, number> = {}
  const last: Record<string, string> = {}
  let first: string | null = null

  for (const s of sessions) {
    if (s.date > today) continue
    const inPeriod = !start || s.date >= (start as string)
    if (inPeriod && (first === null || s.date < first)) first = s.date
    for (const entry of s.entries) {
      const ex = exercises.get(entry.exerciseId)
      const n = entry.sets.length
      if (!ex || n === 0) continue
      for (const m of ex.primaryMuscles) {
        if (!last[m] || s.date > last[m]) last[m] = s.date
        if (inPeriod) load[m] = (load[m] ?? 0) + n
      }
      if (inPeriod) for (const m of ex.secondaryMuscles) load[m] = (load[m] ?? 0) + n * 0.5
    }
  }

  const weeks = period ? period / 7 : Math.max(1, (dayIndex(today) - dayIndex(first ?? today) + 1) / 7)
  return { load, last, weeks }
}

/** Intensité de 0 à 1 (plafonnée) : séries par semaine rapportées à la référence. */
export function heatLevel(load: number, weeks: number): number {
  return Math.min(1, Math.max(0, load / (REFERENCE_SETS_PER_WEEK * weeks)))
}

/* ---------- Calendrier ---------- */

export interface DayTotal {
  sets: number
  /** Somme de répétitions × poids (0 pour les séries au poids du corps). */
  volume: number
  sessions: Session[]
}

export function dayTotals(sessions: readonly Session[]): Map<string, DayTotal> {
  const totals = new Map<string, DayTotal>()
  for (const s of sessions) {
    const t = totals.get(s.date) ?? { sets: 0, volume: 0, sessions: [] }
    for (const e of s.entries) {
      for (const set of e.sets) {
        t.sets += 1
        t.volume += set.reps * set.weight
      }
    }
    t.sessions.push(s)
    totals.set(s.date, t)
  }
  return totals
}

export interface CalendarDay {
  date: string
  future: boolean
}

/** Colonnes de 7 jours (lundi à dimanche) sur `weeks` semaines, la dernière contenant `today`. */
export function calendarWeeks(today: string, weeks = 26): CalendarDay[][] {
  const monday = mondayOf(today)
  if (!monday) return []
  const start = addDays(monday, -(weeks - 1) * 7) as string
  return Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const date = addDays(start, w * 7 + d) as string
      return { date, future: date > today }
    }),
  )
}

/**
 * Valeur de pleine chaleur du calendrier : le 90e centile des jours actifs, pour qu'un jour
 * exceptionnel n'écrase pas toutes les autres cases. Au moins 1.
 */
export function calendarReference(values: readonly number[]): number {
  const v = values.filter((x) => x > 0).sort((a, b) => a - b)
  if (!v.length) return 1
  return Math.max(v[Math.min(v.length - 1, Math.floor(v.length * 0.9))], 1)
}

/* ---------- Statistiques résumées ---------- */

export interface OverviewStats {
  /** Séances sur les 30 derniers jours (aujourd'hui inclus). */
  sessions30: number
  /** Séries depuis le lundi de la semaine en cours. */
  setsThisWeek: number
  /** Semaines consécutives avec au moins une séance. */
  streakWeeks: number
}

export function overviewStats(sessions: readonly Session[], today: string): OverviewStats {
  const past = sessions.filter((s) => s.date <= today)
  const start30 = addDays(today, -29) as string
  const monday = mondayOf(today) as string
  const weeksWithSession = new Set(past.map((s) => mondayOf(s.date)))

  // Une semaine en cours encore vide ne casse pas la série : on repart de la précédente.
  let week = monday
  if (!weeksWithSession.has(week)) week = addDays(week, -7) as string
  let streakWeeks = 0
  while (weeksWithSession.has(week)) {
    streakWeeks++
    week = addDays(week, -7) as string
  }

  return {
    sessions30: past.filter((s) => s.date >= start30).length,
    setsThisWeek: past.filter((s) => s.date >= monday).reduce((n, s) => n + s.entries.reduce((m, e) => m + e.sets.length, 0), 0),
    streakWeeks,
  }
}
