import type { TFunction } from 'i18next'
import { describe, expect, it } from 'vitest'
import { diffDaysText } from './agoText'

// Fake `t`: returns the key and the count, to test the logic without loading i18next.
const t = ((key: string, opts?: { count?: number }) => (opts?.count === undefined ? key : `${key}:${opts.count}`)) as unknown as TFunction

describe('diffDaysText', () => {
  it('never, today, yesterday', () => {
    expect(diffDaysText(undefined, '2026-03-11', t)).toBe('overview.ago.never')
    expect(diffDaysText('2026-03-11', '2026-03-11', t)).toBe('overview.ago.today')
    expect(diffDaysText('2026-03-10', '2026-03-11', t)).toBe('overview.ago.yesterday')
  })
  it('number of days beyond that', () => {
    expect(diffDaysText('2026-03-01', '2026-03-11', t)).toBe('overview.ago.days:10')
  })
  it('treats a future date as today', () => {
    expect(diffDaysText('2026-03-20', '2026-03-11', t)).toBe('overview.ago.today')
  })
})
