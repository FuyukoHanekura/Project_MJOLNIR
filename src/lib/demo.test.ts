import { describe, expect, it } from 'vitest'
import { EXERCISES_SEED } from '../data/exercises.seed'
import { dayIndex } from './date'
import { buildDemoData, DEMO_WEEKS } from './demo'
import { buildExportFile } from './exportFormat'
import { RPE_VALUES } from './sessions'
import { isValidBodyWeight } from './tracking'

const TODAY = '2026-10-10' // samedi

describe('buildDemoData', () => {
  const { sessions, bodyWeights } = buildDemoData(TODAY)

  it('generates sessions and measurements, all flagged as demo', () => {
    expect(sessions.length).toBeGreaterThan(30)
    expect(bodyWeights.length).toBeGreaterThan(20)
    expect(sessions.every((s) => s.demo === true)).toBe(true)
    expect(bodyWeights.every((w) => w.demo === true)).toBe(true)
  })

  it('is deterministic', () => {
    expect(buildDemoData(TODAY)).toEqual({ sessions, bodyWeights })
  })

  it('only uses built-in exercises', () => {
    const ids = new Set(EXERCISES_SEED.map((e) => e.id))
    for (const s of sessions) for (const e of s.entries) expect(ids.has(e.exerciseId), e.exerciseId).toBe(true)
  })

  it('dates nothing in the future or beyond the window', () => {
    const oldest = dayIndex(TODAY) - DEMO_WEEKS * 7 - 6
    for (const x of [...sessions, ...bodyWeights]) {
      expect(x.date <= TODAY).toBe(true)
      expect(dayIndex(x.date)).toBeGreaterThanOrEqual(oldest)
    }
  })

  it('produces no future session, even on a Monday (first day of the week)', () => {
    const monday = buildDemoData('2026-10-05')
    expect(monday.sessions.every((s) => s.date <= '2026-10-05')).toBe(true)
    expect(monday.bodyWeights.every((w) => w.date <= '2026-10-05')).toBe(true)
  })

  it('has unique ids and dates', () => {
    expect(new Set(sessions.map((s) => s.id)).size).toBe(sessions.length)
    expect(new Set(bodyWeights.map((w) => w.date)).size).toBe(bodyWeights.length)
  })

  it('produces valid sets: whole reps, positive or zero weights, allowed RPE', () => {
    for (const s of sessions) {
      for (const e of s.entries) {
        expect(e.sets.length).toBeGreaterThan(0)
        for (const set of e.sets) {
          expect(Number.isInteger(set.reps) && set.reps > 0).toBe(true)
          expect(set.weight).toBeGreaterThanOrEqual(0)
          expect(RPE_VALUES).toContain(set.rpe)
        }
      }
    }
  })

  it('makes the weights progress over the weeks', () => {
    const squat = sessions.filter((s) => s.entries.some((e) => e.exerciseId === 'squat_barre')).map((s) => s.entries.find((e) => e.exerciseId === 'squat_barre')?.sets[0].weight ?? 0)
    expect(squat[squat.length - 1]).toBeGreaterThan(squat[0])
  })

  it('has plausible body weights', () => {
    expect(bodyWeights.every((w) => isValidBodyWeight(w.kg))).toBe(true)
  })

  it('is excluded from the export', () => {
    const file = buildExportFile([], [...sessions, { id: 'reelle', date: '2026-01-01', name: 'Ma séance', entries: [] }], [...bodyWeights, { date: '2026-01-01', kg: 70 }])
    expect(file.sessions.map((s) => s.id)).toEqual(['reelle'])
    expect(file.bodyWeights).toEqual([{ date: '2026-01-01', kg: 70 }])
  })
})
