import Dexie, { type EntityTable } from 'dexie'
import type { BodyWeight, Exercise, Session, Setting } from '../types'

export class CarnetDB extends Dexie {
  exercises!: EntityTable<Exercise, 'id'>
  sessions!: EntityTable<Session, 'id'>
  bodyWeights!: EntityTable<BodyWeight, 'date'>
  settings!: EntityTable<Setting, 'key'>

  constructor() {
    super('carnet-de-salle')
    // Dexie schema version: independent of `version` in the JSON export.
    // Any change adds a db.version(n+1) with its upgrade().
    this.version(1).stores({
      exercises: 'id, group, equipmentType, isCustom',
      sessions: 'id, date',
      bodyWeights: 'date',
      settings: 'key',
    })
  }
}

export const db = new CarnetDB()
