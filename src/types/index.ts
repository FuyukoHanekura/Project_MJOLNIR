export type ExerciseGroup = 'back' | 'chest' | 'shoulders' | 'arms' | 'legs' | 'abs'
export type EquipmentType = 'machine' | 'cable' | 'barbell' | 'dumbbell' | 'bodyweight' | 'smith' | 'kettlebell' | 'band'

export interface Muscle {
  id: string
  name: string
  nameEn: string
}

export interface Exercise {
  /** Stable slug (e.g. "tirage_vertical"), never changed. */
  id: string
  name: string
  nameEn: string
  group: ExerciseGroup
  /** Movement pattern (vpull, hpush...). */
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
  /** From 6 to 10 in half points. */
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
  /** Demo data: never exported, removable in one click. Stops being demo data as soon as the session is edited. */
  demo?: boolean
}

export interface BodyWeight {
  /** YYYY-MM-DD, heure locale. Une valeur par date. */
  date: string
  kg: number
  /** Demo data: never exported, removable in one click. */
  demo?: boolean
}

export type SettingKey = 'language' | 'theme' | 'exportReminderWeeks' | 'lastExportAt' | 'seedVersion'

export interface Setting {
  key: SettingKey
  value: unknown
}

/** Notes and video link the user entered on a built-in exercise. */
export interface ExerciseNote {
  id: string
  notes?: string
  videoUrl?: string
}

/** `version` is an export schema integer, independent of the app's SemVer version. */
export interface ExportFile {
  version: number
  exportedAt: string
  /** Custom exercises only (isCustom). */
  exercises: Exercise[]
  /** Notes and videos of built-in exercises (the exercises themselves are not exported, so these are saved separately). */
  exerciseNotes: ExerciseNote[]
  sessions: Session[]
  bodyWeights: BodyWeight[]
}
