import { useLiveQuery } from 'dexie-react-hooks'
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { db } from '../db/db'
import { todayLocal } from '../lib/date'
import { formatLocalDate, numberFormatter } from '../lib/format'
import { parseNumberInput } from '../lib/sessions'
import { isValidBodyWeight, withMovingAverage } from '../lib/tracking'
import ConfirmDeleteButton from './ConfirmDeleteButton'
import LineChart from './LineChart'

const field = 'min-h-11 w-full rounded-lg border border-line bg-surface px-3 text-base text-ink'

/** Poids de corps : saisie rapide, courbe et moyenne glissante sur 7 jours. */
export default function BodyWeightPanel() {
  const { t, i18n } = useTranslation()
  const fmt = numberFormatter(i18n.language)
  const entries = useLiveQuery(() => db.bodyWeights.toArray())
  const [date, setDate] = useState(todayLocal)
  const [kg, setKg] = useState('')
  const [invalid, setInvalid] = useState(false)

  const points = withMovingAverage(entries ?? [])
  const latest = points[points.length - 1]

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const value = parseNumberInput(kg)
    if (!isValidBodyWeight(value)) {
      setInvalid(true)
      return
    }
    setInvalid(false)
    // Une seule valeur par date : saisir à nouveau le même jour remplace la mesure.
    void db.bodyWeights.put({ date, kg: Math.round(value * 100) / 100 }).then(() => setKg(''))
  }

  return (
    <div>
      <form onSubmit={submit} className="grid grid-cols-[1fr_1fr] items-end gap-3 sm:grid-cols-[1fr_1fr_auto]" noValidate>
        <label className="block text-sm font-semibold text-ink2">
          {t('tracking.weight.date')}
          <input
            type="date"
            className={`${field} mt-1 font-normal`}
            value={date}
            max={todayLocal()}
            onChange={(e) => e.target.value && setDate(e.target.value)}
          />
        </label>
        <label className="block text-sm font-semibold text-ink2">
          {t('tracking.weight.kg')}
          <input
            className={`${field} mt-1 font-normal`}
            inputMode="decimal"
            value={kg}
            onChange={(e) => setKg(e.target.value)}
            aria-invalid={invalid}
            aria-describedby={invalid ? 'weight-error' : undefined}
          />
        </label>
        <button type="submit" className="col-span-2 min-h-11 rounded-lg bg-accent px-6 font-semibold text-accent-ink sm:col-span-1">
          {t('tracking.weight.save')}
        </button>
      </form>
      {invalid && (
        <p id="weight-error" role="alert" className="mt-2 text-sm text-danger">
          {t('tracking.weight.invalid')}
        </p>
      )}

      {entries && points.length === 0 && <p className="mt-6 text-ink2">{t('tracking.weight.empty')}</p>}

      {latest && (
        <>
          <p className="mt-6 text-ink">
            <span className="block font-semibold">
              {t('tracking.weight.latest', { kg: fmt(latest.kg), date: formatLocalDate(latest.date, i18n.language) })}
            </span>
            <span className="block text-sm text-ink2">{t('tracking.weight.avg', { kg: fmt(latest.avg) })}</span>
          </p>
          <div className="mt-3">
            <LineChart
              data={points}
              series={[
                { key: 'kg', label: t('tracking.weight.seriesKg'), color: 'var(--accent)' },
                { key: 'avg', label: t('tracking.weight.seriesAvg'), color: 'var(--m-primary)', dashed: true },
              ]}
              label={t('tracking.weight.chartLabel')}
              summary={t('tracking.progress.chartSummary', {
                count: points.length,
                first: formatLocalDate(points[0].date, i18n.language),
                last: formatLocalDate(latest.date, i18n.language),
                value: `${fmt(latest.kg)} kg`,
              })}
            />
          </div>

          <h2 className="mt-8 font-display text-2xl font-extrabold tracking-wide text-ink uppercase">{t('tracking.weight.history')}</h2>
          <ul className="mt-3 space-y-2">
            {[...points].reverse().slice(0, 10).map((p) => (
              <li key={p.date} className="flex min-h-14 items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-2">
                <span>
                  <span className="block text-sm text-muted">{formatLocalDate(p.date, i18n.language)}</span>
                  <span className="font-semibold text-ink">{fmt(p.kg)} kg</span>
                </span>
                <ConfirmDeleteButton
                  ariaLabel={t('tracking.weight.deleteAria', { date: formatLocalDate(p.date, i18n.language) })}
                  onConfirm={() => void db.bodyWeights.delete(p.date)}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
