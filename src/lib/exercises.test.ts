import { describe, expect, it } from 'vitest'
import type { Exercise } from '../types'
import { bilingual, cycleMuscle, filterExercises, mergeSeedExercise, normalize, sortExercises } from './exercises'
import { EXERCISES_SEED } from '../data/exercises.seed'

const byId = (id: string): Exercise => {
  const ex = EXERCISES_SEED.find((e) => e.id === id)
  if (!ex) throw new Error(id)
  return ex
}

describe('normalize', () => {
  it('removes accents and case', () => {
    expect(normalize('  Épaules ÉLÉVATION ')).toBe('epaules elevation')
  })
})

describe('bilingual', () => {
  it('a single line if identical (accents and case ignored)', () => {
    expect(bilingual('Face pull', 'face pull')).toEqual({ main: 'Face pull' })
    expect(bilingual('Biceps', undefined)).toEqual({ main: 'Biceps' })
  })
  it('English below otherwise', () => {
    expect(bilingual('Tractions pronation', 'Pull-ups')).toEqual({ main: 'Tractions pronation', sub: 'Pull-ups' })
  })
})

describe('filterExercises', () => {
  it('searches in French and in English, without accents', () => {
    expect(filterExercises(EXERCISES_SEED, { query: 'elevations laterales' }).length).toBeGreaterThan(0)
    expect(filterExercises(EXERCISES_SEED, { query: 'lateral raises' }).length).toBeGreaterThan(0)
  })
  it('searches by muscle', () => {
    const r = filterExercises(EXERCISES_SEED, { query: 'quadriceps' })
    expect(r.some((e) => e.id === 'leg_extension')).toBe(true)
  })
  it('combines query and filters', () => {
    const r = filterExercises(EXERCISES_SEED, { group: 'back', equipment: ['cable'], query: 'tirage' })
    expect(r.length).toBeGreaterThan(0)
    expect(r.every((e) => e.group === 'back' && e.equipmentType === 'cable')).toBe(true)
  })
  it('equipment filter accepts several types at once (OR)', () => {
    const both = filterExercises(EXERCISES_SEED, { group: 'chest', equipment: ['barbell', 'dumbbell'] })
    expect(both.length).toBeGreaterThan(0)
    expect(both.every((e) => e.equipmentType === 'barbell' || e.equipmentType === 'dumbbell')).toBe(true)
    const barbell = filterExercises(EXERCISES_SEED, { group: 'chest', equipment: ['barbell'] })
    const dumbbell = filterExercises(EXERCISES_SEED, { group: 'chest', equipment: ['dumbbell'] })
    expect(both).toHaveLength(barbell.length + dumbbell.length)
  })
  it('an empty equipment list means no equipment filter', () => {
    expect(filterExercises(EXERCISES_SEED, { equipment: [] })).toHaveLength(EXERCISES_SEED.length)
  })
  it('filters by primary muscle', () => {
    const r = filterExercises(EXERCISES_SEED, { muscle: 'calves' })
    expect(r.map((e) => e.id)).toContain('mollets_debout')
    expect(r.every((e) => e.primaryMuscles.includes('calves'))).toBe(true)
  })
  it('returns everything without a filter', () => {
    expect(filterExercises(EXERCISES_SEED, {})).toHaveLength(EXERCISES_SEED.length)
  })
})

describe('sortExercises', () => {
  it('group then name, without mutating the input', () => {
    const input = [byId('crunch'), byId('tractions'), byId('curl_barre')]
    const sorted = sortExercises(input)
    expect(sorted.map((e) => e.group)).toEqual(['back', 'arms', 'abs'])
    expect(input[0].id).toBe('crunch')
  })
})

describe('mergeSeedExercise', () => {
  it("keeps the user's notes and video, updates the rest", () => {
    const seed = byId('tractions')
    const existing: Exercise = { ...seed, name: 'ancien nom', notes: 'ma note', videoUrl: 'https://x.test' }
    const merged = mergeSeedExercise(seed, existing)
    expect(merged.name).toBe(seed.name)
    expect(merged.notes).toBe('ma note')
    expect(merged.videoUrl).toBe('https://x.test')
  })
  it('returns the seed if it does not exist yet', () => {
    expect(mergeSeedExercise(byId('crunch'), undefined)).toEqual(byId('crunch'))
  })
})

describe('cycleMuscle', () => {
  it('goes from none to primary, secondary, then none', () => {
    const a = cycleMuscle([], [], 'lats')
    expect(a).toEqual({ primary: ['lats'], secondary: [] })
    const b = cycleMuscle(a.primary, a.secondary, 'lats')
    expect(b).toEqual({ primary: [], secondary: ['lats'] })
    const c = cycleMuscle(b.primary, b.secondary, 'lats')
    expect(c).toEqual({ primary: [], secondary: [] })
  })
  it('does not touch the other muscles or the original arrays', () => {
    const primary = ['chest']
    const secondary = ['triceps']
    expect(cycleMuscle(primary, secondary, 'biceps')).toEqual({ primary: ['chest', 'biceps'], secondary: ['triceps'] })
    expect(primary).toEqual(['chest'])
  })
})
