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

/** The 100 original exercise ids: sessions reference them, so they must never disappear or change. */
const ORIGINAL_IDS = [
  'tirage_vertical', 'tirage_prise_serree', 'tirage_supination', 'tractions',
  'tractions_supination', 'traction_assistee', 'tirage_unilateral', 'pullover_poulie',
  'pullover_machine', 'pullover_haltere', 'rowing_assis_poulie', 'rowing_machine',
  'rowing_barre', 'rowing_haltere', 'rowing_t', 'rowing_poulie_unilateral',
  'tirage_horizontal_large', 'shrugs', 'souleve_de_terre', 'extension_lombaires',
  'developpe_couche_barre', 'developpe_couche_halteres', 'developpe_incline_barre', 'developpe_incline_halteres',
  'developpe_incline_machine', 'developpe_machine', 'developpe_decline', 'ecartes_halteres',
  'ecartes_incline_halteres', 'pec_deck', 'ecartes_poulie', 'ecartes_poulie_basse',
  'pompes', 'dips', 'developpe_militaire', 'developpe_epaules_halteres',
  'developpe_epaules_machine', 'arnold_press', 'elevations_laterales', 'elevations_laterales_poulie',
  'elevations_laterales_machine', 'elevations_frontales', 'face_pull', 'reverse_fly_machine',
  'oiseau_halteres', 'curl_barre', 'curl_halteres', 'curl_marteau',
  'curl_pupitre', 'curl_poulie', 'curl_incline', 'curl_concentre',
  'curl_machine', 'curl_inverse', 'extension_triceps_poulie', 'extension_triceps_barre',
  'barre_front', 'extension_dessus_tete', 'extension_poulie_haute_corde', 'dips_banc',
  'kickback_triceps', 'developpe_couche_serre', 'machine_triceps', 'pompes_diamant',
  'curl_poignets', 'farmer_walk', 'squat_barre', 'squat_avant',
  'squat_smith', 'goblet_squat', 'presse_cuisses', 'hack_squat',
  'fentes_marchees', 'fentes_arriere', 'fentes_bulgares', 'step_up',
  'leg_extension', 'leg_curl_assis', 'leg_curl_allonge', 'rdl',
  'good_morning', 'hip_thrust', 'pont_fessier', 'kickback_poulie',
  'abduction_machine', 'adduction_machine', 'mollets_debout', 'mollets_assis',
  'mollets_presse', 'crunch', 'crunch_poulie', 'crunch_machine',
  'releve_jambes_suspendu', 'releve_jambes_banc', 'roue_abdos', 'gainage',
  'gainage_lateral', 'russian_twist', 'woodchopper', 'pallof_press',
]

const PATTERNS = new Set([
  'vpull', 'pullover', 'hpull', 'hpush', 'ipush', 'fly', 'vpush', 'lraise', 'rdelt', 'curl', 'tri', 'forearm', 'shrug',
  'squat', 'lunge', 'lext', 'lcurl', 'hinge', 'hip', 'abd', 'calf', 'coreflex', 'corerot', 'corestab', 'bext',
])

describe('catalogue quality', () => {
  it('keeps every original exercise id', () => {
    expect(ORIGINAL_IDS).toHaveLength(100)
    expect(ORIGINAL_IDS.filter((id) => !ids.has(id))).toEqual([])
  })

  it('has well-formed, unique ids and names (French and English, case-insensitive)', () => {
    for (const ex of EXERCISES_SEED) expect(ex.id, ex.id).toMatch(/^[a-z0-9]+(_[a-z0-9]+)*$/)
    const fr = EXERCISES_SEED.map((e) => e.name.toLowerCase())
    const en = EXERCISES_SEED.map((e) => e.nameEn.toLowerCase())
    expect(new Set(fr).size).toBe(fr.length)
    expect(new Set(en).size).toBe(en.length)
  })

  it('uses a known movement pattern for every exercise', () => {
    for (const ex of EXERCISES_SEED) expect(PATTERNS.has(ex.movementPattern), `${ex.id}: ${ex.movementPattern}`).toBe(true)
  })

  it('has short, non-empty instructions and machine text in both languages', () => {
    for (const ex of EXERCISES_SEED) {
      expect(ex.instructions.length, ex.id).toBeGreaterThan(20)
      expect(ex.instructionsEn.length, ex.id).toBeGreaterThan(20)
      expect(ex.instructions.length, ex.id).toBeLessThanOrEqual(300)
      expect(ex.instructionsEn.length, ex.id).toBeLessThanOrEqual(300)
      expect(Boolean(ex.machineType && ex.machineTypeEn), ex.id).toBe(true)
    }
  })

  it('never lists a muscle as both primary and secondary', () => {
    for (const ex of EXERCISES_SEED) {
      expect(ex.primaryMuscles.filter((m) => ex.secondaryMuscles.includes(m)), ex.id).toEqual([])
    }
  })

  it('links every exercise to at least one alternative, with no id repeated across the link lists', () => {
    for (const ex of EXERCISES_SEED) {
      expect(ex.alternatives.length, ex.id).toBeGreaterThan(0)
      const all = refs(ex)
      expect(new Set(all).size, ex.id).toBe(all.length)
    }
  })

  it('covers every group and every equipment type with a healthy number of exercises', () => {
    for (const g of GROUPS) expect(EXERCISES_SEED.filter((e) => e.group === g).length, g).toBeGreaterThanOrEqual(40)
    for (const q of EQUIPMENT_TYPES) expect(EXERCISES_SEED.filter((e) => e.equipmentType === q).length, q).toBeGreaterThanOrEqual(10)
  })

  it("contains the exercises from the user's training program", () => {
    const en = new Set(EXERCISES_SEED.map((e) => e.nameEn))
    for (const name of ['Weighted push-ups', 'Sissy squat', 'Lat pulldown', 'Seated cable row', 'Leg press']) {
      expect(en.has(name), name).toBe(true)
    }
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
