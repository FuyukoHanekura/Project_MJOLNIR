import { MUSCLE_BY_ID } from '../data/muscles'
import en from '../i18n/en.json'
import fr from '../i18n/fr.json'
import { localizedName } from './displayName'
import type { EquipmentType, Exercise, ExerciseGroup } from '../types'

export const GROUPS: readonly ExerciseGroup[] = ['back', 'chest', 'shoulders', 'arms', 'legs', 'abs']
export const EQUIPMENT_TYPES: readonly EquipmentType[] = ['machine', 'cable', 'barbell', 'dumbbell', 'bodyweight', 'smith', 'kettlebell', 'band']

/** Lowercase without accents, for forgiving searches. */
export function normalize(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

/**
 * Name in large type (original language) and, below it, the English name if it differs.
 * `sub` is undefined when both are identical (a single line).
 */
export function bilingual(main: string, en: string | undefined): { main: string; sub?: string } {
  if (!en || normalize(en) === normalize(main)) return { main }
  return { main, sub: en }
}

export interface ExerciseFilters {
  query?: string
  group?: ExerciseGroup
  /** Equipment types to show: an exercise matches if its equipment is any of them. Empty or absent = no filter. */
  equipment?: readonly EquipmentType[]
  /** Muscle id, compared with the primary muscles. */
  muscle?: string
}

function searchText(ex: Exercise): string {
  const muscles = ex.primaryMuscles.concat(ex.secondaryMuscles).flatMap((id) => {
    const m = MUSCLE_BY_ID.get(id)
    return m ? [m.name, m.nameEn] : []
  })
  // Group and equipment are searched in both languages: “dos” as well as “back”, “barre” as well as “barbell”.
  const labels = [fr.groups[ex.group], en.groups[ex.group], fr.equipment[ex.equipmentType], en.equipment[ex.equipmentType]]
  return normalize([ex.name, ex.nameEn, ex.machineType ?? '', ex.machineTypeEn ?? '', ...muscles, ...labels].join(' '))
}

export function filterExercises(exercises: readonly Exercise[], f: ExerciseFilters): Exercise[] {
  const words = normalize(f.query ?? '').split(/\s+/).filter(Boolean)
  return exercises.filter((ex) => {
    if (f.group && ex.group !== f.group) return false
    if (f.equipment?.length && !f.equipment.includes(ex.equipmentType)) return false
    if (f.muscle && !ex.primaryMuscles.includes(f.muscle)) return false
    if (!words.length) return true
    const text = searchText(ex)
    return words.every((w) => text.includes(w))
  })
}

/** Sorted by group (GROUPS order) then by name as displayed in the interface language. */
export function sortExercises(exercises: readonly Exercise[], lang = 'fr'): Exercise[] {
  return [...exercises].sort(
    (a, b) =>
      GROUPS.indexOf(a.group) - GROUPS.indexOf(b.group) ||
      localizedName(a, lang).localeCompare(localizedName(b, lang), lang === 'en' ? 'en' : 'fr', { sensitivity: 'base' }),
  )
}

/**
 * Updates a built-in exercise without overwriting the user's data
 * (notes and video link entered by the user).
 */
export function mergeSeedExercise(seed: Exercise, existing: Exercise | undefined): Exercise {
  if (!existing) return seed
  return {
    ...seed,
    notes: existing.notes ?? seed.notes,
    videoUrl: existing.videoUrl ?? seed.videoUrl,
  }
}

export type MuscleLevel = 'primary' | 'secondary'

/** One press on a muscle: none → primary → secondary → none. */
export function cycleMuscle(
  primary: readonly string[],
  secondary: readonly string[],
  id: string,
): { primary: string[]; secondary: string[] } {
  if (primary.includes(id)) return { primary: primary.filter((m) => m !== id), secondary: [...secondary, id] }
  if (secondary.includes(id)) return { primary: [...primary], secondary: secondary.filter((m) => m !== id) }
  return { primary: [...primary, id], secondary: [...secondary] }
}
