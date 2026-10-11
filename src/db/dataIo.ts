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

/** Ids already in use and ids reserved for the built-in catalogue, to validate imported exercises. */
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

/** Stores the date of the last export (local time) for the reminder. */
export function markExported(): Promise<void> {
  return setSetting('lastExportAt', todayLocal())
}

/** Downloads the export and stores the date of the last export. Returns the file name. */
export async function exportAndDownload(): Promise<string> {
  const file = await buildExport()
  const name = exportFileName(todayLocal())
  downloadJson(name, file)
  await markExported()
  return name
}

/** Applies an import plan in a single transaction: everything is written, or nothing. */
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
