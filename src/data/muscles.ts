import type { Muscle } from '../types'

/** Les 17 muscles de l'application. L'ordre sert aux listes et aux filtres. */
export const MUSCLES: Muscle[] = [
  {
    "id": "chest",
    "name": "Pectoraux",
    "nameEn": "Chest"
  },
  {
    "id": "shoulders",
    "name": "Épaules",
    "nameEn": "Shoulders"
  },
  {
    "id": "rear_delts",
    "name": "Arrière d'épaule",
    "nameEn": "Rear delts"
  },
  {
    "id": "traps",
    "name": "Trapèzes",
    "nameEn": "Traps"
  },
  {
    "id": "lats",
    "name": "Grand dorsal",
    "nameEn": "Lats"
  },
  {
    "id": "mid_back",
    "name": "Milieu du dos",
    "nameEn": "Mid back"
  },
  {
    "id": "lower_back",
    "name": "Lombaires",
    "nameEn": "Lower back"
  },
  {
    "id": "biceps",
    "name": "Biceps",
    "nameEn": "Biceps"
  },
  {
    "id": "triceps",
    "name": "Triceps",
    "nameEn": "Triceps"
  },
  {
    "id": "forearms",
    "name": "Avant-bras",
    "nameEn": "Forearms"
  },
  {
    "id": "abs",
    "name": "Abdominaux",
    "nameEn": "Abs"
  },
  {
    "id": "obliques",
    "name": "Obliques",
    "nameEn": "Obliques"
  },
  {
    "id": "quads",
    "name": "Quadriceps",
    "nameEn": "Quads"
  },
  {
    "id": "hamstrings",
    "name": "Ischio-jambiers",
    "nameEn": "Hamstrings"
  },
  {
    "id": "glutes",
    "name": "Fessiers",
    "nameEn": "Glutes"
  },
  {
    "id": "calves",
    "name": "Mollets",
    "nameEn": "Calves"
  },
  {
    "id": "adductors",
    "name": "Adducteurs",
    "nameEn": "Adductors"
  }
]

export const MUSCLE_BY_ID: ReadonlyMap<string, Muscle> = new Map(MUSCLES.map((m) => [m.id, m]))
