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
  it('trie par date et moyenne sur 7 jours calendaires', () => {
    const r = withMovingAverage([
      { date: '2026-01-08', kg: 80 },
      { date: '2026-01-01', kg: 82 },
      { date: '2026-01-03', kg: 81 },
    ])
    expect(r.map((p) => p.date)).toEqual(['2026-01-01', '2026-01-03', '2026-01-08'])
    expect(r[0].avg).toBe(82)
    expect(r[1].avg).toBe(81.5)
    // 01-01 est à 7 jours de 01-08 : hors fenêtre (6 jours en arrière au plus)
    expect(r[2].avg).toBe(80.5)
  })

  it('gère une liste vide et un seul point', () => {
    expect(withMovingAverage([])).toEqual([])
    expect(withMovingAverage([{ date: '2026-01-01', kg: 70 }])[0].avg).toBe(70)
  })

  it('traverse les changements de mois et d\'heure d\'été', () => {
    const r = withMovingAverage([
      { date: '2026-03-27', kg: 70 },
      { date: '2026-03-30', kg: 72 },
      { date: '2026-04-02', kg: 74 },
    ])
    expect(r[2].avg).toBe(72)
  })
})

describe('isValidBodyWeight', () => {
  it('borne le poids de corps', () => {
    expect(isValidBodyWeight(75.5)).toBe(true)
    expect(isValidBodyWeight(5)).toBe(false)
    expect(isValidBodyWeight(500)).toBe(false)
    expect(isValidBodyWeight(NaN)).toBe(false)
  })
})

describe('estimateOneRepMax', () => {
  it('applique Epley et renvoie 0 sans poids', () => {
    expect(estimateOneRepMax(100, 1)).toBe(100)
    expect(estimateOneRepMax(100, 10)).toBe(133.3)
    expect(estimateOneRepMax(0, 10)).toBe(0)
  })
})

describe('progression', () => {
  const sessions = [
    one('2026-02-01', [set(10, 40), set(8, 50)]),
    one('2026-01-01', [set(12, 30)]),
    one('2026-02-01', [set(5, 60)]), // même date, autre séance
    one('2026-01-15', [set(5, 99)], 'autre'),
  ]
  it('une valeur par date, ordre chronologique, séances du même jour fusionnées', () => {
    const p = progression(sessions, 'e1')
    expect(p.map((x) => x.date)).toEqual(['2026-01-01', '2026-02-01'])
    expect(p[1]).toMatchObject({ maxWeight: 60, volume: 400 + 400 + 300, maxReps: 10 })
    expect(p[0].volume).toBe(360)
  })
  it('renvoie une liste vide pour un exercice jamais fait', () => {
    expect(progression(sessions, 'zzz')).toEqual([])
  })
})

describe('availableMetrics', () => {
  it('propose les répétitions seules au poids du corps', () => {
    expect(availableMetrics(progression([one('2026-01-01', [set(15, 0)])], 'e1'))).toEqual(['maxReps'])
  })
  it('propose tout pour un exercice chargé', () => {
    expect(availableMetrics(progression([one('2026-01-01', [set(8, 20)])], 'e1'))).toEqual(['maxWeight', 'e1rm', 'volume', 'maxReps'])
  })
  it('rien sans données', () => {
    expect(availableMetrics([])).toEqual([])
  })
})

describe('rpeTrend', () => {
  it('moyenne les RPE renseignés et ignore les séries sans RPE', () => {
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
  it('trouve charge max, 1RM estimé et répétitions max', () => {
    const r = personalRecords([one('2026-01-01', [set(10, 50), set(3, 80)]), one('2026-02-01', [set(12, 40)])], 'e1')
    expect(r.maxWeight).toMatchObject({ weight: 80, reps: 3, date: '2026-01-01' })
    expect(r.e1rm?.value).toBe(88)
    expect(r.maxReps).toMatchObject({ reps: 12, weight: 40, date: '2026-02-01' })
  })
  it('à charge égale, privilégie les répétitions puis le premier atteint', () => {
    const r = personalRecords([one('2026-01-01', [set(5, 80)]), one('2026-02-01', [set(5, 80)]), one('2026-03-01', [set(6, 80)])], 'e1')
    expect(r.maxWeight).toMatchObject({ reps: 6, date: '2026-03-01' })
    const same = personalRecords([one('2026-02-01', [set(5, 80)]), one('2026-01-01', [set(5, 80)])], 'e1')
    expect(same.maxWeight?.date).toBe('2026-01-01')
  })
  it('au poids du corps : pas de charge, seulement les répétitions', () => {
    const r = personalRecords([one('2026-01-01', [set(12, 0), set(15, 0)])], 'e1')
    expect(r.maxWeight).toBeUndefined()
    expect(r.e1rm).toBeUndefined()
    expect(r.maxReps?.reps).toBe(15)
  })
  it('vide si aucune série', () => {
    expect(personalRecords([], 'e1')).toEqual({})
  })
})

describe('exercisesWithData', () => {
  it('trie par dernière pratique et ignore les exercices sans série', () => {
    const s = [
      session('a', '2026-01-01', [{ exerciseId: 'x', sets: [set(1, 1)] }]),
      session('b', '2026-03-01', [{ exerciseId: 'y', sets: [set(1, 1)] }, { exerciseId: 'vide', sets: [] }]),
      session('c', '2026-02-01', [{ exerciseId: 'x', sets: [set(1, 1)] }]),
    ]
    expect(exercisesWithData(s)).toEqual(['y', 'x'])
  })
})

describe('isRecent', () => {
  it('compte aujourd\'hui, exclut le futur et le trop ancien', () => {
    expect(isRecent('2026-03-10', '2026-03-10', 30)).toBe(true)
    expect(isRecent('2026-02-09', '2026-03-10', 30)).toBe(true)
    expect(isRecent('2026-02-08', '2026-03-10', 30)).toBe(false)
    expect(isRecent('2026-03-11', '2026-03-10', 30)).toBe(false)
  })
})
