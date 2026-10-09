import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'

// Recharts est lourd : il n'est chargé que lorsqu'une courbe s'affiche.
const LineChartImpl = lazy(() => import('./LineChartImpl'))

export interface ChartSeries {
  /** Clé de la valeur dans chaque point de `data`. */
  key: string
  label: string
  /** Couleur CSS, ex. "var(--accent)". */
  color: string
  dashed?: boolean
}

interface Props {
  /** Points du graphique : une `date` plus une valeur numérique par série (clé = `series[].key`). */
  data: readonly { date: string }[]
  series: ChartSeries[]
  /** Nom de la courbe, lu par les lecteurs d'écran. */
  label: string
  /** Résumé textuel des valeurs (première, dernière...), lu par les lecteurs d'écran. */
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
      <figcaption className="sr-only">{summary}</figcaption>
    </figure>
  )
}
