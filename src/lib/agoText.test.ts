import type { TFunction } from 'i18next'
import { describe, expect, it } from 'vitest'
import { diffDaysText } from './agoText'

// Faux `t` : renvoie la clé et le nombre, pour tester la logique sans charger i18next.
const t = ((key: string, opts?: { count?: number }) => (opts?.count === undefined ? key : `${key}:${opts.count}`)) as unknown as TFunction

describe('diffDaysText', () => {
  it('jamais, aujourd\'hui, hier', () => {
    expect(diffDaysText(undefined, '2026-03-11', t)).toBe('overview.ago.never')
    expect(diffDaysText('2026-03-11', '2026-03-11', t)).toBe('overview.ago.today')
    expect(diffDaysText('2026-03-10', '2026-03-11', t)).toBe('overview.ago.yesterday')
  })
  it('nombre de jours au-delà', () => {
    expect(diffDaysText('2026-03-01', '2026-03-11', t)).toBe('overview.ago.days:10')
  })
  it('traite une date future comme aujourd\'hui', () => {
    expect(diffDaysText('2026-03-20', '2026-03-11', t)).toBe('overview.ago.today')
  })
})
