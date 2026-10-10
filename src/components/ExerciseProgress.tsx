import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatLocalDate, numberFormatter } from '../lib/format'
import { availableMetrics, personalRecords, progression, rpeTrend, type ProgressMetric } from '../lib/tracking'
import type { Session } from '../types'
import LineChart from './LineChart'
import RecordsList from './RecordsList'

interface Props {
  exerciseId: string
  sessions: readonly Session[]
}

const sectionTitle = 'font-display text-2xl font-extrabold tracking-wide text-ink uppercase'

/** Records, courbe de progression et courbe du RPE moyen d'un exercice. */
export default function ExerciseProgress({ exerciseId, sessions }: Props) {
  const { t, i18n } = useTranslation()
  const fmt = numberFormatter(i18n.language)
  const [chosen, setChosen] = useState<ProgressMetric | undefined>()

  const points = progression(sessions, exerciseId)
  const metrics = availableMetrics(points)
  const metric = chosen && metrics.includes(chosen) ? chosen : metrics[0]
  const rpe = rpeTrend(sessions, exerciseId)
  const records = personalRecords(sessions, exerciseId)

  if (!points.length || !metric) return <p className="mt-2 text-ink2">{t('tracking.progress.noData')}</p>

  const date = (d: string) => formatLocalDate(d, i18n.language)
  const summary = (list: { date: string }[], value: string) =>
    t('tracking.progress.chartSummary', { count: list.length, first: date(list[0].date), last: date(list[list.length - 1].date), value })

  const metricLabel = t(`tracking.metrics.${metric}`)
  const lastValue = points[points.length - 1][metric]

  return (
    <div className="space-y-8">
      <section>
        <h2 className={sectionTitle}>{t('tracking.records.title')}</h2>
        <div className="mt-3">
          <RecordsList records={records} />
        </div>
      </section>

      <section>
        <h2 className={sectionTitle}>{t('tracking.tabs.progress')}</h2>
        {metrics.length > 1 && (
          <div role="group" aria-label={t('tracking.progress.metric')} className="mt-3 flex flex-wrap gap-2">
            {metrics.map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={m === metric}
                onClick={() => setChosen(m)}
                className={`min-h-11 rounded-full border px-4 text-sm font-semibold ${
                  m === metric ? 'border-brand bg-brand text-brand-ink' : 'border-line bg-surface text-ink2'
                }`}
              >
                {t(`tracking.metrics.${m}`)}
              </button>
            ))}
          </div>
        )}
        <div className="mt-3">
          <LineChart
            data={points}
            series={[{ key: metric, label: metricLabel, color: 'var(--chart-1)' }]}
            label={t('tracking.progress.chartLabel', { metric: metricLabel })}
            summary={summary(points, fmt(lastValue))}
          />
        </div>
      </section>

      <section>
        <h2 className={sectionTitle}>{t('tracking.progress.rpeTitle')}</h2>
        {rpe.length === 0 ? (
          <p className="mt-2 text-ink2">{t('tracking.progress.rpeEmpty')}</p>
        ) : (
          <div className="mt-3">
            <LineChart
              data={rpe}
              series={[{ key: 'avg', label: t('tracking.progress.rpeSeries'), color: 'var(--chart-2)' }]}
              label={t('tracking.progress.rpeChartLabel')}
              summary={summary(rpe, fmt(rpe[rpe.length - 1].avg))}
              yDomain={[6, 10]}
            />
          </div>
        )}
      </section>
    </div>
  )
}
