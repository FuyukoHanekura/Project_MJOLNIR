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
 * Adds the demo data. A real weight measurement is never overwritten:
 * if you already have a value that day, the demo measurement is skipped.
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

/** Removes only the data marked as demo; your sessions and measurements are untouched. */
export async function removeDemo(): Promise<void> {
  await db.transaction('rw', db.sessions, db.bodyWeights, async () => {
    await db.sessions.filter((s) => s.demo === true).delete()
    await db.bodyWeights.filter((w) => w.demo === true).delete()
  })
}
