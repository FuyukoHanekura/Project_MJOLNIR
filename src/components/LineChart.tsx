import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'

// Recharts is heavy: it is only loaded when a chart is displayed.
const LineChartImpl = lazy(() => import('./LineChartImpl'))

export interface ChartSeries {
  /** Key of the value in each `data` point. */
  key: string
  label: string
  /** Couleur CSS, ex. "var(--accent)". */
  color: string
  dashed?: boolean
}

interface Props {
  /** Chart points: a `date` plus a numeric value per series (key = `series[].key`). */
  data: readonly { date: string }[]
  series: ChartSeries[]
  /** Name of the curve, read by screen readers. */
  label: string
  /** Text summary of the values (first, last...), read by screen readers. */
  summary: string
  yDomain?: [number, number]
}

export default function LineChart({ data, series, label, summary, yDomain }: Props) {
  const { t, i18n } = useTranslation()
  return (
    <figure aria-label={label} className="rounded-xl border border-line bg-surface p-3">
      <Suspense fallback={<div className="flex h-60 items-center justify-center text-muted">{t('common.loading')}</div>}>
        <LineChartImpl data={data} series={series} lang={i18n.language} yDomain={yDomain} />
      </Suspense>
      {series.length > 1 && (
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink2" aria-hidden="true">
          {series.map((s) => (
            <li key={s.key} className="flex items-center gap-1.5">
              <svg width="22" height="8" aria-hidden="true">
                <line x1="1" y1="4" x2="21" y2="4" stroke={s.color} strokeWidth="2.5" strokeDasharray={s.dashed ? '5 3' : undefined} strokeLinecap="round" />
              </svg>
              {s.label}
            </li>
          ))}
        </ul>
      )}
      <figcaption className="sr-only">{summary}</figcaption>
    </figure>
  )
}
