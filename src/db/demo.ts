import { todayLocal } from '../lib/date'
import { buildDemoData } from '../lib/demo'
import { db } from './db'

export interface DemoCounts {
  sessions: number
  bodyWeights: number
}

export async function demoCounts(): Promise<DemoCounts> {
  const [sessions, bodyWeights] = await Promise.all([db.sessions.filter((s) => s.demo === true).count(), db.bodyWeights.filter((w) => w.demo === true).count()])
  return { sessions, bodyWeights }
}

/**
 * Ajoute les données de démonstration. Une mesure de poids réelle n'est jamais écrasée :
 * si tu as déjà une valeur ce jour-là, la mesure de démo est ignorée.
 */
export async function loadDemo(): Promise<DemoCounts> {
  const demo = buildDemoData(todayLocal())
  return db.transaction('rw', db.sessions, db.bodyWeights, async () => {
    const real = new Set((await db.bodyWeights.filter((w) => w.demo !== true).primaryKeys()) as string[])
    const weights = demo.bodyWeights.filter((w) => !real.has(w.date))
    await db.sessions.bulkPut(demo.sessions)
    await db.bodyWeights.bulkPut(weights)
    return { sessions: demo.sessions.length, bodyWeights: weights.length }
  })
}

/** Supprime uniquement les données marquées démo ; tes séances et mesures ne sont pas touchées. */
export async function removeDemo(): Promise<void> {
  await db.transaction('rw', db.sessions, db.bodyWeights, async () => {
    await db.sessions.filter((s) => s.demo === true).delete()
    await db.bodyWeights.filter((w) => w.demo === true).delete()
  })
}
