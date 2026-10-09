import Dexie, { type EntityTable } from 'dexie'
import type { BodyWeight, Exercise, Session, Setting } from '../types'

export class CarnetDB extends Dexie {
  exercises!: EntityTable<Exercise, 'id'>
  sessions!: EntityTable<Session, 'id'>
  bodyWeights!: EntityTable<BodyWeight, 'date'>
  settings!: EntityTable<Setting, 'key'>

  constructor() {
    super('carnet-de-salle')
    // Version du schéma Dexie : indépendante de `version` dans l'export JSON.
    // Toute évolution ajoute un db.version(n+1) avec son upgrade().
    this.version(1).stores({
      exercises: 'id, group, equipmentType, isCustom',
      sessions: 'id, date',
      bodyWeights: 'date',
      settings: 'key',
    })
  }
}

export const db = new CarnetDB()
