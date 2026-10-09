import { describe, expect, it } from 'vitest'
import { EXERCISES_SEED } from './exercises.seed'
import { MUSCLES } from './muscles'
import { EQUIPMENT_TYPES, GROUPS } from '../lib/exercises'

const ids = new Set(EXERCISES_SEED.map((e) => e.id))
const muscleIds = new Set(MUSCLES.map((m) => m.id))
const refs = (ex: (typeof EXERCISES_SEED)[number]) => [...ex.alternatives, ...ex.antagonists, ...ex.complements]

describe('muscles', () => {
  it('sont 17, sans doublon, avec noms FR et EN', () => {
    expect(MUSCLES).toHaveLength(17)
    expect(muscleIds.size).toBe(17)
    expect(MUSCLES.every((m) => m.name && m.nameEn)).toBe(true)
  })
})

describe('seed des exercices', () => {
  it("n'a aucun doublon d'id", () => {
    expect(ids.size).toBe(EXERCISES_SEED.length)
  })

  it('référence uniquement des exercices existants', () => {
    for (const ex of EXERCISES_SEED) {
      for (const ref of refs(ex)) expect(ids.has(ref), `${ex.id} -> ${ref}`).toBe(true)
    }
  })

  it('ne se référence jamais lui-même', () => {
    for (const ex of EXERCISES_SEED) expect(refs(ex), ex.id).not.toContain(ex.id)
  })

  it('a au moins un muscle principal', () => {
    for (const ex of EXERCISES_SEED) expect(ex.primaryMuscles.length, ex.id).toBeGreaterThan(0)
  })

  it("n'utilise que les 17 muscles connus", () => {
    for (const ex of EXERCISES_SEED) {
      for (const m of [...ex.primaryMuscles, ...ex.secondaryMuscles]) expect(muscleIds.has(m), `${ex.id}: ${m}`).toBe(true)
    }
  })

  it('a des champs bilingues et des énumérations valides', () => {
    for (const ex of EXERCISES_SEED) {
      expect(Boolean(ex.name && ex.nameEn && ex.instructions && ex.instructionsEn), ex.id).toBe(true)
      expect(GROUPS).toContain(ex.group)
      expect(EQUIPMENT_TYPES).toContain(ex.equipmentType)
      expect(ex.isCustom).toBe(false)
    }
  })
})
