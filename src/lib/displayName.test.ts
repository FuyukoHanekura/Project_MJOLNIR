import { describe, expect, it } from 'vitest'
import { EXERCISES_SEED } from '../data/exercises.seed'
import { MUSCLES } from '../data/muscles'
import { displayNames, localizedName } from './displayName'
import { filterExercises, sortExercises } from './exercises'

describe('localizedName', () => {
  it('gives the English name in English and the original name in French', () => {
    const item = { name: 'Grand dorsal', nameEn: 'Lats' }
    expect(localizedName(item, 'en')).toBe('Lats')
    expect(localizedName(item, 'fr')).toBe('Grand dorsal')
  })
  it('falls back to the original name without a usable English name', () => {
    expect(localizedName({ name: 'Curl 21' }, 'en')).toBe('Curl 21')
    expect(localizedName({ name: 'Curl 21', nameEn: '   ' }, 'en')).toBe('Curl 21')
  })
  it('treats any language other than English as French', () => {
    expect(localizedName({ name: 'Tractions', nameEn: 'Pull-ups' }, 'de')).toBe('Tractions')
  })
})

describe('displayNames', () => {
  it('in English: the English name alone, never a second line', () => {
    expect(displayNames('Tractions pronation', 'Pull-ups', 'en')).toEqual({ main: 'Pull-ups' })
    expect(displayNames('Biceps', 'Biceps', 'en')).toEqual({ main: 'Biceps' })
  })
  it('in French: original name in large type, English smaller', () => {
    expect(displayNames('Tractions pronation', 'Pull-ups', 'fr')).toEqual({ main: 'Tractions pronation', sub: 'Pull-ups' })
  })
  it('in French: a single line if both names are identical (accents and case ignored)', () => {
    expect(displayNames('Face pull', 'face pull', 'fr')).toEqual({ main: 'Face pull' })
    expect(displayNames('Épaules', 'Epaules', 'fr')).toEqual({ main: 'Épaules' })
    expect(displayNames('Face pull', undefined, 'fr')).toEqual({ main: 'Face pull' })
  })
  it('in English without an English name: falls back to the original name', () => {
    expect(displayNames('Curl 21', undefined, 'en')).toEqual({ main: 'Curl 21' })
  })
})

describe('sorting by language', () => {
  const pick = (ids: string[]) => EXERCISES_SEED.filter((e) => ids.includes(e.id))
  it('sorts on the displayed name: English in English, French in French', () => {
    // Same group (back): in French “Tirage…” comes before “Tractions…”; in English “Assisted…” comes before “Lat…”.
    const two = pick(['tirage_vertical', 'traction_assistee'])
    expect(sortExercises(two, 'fr').map((e) => e.id)).toEqual(['tirage_vertical', 'traction_assistee'])
    expect(sortExercises(two, 'en').map((e) => e.id)).toEqual(['traction_assistee', 'tirage_vertical'])
    expect(sortExercises(two).map((e) => e.id)).toEqual(['tirage_vertical', 'traction_assistee']) // French by default
  })
})

describe('search: group and equipment in both languages', () => {
  it('finds by group in French and in English', () => {
    const fr = filterExercises(EXERCISES_SEED, { query: 'abdos' })
    const en = filterExercises(EXERCISES_SEED, { query: 'abs' })
    expect(fr.length).toBeGreaterThan(0)
    expect(fr.every((e) => e.group === 'abs' || e.primaryMuscles.concat(e.secondaryMuscles).some((m) => m === 'abs' || m === 'obliques'))).toBe(true)
    expect(en.length).toBeGreaterThan(0)
  })
  it('finds by equipment in French and in English', () => {
    const fr = filterExercises(EXERCISES_SEED, { query: 'poulie' }).map((e) => e.id)
    const en = filterExercises(EXERCISES_SEED, { query: 'cable' }).map((e) => e.id)
    expect(fr).toContain('face_pull')
    expect(en).toContain('face_pull')
    expect(filterExercises(EXERCISES_SEED, { query: 'barre' }).map((e) => e.id)).toContain('squat_barre')
    expect(filterExercises(EXERCISES_SEED, { query: 'barbell' }).map((e) => e.id)).toContain('squat_barre')
  })
  it('finds by muscle in both languages, for each of the 17 muscles', () => {
    for (const m of MUSCLES) {
      expect(filterExercises(EXERCISES_SEED, { query: m.name }).length, m.name).toBeGreaterThan(0)
      expect(filterExercises(EXERCISES_SEED, { query: m.nameEn }).length, m.nameEn).toBeGreaterThan(0)
    }
  })
})
