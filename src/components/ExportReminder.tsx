import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { exportAndDownload } from '../db/dataIo'
import { db } from '../db/db'
import { getSetting } from '../db/settings'
import { diffDaysText } from '../lib/agoText'
import { todayLocal } from '../lib/date'
import { DEFAULT_REMINDER_WEEKS, exportReminderDue } from '../lib/exportFormat'

/** Bandeau de rappel de sauvegarde, affiché quand le dernier export date de plus de X semaines. */
export default function ExportReminder() {
  const { t } = useTranslation()
  const [dismissed, setDismissed] = useState(false)
  const info = useLiveQuery(async () => {
    const [weeks, lastExportAt, firstSession, firstWeight] = await Promise.all([
      getSetting<number>('exportReminderWeeks'),
      getSetting<string>('lastExportAt'),
      db.sessions.orderBy('date').first(),
      db.bodyWeights.orderBy('date').first(),
    ])
    const oldestDataDate = [firstSession?.date, firstWeight?.date].filter((d): d is string => !!d).sort()[0]
    return { weeks: weeks ?? DEFAULT_REMINDER_WEEKS, lastExportAt, oldestDataDate }
  })

  const today = todayLocal()
  if (dismissed || !info || !exportReminderDue({ ...info, today })) return null

  return (
    <div role="region" aria-label={t('data.reminderRegion')} className="border-b border-accent bg-accent/10 px-4 py-3">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink">{info.lastExportAt ? t('data.reminderLast', { when: diffDaysText(info.lastExportAt, today, t) }) : t('data.reminderNever')}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void exportAndDownload().catch((e) => console.error(e))}
            className="min-h-11 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-ink"
          >
            {t('data.reminderNow')}
          </button>
          <button type="button" onClick={() => setDismissed(true)} className="min-h-11 rounded-lg border border-line bg-surface px-4 text-sm font-semibold text-ink2">
            {t('data.reminderLater')}
          </button>
        </div>
      </div>
    </div>
  )
}
