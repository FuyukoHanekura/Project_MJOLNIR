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

  it('generates unique UUID v4 values', () => {
    const ids = new Set(Array.from({ length: 50 }, () => newId()))
    expect(ids.size).toBe(50)
    for (const id of ids) expect(id).toMatch(uuid)
  })

  it('works without crypto.randomUUID (insecure context, e.g. HTTP on the local network)', () => {
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
  it('accepts a valid set and rounds', () => {
    expect(normalizeSet({ reps: 12.4, weight: 45.123 })).toEqual({ reps: 12, weight: 45.12 })
    expect(normalizeSet({ reps: 8, weight: 0 })).toEqual({ reps: 8, weight: 0 })
  })
  it('rejects reps < 1, negative weight or NaN', () => {
    expect(normalizeSet({ reps: 0, weight: 10 })).toBeNull()
    expect(normalizeSet({ reps: 5, weight: -1 })).toBeNull()
    expect(normalizeSet({ reps: NaN, weight: 10 })).toBeNull()
  })
  it('only keeps RPE values from 6 to 10 in half points', () => {
    expect(normalizeSet({ reps: 5, weight: 10, rpe: 8.5 })?.rpe).toBe(8.5)
    expect(normalizeSet({ reps: 5, weight: 10, rpe: 5 })?.rpe).toBeUndefined()
    expect(normalizeSet({ reps: 5, weight: 10, rpe: 8.2 })?.rpe).toBeUndefined()
  })
})

describe('duplicateSession', () => {
  it('copies exercises and sets to the new date, without sharing objects', () => {
    const src: Session = { id: 'a', date: '2026-01-01', name: 'Pull', notes: 'x', entries: [{ exerciseId: 'e1', sets: [set(10, 40, 8)] }] }
    const copy = duplicateSession(src, '2026-02-01', 'b')
    expect(copy).toEqual({ id: 'b', date: '2026-02-01', name: 'Pull', entries: [{ exerciseId: 'e1', sets: [set(10, 40, 8)] }] })
    copy.entries[0].sets[0].reps = 99
    expect(src.entries[0].sets[0].reps).toBe(10)
  })
  it('generates a default id', () => {
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
  it('sorts from newest to oldest and ignores exercises without sets', () => {
    expect(exerciseHistory(sessions, 'e1').map((p) => p.sessionId)).toEqual(['new', 'old'])
  })
  it('returns the last performance', () => {
    expect(lastPerformance(sessions, 'e1')?.sets).toEqual([set(12, 45)])
  })
  it('excludes the current session', () => {
    expect(lastPerformance(sessions, 'e1', { excludeSessionId: 'new' })?.sessionId).toBe('old')
  })
  it('ignores sessions after the given date', () => {
    expect(lastPerformance(sessions, 'e1', { onOrBefore: '2026-02-15' })?.sessionId).toBe('old')
  })
  it('returns undefined if never done', () => {
    expect(lastPerformance(sessions, 'zzz')).toBeUndefined()
  })
})

describe('formatSets', () => {
  it('groups identical consecutive sets', () => {
    expect(formatSets([set(12, 45), set(12, 45), set(12, 45)])).toBe('3×12 @ 45 kg')
  })
  it('lists the different sets', () => {
    expect(formatSets([set(12, 45), set(10, 50)])).toBe('12 @ 45 kg, 10 @ 50 kg')
  })
  it('omits the load at zero weight (bodyweight)', () => {
    expect(formatSets([set(15, 0), set(15, 0)])).toBe('2×15')
  })
  it('uses the provided formatter', () => {
    expect(formatSets([set(8, 22.5)], (n) => String(n).replace('.', ','))).toBe('8 @ 22,5 kg')
  })
  it('handles an empty list', () => {
    expect(formatSets([])).toBe('')
  })
})

describe('utilities', () => {
  it('counts the sets', () => {
    expect(
      countSets([
        { exerciseId: 'a', sets: [set(1, 1), set(1, 1)] },
        { exerciseId: 'b', sets: [set(1, 1)] },
      ]),
    ).toBe(3)
  })
  it('sorts by date descending without mutating', () => {
    const input = [s('a', '2026-01-01'), s('b', '2026-03-01')]
    expect(sortSessions(input).map((x) => x.id)).toEqual(['b', 'a'])
    expect(input[0].id).toBe('a')
  })
  it('parses numbers with a comma or a point', () => {
    expect(parseNumberInput('22,5')).toBe(22.5)
    expect(parseNumberInput('22.5')).toBe(22.5)
    expect(parseNumberInput('')).toBeNaN()
    expect(parseNumberInput('abc')).toBeNaN()
    expect(parseNumberInput('1.2.3')).toBeNaN()
  })
})
