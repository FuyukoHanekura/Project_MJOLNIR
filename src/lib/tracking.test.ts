import { describe, expect, it } from 'vitest'
import type { Session, SetEntry } from '../types'
import {
  availableMetrics,
  estimateOneRepMax,
  exercisesWithData,
  isRecent,
  isValidBodyWeight,
  personalRecords,
  progression,
  rpeTrend,
  withMovingAverage,
} from './tracking'

const set = (reps: number, weight: number, rpe?: number): SetEntry => ({ reps, weight, ...(rpe ? { rpe } : {}) })
const session = (id: string, date: string, entries: Session['entries']): Session => ({ id, date, name: id, entries })
const one = (date: string, sets: SetEntry[], exerciseId = 'e1') => session(date, date, [{ exerciseId, sets }])

describe('withMovingAverage', () => {
  it('sorts by date and averages over 7 calendar days', () => {
    const r = withMovingAverage([
      { date: '2026-01-08', kg: 80 },
      { date: '2026-01-01', kg: 82 },
      { date: '2026-01-03', kg: 81 },
    ])
    expect(r.map((p) => p.date)).toEqual(['2026-01-01', '2026-01-03', '2026-01-08'])
    expect(r[0].avg).toBe(82)
    expect(r[1].avg).toBe(81.5)
    // 01-01 is 7 days from 01-08: outside the window (6 days back at most)
    expect(r[2].avg).toBe(80.5)
  })

  it('handles an empty list and a single point', () => {
    expect(withMovingAverage([])).toEqual([])
    expect(withMovingAverage([{ date: '2026-01-01', kg: 70 }])[0].avg).toBe(70)
  })

  it('crosses month and daylight-saving changes', () => {
    const r = withMovingAverage([
      { date: '2026-03-27', kg: 70 },
      { date: '2026-03-30', kg: 72 },
      { date: '2026-04-02', kg: 74 },
    ])
    expect(r[2].avg).toBe(72)
  })
})

describe('isValidBodyWeight', () => {
  it('bounds the body weight', () => {
    expect(isValidBodyWeight(75.5)).toBe(true)
    expect(isValidBodyWeight(5)).toBe(false)
    expect(isValidBodyWeight(500)).toBe(false)
    expect(isValidBodyWeight(NaN)).toBe(false)
  })
})

describe('estimateOneRepMax', () => {
  it('applies Epley and returns 0 without weight', () => {
    expect(estimateOneRepMax(100, 1)).toBe(100)
    expect(estimateOneRepMax(100, 10)).toBe(133.3)
    expect(estimateOneRepMax(0, 10)).toBe(0)
  })
})

describe('progression', () => {
  const sessions = [
    one('2026-02-01', [set(10, 40), set(8, 50)]),
    one('2026-01-01', [set(12, 30)]),
    one('2026-02-01', [set(5, 60)]), // same date, other session
    one('2026-01-15', [set(5, 99)], 'autre'),
  ]
  it('one value per date, chronological order, sessions of the same day merged', () => {
    const p = progression(sessions, 'e1')
    expect(p.map((x) => x.date)).toEqual(['2026-01-01', '2026-02-01'])
    expect(p[1]).toMatchObject({ maxWeight: 60, volume: 400 + 400 + 300, maxReps: 10 })
    expect(p[0].volume).toBe(360)
  })
  it('returns an empty list for an exercise never done', () => {
    expect(progression(sessions, 'zzz')).toEqual([])
  })
})

describe('availableMetrics', () => {
  it('offers reps only for bodyweight', () => {
    expect(availableMetrics(progression([one('2026-01-01', [set(15, 0)])], 'e1'))).toEqual(['maxReps'])
  })
  it('offers everything for a weighted exercise', () => {
    expect(availableMetrics(progression([one('2026-01-01', [set(8, 20)])], 'e1'))).toEqual(['maxWeight', 'e1rm', 'volume', 'maxReps'])
  })
  it('nothing without data', () => {
    expect(availableMetrics([])).toEqual([])
  })
})

describe('rpeTrend', () => {
  it('averages the logged RPE values and ignores sets without RPE', () => {
    const r = rpeTrend(
      [one('2026-01-02', [set(10, 40, 8), set(10, 40, 9), set(10, 40)]), one('2026-01-01', [set(10, 40, 7)]), one('2026-01-03', [set(10, 40)])],
      'e1',
    )
    expect(r).toEqual([
      { date: '2026-01-01', avg: 7, sets: 1 },
      { date: '2026-01-02', avg: 8.5, sets: 2 },
    ])
  })
})

describe('personalRecords', () => {
  it('finds max weight, estimated 1RM and max reps', () => {
    const r = personalRecords([one('2026-01-01', [set(10, 50), set(3, 80)]), one('2026-02-01', [set(12, 40)])], 'e1')
    expect(r.maxWeight).toMatchObject({ weight: 80, reps: 3, date: '2026-01-01' })
    expect(r.e1rm?.value).toBe(88)
    expect(r.maxReps).toMatchObject({ reps: 12, weight: 40, date: '2026-02-01' })
  })
  it('at equal weight, favours reps then the first reached', () => {
    const r = personalRecords([one('2026-01-01', [set(5, 80)]), one('2026-02-01', [set(5, 80)]), one('2026-03-01', [set(6, 80)])], 'e1')
    expect(r.maxWeight).toMatchObject({ reps: 6, date: '2026-03-01' })
    const same = personalRecords([one('2026-02-01', [set(5, 80)]), one('2026-01-01', [set(5, 80)])], 'e1')
    expect(same.maxWeight?.date).toBe('2026-01-01')
  })
  it('bodyweight: no weight, only reps', () => {
    const r = personalRecords([one('2026-01-01', [set(12, 0), set(15, 0)])], 'e1')
    expect(r.maxWeight).toBeUndefined()
    expect(r.e1rm).toBeUndefined()
    expect(r.maxReps?.reps).toBe(15)
  })
  it('empty if there are no sets', () => {
    expect(personalRecords([], 'e1')).toEqual({})
  })
})

describe('exercisesWithData', () => {
  it('sorts by last practice and ignores exercises without sets', () => {
    const s = [
      session('a', '2026-01-01', [{ exerciseId: 'x', sets: [set(1, 1)] }]),
      session('b', '2026-03-01', [{ exerciseId: 'y', sets: [set(1, 1)] }, { exerciseId: 'vide', sets: [] }]),
      session('c', '2026-02-01', [{ exerciseId: 'x', sets: [set(1, 1)] }]),
    ]
    expect(exercisesWithData(s)).toEqual(['y', 'x'])
  })
})

describe('isRecent', () => {
  it('counts today, excludes the future and anything too old', () => {
    expect(isRecent('2026-03-10', '2026-03-10', 30)).toBe(true)
    expect(isRecent('2026-02-09', '2026-03-10', 30)).toBe(true)
    expect(isRecent('2026-02-08', '2026-03-10', 30)).toBe(false)
    expect(isRecent('2026-03-11', '2026-03-10', 30)).toBe(false)
  })
})
