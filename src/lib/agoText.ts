import type { TFunction } from 'i18next'
import { dayIndex } from './date'

/** “never”, “today”, “yesterday” or “N days ago” between a date and today. */
export function diffDaysText(date: string | undefined, today: string, t: TFunction): string {
  if (!date) return t('overview.ago.never')
  const n = dayIndex(today) - dayIndex(date)
  if (n <= 0) return t('overview.ago.today')
  if (n === 1) return t('overview.ago.yesterday')
  return t('overview.ago.days', { count: n })
}
