import { describe, expect, it } from 'vitest'
import type { Session } from '../types'
import {
  countSets,
  createSession,
  duplicateSession,
  exerciseHistory,
  formatSets,
  lastPerformance,
  newId,
  normalizeSet,
  parseNumberInput,
  sortSessions,
} from './sessions'

const s = (id: string, date: string, entries: Session['entries'] = []): Session => ({ id, date, name: id, entries })
const set = (reps: number, weight: number, rpe?: number) => ({ reps, weight, ...(rpe ? { rpe } : {}) })

describe('newId', () => {
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

  it('génère des UUID v4 uniques', () => {
    const ids = new Set(Array.from({ length: 50 }, () => newId()))
    expect(ids.size).toBe(50)
    for (const id of ids) expect(id).toMatch(uuid)
  })

  it('fonctionne sans crypto.randomUUID (contexte non sécurisé, ex. HTTP sur le réseau local)', () => {
    const original = crypto.randomUUID
    Object.defineProperty(crypto, 'randomUUID', { value: undefined, configurable: true })
    try {
      expect(newId()).toMatch(uuid)
    } finally {
      Object.defineProperty(crypto, 'randomUUID', { value: original, configurable: true })
    }
  })
})

describe('normalizeSet', () => {
  it('accepte une série valide et arrondit', () => {
    expect(normalizeSet({ reps: 12.4, weight: 45.123 })).toEqual({ reps: 12, weight: 45.12 })
    expect(normalizeSet({ reps: 8, weight: 0 })).toEqual({ reps: 8, weight: 0 })
  })
  it('rejette répétitions < 1, poids négatif ou NaN', () => {
    expect(normalizeSet({ reps: 0, weight: 10 })).toBeNull()
    expect(normalizeSet({ reps: 5, weight: -1 })).toBeNull()
    expect(normalizeSet({ reps: NaN, weight: 10 })).toBeNull()
  })
  it('ne garde que les RPE de 6 à 10 par demi-points', () => {
    expect(normalizeSet({ reps: 5, weight: 10, rpe: 8.5 })?.rpe).toBe(8.5)
    expect(normalizeSet({ reps: 5, weight: 10, rpe: 5 })?.rpe).toBeUndefined()
    expect(normalizeSet({ reps: 5, weight: 10, rpe: 8.2 })?.rpe).toBeUndefined()
  })
})

describe('duplicateSession', () => {
  it('copie exercices et séries à la nouvelle date, sans partager les objets', () => {
    const src: Session = { id: 'a', date: '2026-01-01', name: 'Pull', notes: 'x', entries: [{ exerciseId: 'e1', sets: [set(10, 40, 8)] }] }
    const copy = duplicateSession(src, '2026-02-01', 'b')
    expect(copy).toEqual({ id: 'b', date: '2026-02-01', name: 'Pull', entries: [{ exerciseId: 'e1', sets: [set(10, 40, 8)] }] })
    copy.entries[0].sets[0].reps = 99
    expect(src.entries[0].sets[0].reps).toBe(10)
  })
  it('génère un id par défaut', () => {
    expect(duplicateSession(createSession('2026-01-01'), '2026-01-02').id).toBeTruthy()
  })
})

describe('exerciseHistory / lastPerformance', () => {
  const sessions = [
    s('old', '2026-01-01', [{ exerciseId: 'e1', sets: [set(10, 40)] }]),
    s('new', '2026-03-01', [
      { exerciseId: 'e1', sets: [set(12, 45)] },
      { exerciseId: 'e2', sets: [set(5, 100)] },
    ]),
    s('mid', '2026-02-01', [{ exerciseId: 'e2', sets: [set(8, 90)] }]),
    s('empty', '2026-04-01', [{ exerciseId: 'e1', sets: [] }]),
  ]
  it('trie du plus récent au plus ancien et ignore les exercices sans série', () => {
    expect(exerciseHistory(sessions, 'e1').map((p) => p.sessionId)).toEqual(['new', 'old'])
  })
  it('renvoie la dernière performance', () => {
    expect(lastPerformance(sessions, 'e1')?.sets).toEqual([set(12, 45)])
  })
  it('exclut la séance courante', () => {
    expect(lastPerformance(sessions, 'e1', { excludeSessionId: 'new' })?.sessionId).toBe('old')
  })
  it('ignore les séances postérieures à la date donnée', () => {
    expect(lastPerformance(sessions, 'e1', { onOrBefore: '2026-02-15' })?.sessionId).toBe('old')
  })
  it('renvoie undefined si jamais fait', () => {
    expect(lastPerformance(sessions, 'zzz')).toBeUndefined()
  })
})

describe('formatSets', () => {
  it('regroupe les séries identiques consécutives', () => {
    expect(formatSets([set(12, 45), set(12, 45), set(12, 45)])).toBe('3×12 @ 45 kg')
  })
  it('liste les séries différentes', () => {
    expect(formatSets([set(12, 45), set(10, 50)])).toBe('12 @ 45 kg, 10 @ 50 kg')
  })
  it('omet la charge à poids nul (poids du corps)', () => {
    expect(formatSets([set(15, 0), set(15, 0)])).toBe('2×15')
  })
  it('utilise le formateur fourni', () => {
    expect(formatSets([set(8, 22.5)], (n) => String(n).replace('.', ','))).toBe('8 @ 22,5 kg')
  })
  it('gère une liste vide', () => {
    expect(formatSets([])).toBe('')
  })
})

describe('utilitaires', () => {
  it('compte les séries', () => {
    expect(
      countSets([
        { exerciseId: 'a', sets: [set(1, 1), set(1, 1)] },
        { exerciseId: 'b', sets: [set(1, 1)] },
      ]),
    ).toBe(3)
  })
  it('trie par date décroissante sans muter', () => {
    const input = [s('a', '2026-01-01'), s('b', '2026-03-01')]
    expect(sortSessions(input).map((x) => x.id)).toEqual(['b', 'a'])
    expect(input[0].id).toBe('a')
  })
  it('parse les nombres avec virgule ou point', () => {
    expect(parseNumberInput('22,5')).toBe(22.5)
    expect(parseNumberInput('22.5')).toBe(22.5)
    expect(parseNumberInput('')).toBeNaN()
    expect(parseNumberInput('abc')).toBeNaN()
    expect(parseNumberInput('1.2.3')).toBeNaN()
  })
})
