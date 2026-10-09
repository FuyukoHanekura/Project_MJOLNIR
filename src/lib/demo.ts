import type { BodyWeight, Session } from '../types'
import { addDays, mondayOf } from './date'

export const DEMO_WEEKS = 12

type Template = { name: string; exercises: { id: string; base: number; step: number; sets: number; reps: number }[] }

// Jours de la semaine (0 = lundi) → séance type. Les charges de départ progressent de `step` kg par semaine.
const PUSH: Template = {
  name: 'Push',
  exercises: [
    { id: 'developpe_couche_barre', base: 50, step: 1.25, sets: 4, reps: 8 },
    { id: 'developpe_incline_halteres', base: 18, step: 0.5, sets: 3, reps: 10 },
    { id: 'developpe_epaules_machine', base: 30, step: 1, sets: 3, reps: 10 },
    { id: 'elevations_laterales', base: 8, step: 0.25, sets: 3, reps: 12 },
    { id: 'extension_triceps_poulie', base: 20, step: 0.5, sets: 3, reps: 12 },
  ],
}
const PULL: Template = {
  name: 'Pull',
  exercises: [
    { id: 'tirage_vertical', base: 45, step: 1, sets: 4, reps: 10 },
    { id: 'rowing_assis_poulie', base: 40, step: 1, sets: 3, reps: 10 },
    { id: 'face_pull', base: 20, step: 0.5, sets: 3, reps: 15 },
    { id: 'curl_barre', base: 20, step: 0.5, sets: 3, reps: 10 },
    { id: 'tractions', base: 0, step: 0, sets: 3, reps: 6 },
  ],
}
const LEGS: Template = {
  name: 'Legs',
  exercises: [
    { id: 'squat_barre', base: 60, step: 2.5, sets: 4, reps: 8 },
    { id: 'presse_cuisses', base: 120, step: 5, sets: 3, reps: 12 },
    { id: 'leg_curl_assis', base: 35, step: 1, sets: 3, reps: 12 },
    { id: 'mollets_debout', base: 50, step: 2, sets: 4, reps: 15 },
    { id: 'crunch', base: 0, step: 0, sets: 3, reps: 20 },
  ],
}

/** Lundi, mercredi, vendredi ; une séance Push supplémentaire le samedi une semaine sur deux. */
const WEEK_PLAN: readonly [dayOffset: number, template: Template][] = [
  [0, PUSH],
  [2, PULL],
  [4, LEGS],
]

const round = (n: number, step: number) => Math.round(n / step) * step
const round1 = (n: number) => Math.round(n * 10) / 10

export interface DemoData {
  sessions: Session[]
  bodyWeights: BodyWeight[]
}

/**
 * Jeu de démonstration déterministe sur les 12 dernières semaines : trois séances par semaine,
 * charges qui progressent, RPE qui monte en fin de série, poids de corps tous les trois jours.
 * Rien n'est daté après `today`.
 */
export function buildDemoData(today: string): DemoData {
  const monday = mondayOf(today)
  if (!monday) return { sessions: [], bodyWeights: [] }
  const sessions: Session[] = []

  for (let w = 0; w < DEMO_WEEKS; w++) {
    const weekStart = addDays(monday, -(DEMO_WEEKS - 1 - w) * 7) as string
    const plan = w % 2 === 0 ? [...WEEK_PLAN, [5, PUSH] as const] : WEEK_PLAN
    for (const [offset, template] of plan) {
      const date = addDays(weekStart, offset) as string
      if (date > today) continue
      sessions.push({
        id: `demo-${date}`,
        date,
        name: template.name,
        demo: true,
        entries: template.exercises.map((ex) => ({
          exerciseId: ex.id,
          sets: Array.from({ length: ex.sets }, (_, i) => ({
            reps: ex.reps - (i === ex.sets - 1 ? 1 : 0),
            weight: ex.base === 0 ? 0 : round(ex.base + ex.step * w, 0.25),
            // 7 à 8 en début de série, jusqu'à 9,5 sur la dernière.
            rpe: Math.min(9.5, 7 + (w % 3) * 0.5 + i * 0.5),
          })),
        })),
      })
    }
  }

  const bodyWeights: BodyWeight[] = []
  const days = DEMO_WEEKS * 7
  for (let d = 0, i = 0; d < days; d += 3, i++) {
    const date = addDays(monday, -(days - 7) + d) as string
    if (date > today) break
    bodyWeights.push({ date, kg: round1(82 - d * 0.04 + ((i % 3) - 1) * 0.3), demo: true })
  }

  return { sessions, bodyWeights }
}
