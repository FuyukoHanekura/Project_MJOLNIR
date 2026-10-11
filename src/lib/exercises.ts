import { MUSCLE_BY_ID } from '../data/muscles'
import en from '../i18n/en.json'
import fr from '../i18n/fr.json'
import { localizedName } from './displayName'
import type { EquipmentType, Exercise, ExerciseGroup } from '../types'

export const GROUPS: readonly ExerciseGroup[] = ['back', 'chest', 'shoulders', 'arms', 'legs', 'abs']
export const EQUIPMENT_TYPES: readonly EquipmentType[] = ['machine', 'cable', 'barbell', 'dumbbell', 'bodyweight', 'smith', 'kettlebell', 'band']

/** Minuscules sans accents, pour des recherches tolérantes. */
export function normalize(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

/**
 * Nom en gros (langue d'origine) et, en dessous, l'anglais s'il diffère.
 * `sub` est undefined quand les deux sont identiques (une seule ligne).
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
  /** Id de muscle, comparé aux muscles principaux. */
  muscle?: string
}

function searchText(ex: Exercise): string {
  const muscles = ex.primaryMuscles.concat(ex.secondaryMuscles).flatMap((id) => {
    const m = MUSCLE_BY_ID.get(id)
    return m ? [m.name, m.nameEn] : []
  })
  // Groupe et matériel sont cherchés dans les deux langues : « dos » comme « back », « barre » comme « barbell ».
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

/** Tri par groupe (ordre de GROUPS) puis par nom tel qu'affiché dans la langue de l'interface. */
export function sortExercises(exercises: readonly Exercise[], lang = 'fr'): Exercise[] {
  return [...exercises].sort(
    (a, b) =>
      GROUPS.indexOf(a.group) - GROUPS.indexOf(b.group) ||
      localizedName(a, lang).localeCompare(localizedName(b, lang), lang === 'en' ? 'en' : 'fr', { sensitivity: 'base' }),
  )
}

/**
 * Met à jour un exercice de la base de départ sans écraser les données de l'utilisateur
 * (notes, lien vidéo saisis par lui).
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

/** Un appui sur un muscle : aucun → principal → secondaire → aucun. */
export function cycleMuscle(
  primary: readonly string[],
  secondary: readonly string[],
  id: string,
): { primary: string[]; secondary: string[] } {
  if (primary.includes(id)) return { primary: primary.filter((m) => m !== id), secondary: [...secondary, id] }
  if (secondary.includes(id)) return { primary: [...primary], secondary: secondary.filter((m) => m !== id) }
  return { primary: [...primary, id], secondary: [...secondary] }
}
