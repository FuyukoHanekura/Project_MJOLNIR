import { mergeSeedExercise } from '../lib/exercises'
import { db } from './db'
import { getSetting, setSetting } from './settings'

/** À incrémenter quand exercises.seed.ts change : la base est alors resynchronisée au démarrage. */
export const SEED_VERSION = 1

export async function seedExercises(): Promise<void> {
  if ((await getSetting<number>('seedVersion')) === SEED_VERSION) return
  // Import dynamique : les ~100 exercices ne sont chargés que s'il faut (re)semer la base.
  const { EXERCISES_SEED } = await import('../data/exercises.seed')
  await db.transaction('rw', db.exercises, db.settings, async () => {
    const existing = await db.exercises.bulkGet(EXERCISES_SEED.map((e) => e.id))
    await db.exercises.bulkPut(EXERCISES_SEED.map((seed, i) => mergeSeedExercise(seed, existing[i])))
    await setSetting('seedVersion', SEED_VERSION)
  })
}
