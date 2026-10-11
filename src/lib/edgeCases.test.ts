import { describe, expect, it } from 'vitest'
import { EXERCISES_SEED } from '../data/exercises.seed'
import type { Session } from '../types'
import { filterExercises } from './exercises'
import { calendarWeeks, heatLevel, muscleStats, overviewStats } from './heatmap'
import { exerciseHistory, formatSets, lastPerformance } from './sessions'
import { availableMetrics, personalRecords, progression, rpeTrend } from './tracking'

const session = (id: string, date: string, entries: Session['entries']): Session => ({ id, date, name: id, entries })
const set = (reps: number, weight: number, rpe?: number) => ({ reps, weight, ...(rpe ? { rpe } : {}) })

describe('volume per muscle: edge cases', () => {
  const exercises = new Map([['row', { primaryMuscles: ['lats'], secondaryMuscles: ['biceps'] }]])

  it('an exercise without sets does not count, even as the last workout', () => {
    const r = muscleStats([session('a', '2026-03-10', [{ exerciseId: 'row', sets: [] }])], exercises, 30, '2026-03-11')
    expect(r.load).toEqual({})
    expect(r.last).toEqual({})
  })

  it('“All” with only future sessions is one week and no volume', () => {
    const r = muscleStats([session('f', '2026-04-01', [{ exerciseId: 'row', sets: [set(5, 5)] }])], exercises, 0, '2026-03-11')
    expect(r.weeks).toBe(1)
    expect(r.load).toEqual({})
  })

  it('full heat over 30 days needs 15 sets per week, about 64 sets', () => {
    expect(heatLevel(64.2, 30 / 7)).toBeCloseTo(0.998, 2)
    expect(heatLevel(32, 30 / 7)).toBeCloseTo(0.5, 1)
  })
})

describe('calendar: edge cases', () => {
  it('when today is a Monday, only the first cell of the last column is in the past', () => {
    const last = calendarWeeks('2026-03-09').at(-1)
    expect(last?.map((d) => d.future)).toEqual([false, true, true, true, true, true, true])
  })
  it('when today is a Sunday, the whole last column is in the past', () => {
    const last = calendarWeeks('2026-03-15').at(-1)
    expect(last?.every((d) => !d.future)).toBe(true)
  })
})

describe('statistics: edge cases', () => {
  it('several sessions on the same day each count, but count as a single week in the streak', () => {
    const s = (id: string) => session(id, '2026-03-10', [{ exerciseId: 'x', sets: [set(1, 1)] }])
    const r = overviewStats([s('a'), s('b')], '2026-03-11')
    expect(r.sessions30).toBe(2)
    expect(r.streakWeeks).toBe(1)
  })
})

describe('tracking: edge cases', () => {
  it('bodyweight gives zero volume but reps and an RPE', () => {
    const s = [session('a', '2026-01-01', [{ exerciseId: 'tractions', sets: [set(8, 0, 8), set(6, 0, 9)] }])]
    const p = progression(s, 'tractions')
    expect(p[0]).toMatchObject({ volume: 0, maxWeight: 0, e1rm: 0, maxReps: 8 })
    expect(availableMetrics(p)).toEqual(['maxReps'])
    expect(rpeTrend(s, 'tractions')).toEqual([{ date: '2026-01-01', avg: 8.5, sets: 2 }])
    expect(personalRecords(s, 'tractions').maxReps?.reps).toBe(8)
  })

  it('the average RPE merges two sessions on the same day', () => {
    const s = [
      session('a', '2026-01-01', [{ exerciseId: 'e', sets: [set(5, 50, 7)] }]),
      session('b', '2026-01-01', [{ exerciseId: 'e', sets: [set(5, 50, 9)] }]),
    ]
    expect(rpeTrend(s, 'e')).toEqual([{ date: '2026-01-01', avg: 8, sets: 2 }])
  })

  it('the same exercise twice in a session is grouped in the history', () => {
    const s = [session('a', '2026-01-01', [{ exerciseId: 'e', sets: [set(5, 50)] }, { exerciseId: 'e', sets: [set(5, 55)] }])]
    expect(exerciseHistory(s, 'e')[0].sets).toHaveLength(2)
    expect(lastPerformance(s, 'e')?.sets).toEqual([set(5, 50), set(5, 55)])
    expect(formatSets(lastPerformance(s, 'e')?.sets ?? [])).toBe('5 @ 50 kg, 5 @ 55 kg')
  })
})

describe('search: edge cases', () => {
  it('several words must all match, in any order', () => {
    const r = filterExercises(EXERCISES_SEED, { query: 'poulie biceps' })
    expect(r.length).toBeGreaterThan(0)
    expect(filterExercises(EXERCISES_SEED, { query: 'biceps poulie' }).map((e) => e.id)).toEqual(r.map((e) => e.id))
  })
  it('a query with no match returns nothing', () => {
    expect(filterExercises(EXERCISES_SEED, { query: 'zzzzz' })).toEqual([])
  })
})
