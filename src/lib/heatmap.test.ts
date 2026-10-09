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

  it('compte 1 par série pour un principal et 0,5 pour un secondaire', () => {
    const { load } = muscleStats(all, exercises, 7, TODAY)
    expect(load.lats).toBe(4)
    // 2 (secondaire, 4 séries × 0,5) + 3 (principal, séance du 5 mars incluse dans les 7 jours)
    expect(load.biceps).toBe(5)
  })

  it('applique la fenêtre de jours (bornes incluses)', () => {
    expect(muscleStats(all, exercises, 7, TODAY).load.biceps).toBe(5) // le 5 mars est le premier jour de la fenêtre
    const w7 = muscleStats([session('x', '2026-03-04', [{ exerciseId: 'curl', sets: sets(5) }])], exercises, 7, TODAY)
    expect(w7.load.biceps).toBeUndefined() // 11 - 6 = 5 mars : le 4 est dehors
    const w30 = muscleStats(all, exercises, 30, TODAY)
    expect(w30.load.biceps).toBe(5)
    expect(w30.load.lats).toBe(4)
  })

  it('« Tout » inclut tout l\'historique et mesure les semaines depuis la première séance', () => {
    const r = muscleStats(all, exercises, 0, TODAY)
    expect(r.load.lats).toBe(14)
    // du 1er janvier au 11 mars inclus : 70 jours = 10 semaines
    expect(r.weeks).toBe(10)
  })

  it('les périodes fixes ont une durée en semaines', () => {
    expect(muscleStats(all, exercises, 7, TODAY).weeks).toBe(1)
    expect(muscleStats(all, exercises, 30, TODAY).weeks).toBeCloseTo(30 / 7)
  })

  it('« Tout » vaut au moins 1 semaine, même sans données', () => {
    expect(muscleStats([], exercises, 0, TODAY).weeks).toBe(1)
    expect(muscleStats([session('z', TODAY, [])], exercises, 0, TODAY).weeks).toBe(1)
  })

  it('retient la dernière séance directe, hors période', () => {
    const r = muscleStats(all, exercises, 7, TODAY)
    expect(r.last.lats).toBe('2026-03-10')
    expect(r.last.biceps).toBe('2026-03-05') // principal seulement : le secondaire du 10 ne compte pas
  })

  it('ignore les séances futures et les exercices inconnus', () => {
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
  it('rapporte à 15 séries par semaine et plafonne à 1', () => {
    expect(heatLevel(REFERENCE_SETS_PER_WEEK, 1)).toBe(1)
    expect(heatLevel(7.5, 1)).toBe(0.5)
    expect(heatLevel(30, 1)).toBe(1)
    expect(heatLevel(15 * 4, 4)).toBe(1)
    expect(heatLevel(0, 4)).toBe(0)
  })
})

describe('dayTotals', () => {
  it('additionne séries et volume, et regroupe les séances du même jour', () => {
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
  it('produit 26 colonnes de 7 jours, lundi en premier, la dernière contenant aujourd\'hui', () => {
    const cols = calendarWeeks(TODAY)
    expect(cols).toHaveLength(26)
    expect(cols.every((c) => c.length === 7)).toBe(true)
    const last = cols[25]
    expect(last[0].date).toBe('2026-03-09') // lundi
    expect(last[2].date).toBe(TODAY)
    expect(last.map((d) => d.future)).toEqual([false, false, false, true, true, true, true])
  })
  it('enchaîne les jours sans trou sur toute la grille', () => {
    const days = calendarWeeks(TODAY).flat().map((d) => d.date)
    expect(new Set(days).size).toBe(182)
    expect([...days].sort()).toEqual(days)
  })
})

describe('calendarReference', () => {
  it('prend le 90e centile des jours actifs, au moins 1', () => {
    expect(calendarReference([])).toBe(1)
    expect(calendarReference([0, 0])).toBe(1)
    expect(calendarReference([5, 10, 12, 14, 15, 16, 18, 20, 22, 400])).toBe(400)
    expect(calendarReference([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 1000])).toBe(19)
    expect(calendarReference([0.2])).toBe(1)
  })
})

describe('overviewStats', () => {
  const s = (date: string, n = 3) => session(date, date, [{ exerciseId: 'row', sets: sets(n) }])

  it('compte séances sur 30 jours et séries de la semaine', () => {
    const r = overviewStats([s('2026-03-10', 4), s('2026-03-09', 2), s('2026-03-08', 5), s('2026-02-10')], TODAY)
    expect(r.sessions30).toBe(4) // le 10 février est à 29 jours : borne incluse
    expect(r.setsThisWeek).toBe(6) // lundi 9 et mardi 10 seulement
  })

  it('compte les semaines consécutives', () => {
    const r = overviewStats([s('2026-03-10'), s('2026-03-03'), s('2026-02-24'), s('2026-02-10')], TODAY)
    expect(r.streakWeeks).toBe(3)
  })

  it('ne casse pas la série si la semaine en cours est encore vide', () => {
    const r = overviewStats([s('2026-03-03'), s('2026-02-24')], TODAY)
    expect(r.streakWeeks).toBe(2)
  })

  it('vaut 0 sans séance récente et ignore le futur', () => {
    expect(overviewStats([], TODAY)).toEqual({ sessions30: 0, setsThisWeek: 0, streakWeeks: 0 })
    expect(overviewStats([s('2026-03-20')], TODAY).sessions30).toBe(0)
    expect(overviewStats([s('2025-01-01')], TODAY).streakWeeks).toBe(0)
  })
})

describe('heatColor', () => {
  it('renvoie null à 0 et une couleur sinon, différente selon le thème', () => {
    expect(heatColor(0, false)).toBeNull()
    expect(heatColor(-1, false)).toBeNull()
    expect(heatColor(0.5, false)).toMatch(/^rgb\(\d+,\d+,\d+\)$/)
    expect(heatColor(0.5, false)).not.toBe(heatColor(0.5, true))
  })
  it('plafonne au-dessus de 1 et se termine à l\'orange', () => {
    expect(heatColor(5, false)).toBe(heatColor(1, false))
    expect(heatColor(1, true)).toBe('rgb(255,154,31)')
  })
})
