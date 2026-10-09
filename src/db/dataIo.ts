import { todayLocal } from '../lib/date'
import { downloadJson } from '../lib/download'
import { buildExportFile, exportFileName, type CurrentData, type ExerciseContext, type ImportPlan } from '../lib/exportFormat'
import type { ExportFile } from '../types'
import { db } from './db'
import { setSetting } from './settings'

export async function readAll(): Promise<CurrentData> {
  const [exercises, sessions, bodyWeights] = await Promise.all([db.exercises.toArray(), db.sessions.toArray(), db.bodyWeights.toArray()])
  return { exercises, sessions, bodyWeights }
}

/** Ids déjà utilisés et ids réservés à la base de départ, pour valider des exercices importés. */
export async function exerciseContext(): Promise<ExerciseContext> {
  const exercises = await db.exercises.toArray()
  return {
    takenIds: new Set(exercises.map((e) => e.id)),
    seedIds: new Set(exercises.filter((e) => !e.isCustom).map((e) => e.id)),
  }
}

export async function buildExport(): Promise<ExportFile> {
  const { exercises, sessions, bodyWeights } = await readAll()
  return buildExportFile(exercises, sessions, bodyWeights)
}

/** Mémorise la date du dernier export (heure locale) pour le rappel. */
export function markExported(): Promise<void> {
  return setSetting('lastExportAt', todayLocal())
}

/** Télécharge l'export et mémorise la date du dernier export. Renvoie le nom du fichier. */
export async function exportAndDownload(): Promise<string> {
  const file = await buildExport()
  const name = exportFileName(todayLocal())
  downloadJson(name, file)
  await markExported()
  return name
}

/** Applique un plan d'import en une seule transaction : tout est écrit, ou rien. */
export async function applyImport(plan: ImportPlan): Promise<void> {
  await db.transaction('rw', db.exercises, db.sessions, db.bodyWeights, async () => {
    await db.sessions.bulkDelete(plan.sessionIdsDelete)
    await db.bodyWeights.bulkDelete(plan.bodyWeightDatesDelete)
    await db.exercises.bulkDelete(plan.exerciseIdsDelete)
    await db.exercises.bulkPut(plan.exercisesPut)
    await db.sessions.bulkPut(plan.sessionsPut)
    await db.bodyWeights.bulkPut(plan.bodyWeightsPut)
  })
}
