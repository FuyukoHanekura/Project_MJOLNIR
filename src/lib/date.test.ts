import { describe, expect, it } from 'vitest'
import { addDays, dayIndex, mondayOf, parseLocalDate, toLocalDateString } from './date'

describe('date (local time)', () => {
  it('formats as YYYY-MM-DD with zero padding', () => {
    expect(toLocalDateString(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  it('does not shift the day near midnight', () => {
    expect(toLocalDateString(new Date(2026, 5, 15, 23, 59, 59))).toBe('2026-06-15')
    expect(toLocalDateString(new Date(2026, 5, 15, 0, 0, 1))).toBe('2026-06-15')
  })

  it('parses and rejects invalid dates', () => {
    expect(parseLocalDate('2026-02-30')).toBeNull()
    expect(parseLocalDate('2026-2-3')).toBeNull()
    expect(parseLocalDate('2026-02-28')).not.toBeNull()
  })

  it('adds days across months and years', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
    expect(addDays('nope', 1)).toBeNull()
  })

  it('computes a day number unaffected by daylight saving time', () => {
    expect(dayIndex('2026-03-30') - dayIndex('2026-03-28')).toBe(2)
    expect(dayIndex('2026-10-26') - dayIndex('2026-10-24')).toBe(2)
    expect(dayIndex('2027-01-01') - dayIndex('2026-01-01')).toBe(365)
    expect(dayIndex('nope')).toBeNaN()
  })

  it('finds the Monday of the (ISO) week', () => {
    expect(mondayOf('2026-03-11')).toBe('2026-03-09') // mercredi
    expect(mondayOf('2026-03-09')).toBe('2026-03-09') // lundi
    expect(mondayOf('2026-03-15')).toBe('2026-03-09') // dimanche
    expect(mondayOf('2026-01-01')).toBe('2025-12-29') // year change
    expect(mondayOf('nope')).toBeNull()
  })
})
