import type { Exercise, Session } from '../types'
import { addDays, dayIndex, mondayOf } from './date'

/** Full heat: 15 sets per week per muscle. */
export const REFERENCE_SETS_PER_WEEK = 15

/** Window in days; 0 = whole history. */
export type Period = 7 | 30 | 90 | 0
export const PERIODS: readonly Period[] = [7, 30, 90, 0]

type MuscleSource = Pick<Exercise, 'primaryMuscles' | 'secondaryMuscles'>

export interface MuscleStats {
  /** Weighted sets per muscle over the period: 1 per set for a primary muscle, 0.5 for a secondary. */
  load: Record<string, number>
  /** Last session working the muscle as a primary (across all periods). */
  last: Record<string, string>
  /** Length of the period in weeks (at least 1 for “All”). */
  weeks: number
}

/**
 * Volume per muscle over the period. Sessions after `today` are ignored.
 * Unknown (deleted) exercises are ignored.
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

/** Intensity from 0 to 1 (capped): sets per week relative to the reference. */
export function heatLevel(load: number, weeks: number): number {
  return Math.min(1, Math.max(0, load / (REFERENCE_SETS_PER_WEEK * weeks)))
}

/* ---------- Calendrier ---------- */

export interface DayTotal {
  sets: number
  /** Sum of reps × weight (0 for bodyweight sets). */
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

/** Columns of 7 days (Monday to Sunday) over `weeks` weeks, the last one containing `today`. */
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
 * Full-heat value of the calendar: the 90th percentile of active days, so that one
 * exceptional day does not wash out all the other cells. At least 1.
 */
export function calendarReference(values: readonly number[]): number {
  const v = values.filter((x) => x > 0).sort((a, b) => a - b)
  if (!v.length) return 1
  return Math.max(v[Math.min(v.length - 1, Math.floor(v.length * 0.9))], 1)
}

/* ---------- Summary statistics ---------- */

export interface OverviewStats {
  /** Sessions over the last 30 days (today included). */
  sessions30: number
  /** Sets since Monday of the current week. */
  setsThisWeek: number
  /** Consecutive weeks with at least one session. */
  streakWeeks: number
}

export function overviewStats(sessions: readonly Session[], today: string): OverviewStats {
  const past = sessions.filter((s) => s.date <= today)
  const start30 = addDays(today, -29) as string
  const monday = mondayOf(today) as string
  const weeksWithSession = new Set(past.map((s) => mondayOf(s.date)))

  // An empty current week does not break the streak: we start from the previous one.
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
