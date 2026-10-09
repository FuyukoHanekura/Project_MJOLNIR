import { describe, expect, it } from 'vitest'
import { addDays, dayIndex, parseLocalDate, toLocalDateString } from './date'

describe('date (heure locale)', () => {
  it('formate en YYYY-MM-DD avec zéros', () => {
    expect(toLocalDateString(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  it('ne décale pas le jour près de minuit', () => {
    expect(toLocalDateString(new Date(2026, 5, 15, 23, 59, 59))).toBe('2026-06-15')
    expect(toLocalDateString(new Date(2026, 5, 15, 0, 0, 1))).toBe('2026-06-15')
  })

  it('parse et rejette les dates invalides', () => {
    expect(parseLocalDate('2026-02-30')).toBeNull()
    expect(parseLocalDate('2026-2-3')).toBeNull()
    expect(parseLocalDate('2026-02-28')).not.toBeNull()
  })

  it('ajoute des jours en traversant mois et années', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
    expect(addDays('nope', 1)).toBeNull()
  })

  it('calcule un numéro de jour sans effet d\'heure d\'été', () => {
    expect(dayIndex('2026-03-30') - dayIndex('2026-03-28')).toBe(2)
    expect(dayIndex('2026-10-26') - dayIndex('2026-10-24')).toBe(2)
    expect(dayIndex('2027-01-01') - dayIndex('2026-01-01')).toBe(365)
    expect(dayIndex('nope')).toBeNaN()
  })
})
