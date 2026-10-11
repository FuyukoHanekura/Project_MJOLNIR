import { describe, expect, it } from 'vitest'
import { EXERCISES_SEED } from '../data/exercises.seed'
import { MUSCLES } from '../data/muscles'
import { displayNames, localizedName } from './displayName'
import { filterExercises, sortExercises } from './exercises'

describe('localizedName', () => {
  it('donne le nom anglais en anglais et le nom d\'origine en français', () => {
    const item = { name: 'Grand dorsal', nameEn: 'Lats' }
    expect(localizedName(item, 'en')).toBe('Lats')
    expect(localizedName(item, 'fr')).toBe('Grand dorsal')
  })
  it('retombe sur le nom d\'origine sans nom anglais exploitable', () => {
    expect(localizedName({ name: 'Curl 21' }, 'en')).toBe('Curl 21')
    expect(localizedName({ name: 'Curl 21', nameEn: '   ' }, 'en')).toBe('Curl 21')
  })
  it('traite toute langue autre que l\'anglais comme le français', () => {
    expect(localizedName({ name: 'Tractions', nameEn: 'Pull-ups' }, 'de')).toBe('Tractions')
  })
})

describe('displayNames', () => {
  it('en anglais : le nom anglais seul, jamais de seconde ligne', () => {
    expect(displayNames('Tractions pronation', 'Pull-ups', 'en')).toEqual({ main: 'Pull-ups' })
    expect(displayNames('Biceps', 'Biceps', 'en')).toEqual({ main: 'Biceps' })
  })
  it('en français : nom d\'origine en gros, anglais en petit', () => {
    expect(displayNames('Tractions pronation', 'Pull-ups', 'fr')).toEqual({ main: 'Tractions pronation', sub: 'Pull-ups' })
  })
  it('en français : une seule ligne si les deux noms sont identiques (accents et casse ignorés)', () => {
    expect(displayNames('Face pull', 'face pull', 'fr')).toEqual({ main: 'Face pull' })
    expect(displayNames('Épaules', 'Epaules', 'fr')).toEqual({ main: 'Épaules' })
    expect(displayNames('Face pull', undefined, 'fr')).toEqual({ main: 'Face pull' })
  })
  it('en anglais sans nom anglais : repli sur le nom d\'origine', () => {
    expect(displayNames('Curl 21', undefined, 'en')).toEqual({ main: 'Curl 21' })
  })
})

describe('tri selon la langue', () => {
  const pick = (ids: string[]) => EXERCISES_SEED.filter((e) => ids.includes(e.id))
  it('trie sur le nom affiché : anglais en anglais, français en français', () => {
    // Même groupe (dos) : en français « Tirage… » précède « Tractions… » ; en anglais « Assisted… » précède « Lat… ».
    const two = pick(['tirage_vertical', 'traction_assistee'])
    expect(sortExercises(two, 'fr').map((e) => e.id)).toEqual(['tirage_vertical', 'traction_assistee'])
    expect(sortExercises(two, 'en').map((e) => e.id)).toEqual(['traction_assistee', 'tirage_vertical'])
    expect(sortExercises(two).map((e) => e.id)).toEqual(['tirage_vertical', 'traction_assistee']) // français par défaut
  })
})

describe('recherche : groupe et matériel dans les deux langues', () => {
  it('trouve par groupe en français et en anglais', () => {
    const fr = filterExercises(EXERCISES_SEED, { query: 'abdos' })
    const en = filterExercises(EXERCISES_SEED, { query: 'abs' })
    expect(fr.length).toBeGreaterThan(0)
    expect(fr.every((e) => e.group === 'abs' || e.primaryMuscles.concat(e.secondaryMuscles).some((m) => m === 'abs' || m === 'obliques'))).toBe(true)
    expect(en.length).toBeGreaterThan(0)
  })
  it('trouve par matériel en français et en anglais', () => {
    const fr = filterExercises(EXERCISES_SEED, { query: 'poulie' }).map((e) => e.id)
    const en = filterExercises(EXERCISES_SEED, { query: 'cable' }).map((e) => e.id)
    expect(fr).toContain('face_pull')
    expect(en).toContain('face_pull')
    expect(filterExercises(EXERCISES_SEED, { query: 'barre' }).map((e) => e.id)).toContain('squat_barre')
    expect(filterExercises(EXERCISES_SEED, { query: 'barbell' }).map((e) => e.id)).toContain('squat_barre')
  })
  it('trouve par muscle dans les deux langues, pour chacun des 17 muscles', () => {
    for (const m of MUSCLES) {
      expect(filterExercises(EXERCISES_SEED, { query: m.name }).length, m.name).toBeGreaterThan(0)
      expect(filterExercises(EXERCISES_SEED, { query: m.nameEn }).length, m.nameEn).toBeGreaterThan(0)
    }
  })
})
