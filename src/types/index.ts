export type ExerciseGroup = 'back' | 'chest' | 'shoulders' | 'arms' | 'legs' | 'abs'
export type EquipmentType = 'machine' | 'cable' | 'barbell' | 'dumbbell' | 'bodyweight'

export interface Muscle {
  id: string
  name: string
  nameEn: string
}

export interface Exercise {
  /** Slug stable (ex. "tirage_vertical"), jamais modifié. */
  id: string
  name: string
  nameEn: string
  group: ExerciseGroup
  /** Schéma de mouvement du prototype (vpull, hpush...). */
  movementPattern: string
  equipmentType: EquipmentType
  machineType?: string
  machineTypeEn?: string
  /** Ids de Muscle. */
  primaryMuscles: string[]
  secondaryMuscles: string[]
  /** Ids d'Exercise. */
  alternatives: string[]
  antagonists: string[]
  complements: string[]
  instructions: string
  instructionsEn: string
  videoUrl?: string
  /** Notes personnelles de l'utilisateur. */
  notes?: string
  isCustom: boolean
}

export interface SetEntry {
  reps: number
  weight: number
  /** De 6 à 10 par demi-points. */
  rpe?: number
}

export interface SessionEntry {
  exerciseId: string
  sets: SetEntry[]
}

export interface Session {
  id: string
  /** YYYY-MM-DD, heure locale. */
  date: string
  name: string
  notes?: string
  entries: SessionEntry[]
}

export interface BodyWeight {
  /** YYYY-MM-DD, heure locale. Une valeur par date. */
  date: string
  kg: number
}

export type SettingKey = 'language' | 'theme' | 'exportReminderWeeks' | 'lastExportAt' | 'seedVersion'

export interface Setting {
  key: SettingKey
  value: unknown
}

/** Notes et lien vidéo saisis par l'utilisateur sur un exercice de la base de départ. */
export interface ExerciseNote {
  id: string
  notes?: string
  videoUrl?: string
}

/** `version` est un entier de schéma d'export, indépendant de la version SemVer de l'appli. */
export interface ExportFile {
  version: number
  exportedAt: string
  /** Exercices personnalisés uniquement (isCustom). */
  exercises: Exercise[]
  /** Notes et vidéos des exercices de la base de départ (non exportés, donc sauvegardés à part). */
  exerciseNotes: ExerciseNote[]
  sessions: Session[]
  bodyWeights: BodyWeight[]
}
