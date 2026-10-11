import { mergeSeedExercise } from '../lib/exercises'
import { db } from './db'
import { getSetting, setSetting } from './settings'

/**
 * Bump whenever exercises.seed.ts changes: the database is then resynchronised at startup.
 * 1 = original 100 exercises; 2 = extended catalogue (adds smith, kettlebell and band equipment).
 */
export const SEED_VERSION = 2

export async function seedExercises(): Promise<void> {
  if ((await getSetting<number>('seedVersion')) === SEED_VERSION) return
  // Dynamic import: the exercise catalogue is only loaded when the database needs (re)seeding.
  const { EXERCISES_SEED } = await import('../data/exercises.seed')
  await db.transaction('rw', db.exercises, db.settings, async () => {
    const existing = await db.exercises.bulkGet(EXERCISES_SEED.map((e) => e.id))
    await db.exercises.bulkPut(EXERCISES_SEED.map((seed, i) => mergeSeedExercise(seed, existing[i])))
    await setSetting('seedVersion', SEED_VERSION)
  })
}
