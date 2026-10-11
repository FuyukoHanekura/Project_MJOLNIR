import { describe, expect, it } from 'vitest'
import type { Session } from '../types'
import { heatColor } from './heatColor'
import {
  calendarReference,
  calendarWeeks,
  dayTotals,
  heatLevel,
  muscleStats,
  overviewStats,
  REFERENCE_SETS_PER_WEEK,
} from './heatmap'

const exercises = new Map([
  ['row', { primaryMuscles: ['lats'], secondaryMuscles: ['biceps'] }],
  ['curl', { primaryMuscles: ['biceps'], secondaryMuscles: [] }],
])
const sets = (n: number, weight = 10) => Array.from({ length: n }, () => ({ reps: 10, weight }))
const session = (id: string, date: string, entries: Session['entries']): Session => ({ id, date, name: id, entries })
// 2026-03-11 est un mercredi.
const TODAY = '2026-03-11'

describe('muscleStats', () => {
  const all = [
    session('a', '2026-03-10', [{ exerciseId: 'row', sets: sets(4) }]),
    session('b', '2026-03-05', [{ exerciseId: 'curl', sets: sets(3) }]),
    session('c', '2026-01-01', [{ exerciseId: 'row', sets: sets(10) }]),
  ]

  it('counts 1 per set for a primary and 0.5 for a secondary', () => {
    const { load } = muscleStats(all, exercises, 7, TODAY)
    expect(load.lats).toBe(4)
    // 2 (secondary, 4 sets × 0.5) + 3 (primary, session of 5 March included in the 7 days)
    expect(load.biceps).toBe(5)
  })

  it('applies the day window (bounds included)', () => {
    expect(muscleStats(all, exercises, 7, TODAY).load.biceps).toBe(5) // 5 March is the first day of the window
    const w7 = muscleStats([session('x', '2026-03-04', [{ exerciseId: 'curl', sets: sets(5) }])], exercises, 7, TODAY)
    expect(w7.load.biceps).toBeUndefined() // 11 - 6 = 5 mars : le 4 est dehors
    const w30 = muscleStats(all, exercises, 30, TODAY)
    expect(w30.load.biceps).toBe(5)
    expect(w30.load.lats).toBe(4)
  })

  it('“All” includes the whole history and measures weeks since the first session', () => {
    const r = muscleStats(all, exercises, 0, TODAY)
    expect(r.load.lats).toBe(14)
    // du 1er janvier au 11 mars inclus : 70 jours = 10 semaines
    expect(r.weeks).toBe(10)
  })

  it('fixed periods have a length in weeks', () => {
    expect(muscleStats(all, exercises, 7, TODAY).weeks).toBe(1)
    expect(muscleStats(all, exercises, 30, TODAY).weeks).toBeCloseTo(30 / 7)
  })

  it('“All” is at least 1 week, even without data', () => {
    expect(muscleStats([], exercises, 0, TODAY).weeks).toBe(1)
    expect(muscleStats([session('z', TODAY, [])], exercises, 0, TODAY).weeks).toBe(1)
  })

  it('keeps the last direct session, outside the period', () => {
    const r = muscleStats(all, exercises, 7, TODAY)
    expect(r.last.lats).toBe('2026-03-10')
    expect(r.last.biceps).toBe('2026-03-05') // principal seulement : le secondaire du 10 ne compte pas
  })

  it('ignores future sessions and unknown exercises', () => {
    const r = muscleStats(
      [session('f', '2026-03-20', [{ exerciseId: 'row', sets: sets(9) }]), session('u', TODAY, [{ exerciseId: 'inconnu', sets: sets(9) }])],
      exercises,
      30,
      TODAY,
    )
    expect(r.load).toEqual({})
  })
})

describe('heatLevel', () => {
  it('scales to 15 sets per week and caps at 1', () => {
    expect(heatLevel(REFERENCE_SETS_PER_WEEK, 1)).toBe(1)
    expect(heatLevel(7.5, 1)).toBe(0.5)
    expect(heatLevel(30, 1)).toBe(1)
    expect(heatLevel(15 * 4, 4)).toBe(1)
    expect(heatLevel(0, 4)).toBe(0)
  })
})

describe('dayTotals', () => {
  it('adds up sets and volume, and groups sessions of the same day', () => {
    const t = dayTotals([
      session('a', '2026-03-10', [{ exerciseId: 'row', sets: sets(2, 20) }]),
      session('b', '2026-03-10', [{ exerciseId: 'curl', sets: sets(1, 0) }]),
    ])
    const d = t.get('2026-03-10')
    expect(d?.sets).toBe(3)
    expect(d?.volume).toBe(400)
    expect(d?.sessions).toHaveLength(2)
    expect(t.size).toBe(1)
  })
})

describe('calendarWeeks', () => {
  it('produces 26 columns of 7 days, Monday first, the last one containing today', () => {
    const cols = calendarWeeks(TODAY)
    expect(cols).toHaveLength(26)
    expect(cols.every((c) => c.length === 7)).toBe(true)
    const last = cols[25]
    expect(last[0].date).toBe('2026-03-09') // lundi
    expect(last[2].date).toBe(TODAY)
    expect(last.map((d) => d.future)).toEqual([false, false, false, true, true, true, true])
  })
  it('chains the days without gaps across the whole grid', () => {
    const days = calendarWeeks(TODAY).flat().map((d) => d.date)
    expect(new Set(days).size).toBe(182)
    expect([...days].sort()).toEqual(days)
  })
})

describe('calendarReference', () => {
  it('takes the 90th percentile of active days, at least 1', () => {
    expect(calendarReference([])).toBe(1)
    expect(calendarReference([0, 0])).toBe(1)
    expect(calendarReference([5, 10, 12, 14, 15, 16, 18, 20, 22, 400])).toBe(400)
    expect(calendarReference([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 1000])).toBe(19)
    expect(calendarReference([0.2])).toBe(1)
  })
})

describe('overviewStats', () => {
  const s = (date: string, n = 3) => session(date, date, [{ exerciseId: 'row', sets: sets(n) }])

  it('counts sessions over 30 days and sets of the week', () => {
    const r = overviewStats([s('2026-03-10', 4), s('2026-03-09', 2), s('2026-03-08', 5), s('2026-02-10')], TODAY)
    expect(r.sessions30).toBe(4) // 10 February is 29 days away: bound included
    expect(r.setsThisWeek).toBe(6) // lundi 9 et mardi 10 seulement
  })

  it('counts consecutive weeks', () => {
    const r = overviewStats([s('2026-03-10'), s('2026-03-03'), s('2026-02-24'), s('2026-02-10')], TODAY)
    expect(r.streakWeeks).toBe(3)
  })

  it('does not break the streak if the current week is still empty', () => {
    const r = overviewStats([s('2026-03-03'), s('2026-02-24')], TODAY)
    expect(r.streakWeeks).toBe(2)
  })

  it('is 0 without a recent session and ignores the future', () => {
    expect(overviewStats([], TODAY)).toEqual({ sessions30: 0, setsThisWeek: 0, streakWeeks: 0 })
    expect(overviewStats([s('2026-03-20')], TODAY).sessions30).toBe(0)
    expect(overviewStats([s('2025-01-01')], TODAY).streakWeeks).toBe(0)
  })
})

describe('heatColor', () => {
  it('returns null at 0 and a colour otherwise, different per theme', () => {
    expect(heatColor(0, false)).toBeNull()
    expect(heatColor(-1, false)).toBeNull()
    expect(heatColor(0.5, false)).toMatch(/^rgb\(\d+,\d+,\d+\)$/)
    expect(heatColor(0.5, false)).not.toBe(heatColor(0.5, true))
  })
  it('caps above 1 and ends at orange', () => {
    expect(heatColor(5, false)).toBe(heatColor(1, false))
    expect(heatColor(1, true)).toBe('rgb(255,154,31)')
  })
})
