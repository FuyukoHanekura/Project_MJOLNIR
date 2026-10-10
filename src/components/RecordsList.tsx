import { useTranslation } from 'react-i18next'
import { todayLocal } from '../lib/date'
import { formatLocalDate, numberFormatter } from '../lib/format'
import { isRecent, type Records, type SetRecord } from '../lib/tracking'

/** Un record est « récent » s'il date de moins de 30 jours. */
const RECENT_DAYS = 30

interface Props {
  records: Records
}

/** Records personnels d'un exercice, avec mise en évidence des plus récents. */
export default function RecordsList({ records }: Props) {
  const { t, i18n } = useTranslation()
  const fmt = numberFormatter(i18n.language)
  const today = todayLocal()

  const describe = (r: SetRecord) =>
    r.weight > 0 ? t('tracking.records.set', { reps: r.reps, weight: fmt(r.weight) }) : t('tracking.records.setBodyweight', { reps: r.reps })

  const items: { key: string; label: string; value: string; record: SetRecord }[] = []
  if (records.maxWeight) items.push({ key: 'maxWeight', label: t('tracking.records.maxWeight'), value: `${fmt(records.maxWeight.value)} kg`, record: records.maxWeight })
  if (records.e1rm) items.push({ key: 'e1rm', label: t('tracking.records.e1rm'), value: `${fmt(records.e1rm.value)} kg`, record: records.e1rm })
  if (records.maxReps) items.push({ key: 'maxReps', label: t('tracking.records.maxReps'), value: String(records.maxReps.value), record: records.maxReps })
  if (!items.length) return null

  return (
    <dl className="grid gap-2 sm:grid-cols-3">
      {items.map(({ key, label, value, record }) => {
        const recent = isRecent(record.date, today, RECENT_DAYS)
        return (
          <div key={key} className={`rounded-xl border p-3 ${recent ? 'border-accent bg-accent/10' : 'border-line bg-surface'}`}>
            <dt className="flex items-center justify-between gap-2 text-sm font-semibold text-ink2">
              {label}
              {recent && <span className="rounded-full bg-brand px-2 py-0.5 text-xs text-brand-ink">{t('tracking.records.recent')}</span>}
            </dt>
            <dd className="mt-1 text-2xl font-bold text-ink">{value}</dd>
            <dd className="text-sm text-muted">
              {describe(record)} · {formatLocalDate(record.date, i18n.language)}
            </dd>
          </div>
        )
      })}
    </dl>
  )
}
