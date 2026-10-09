import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { dayIndex } from '../lib/date'
import type { ChartSeries } from './LineChart'

interface Props {
  /** Points du graphique : une `date` plus une valeur numérique par série (clé = `series[].key`). */
  data: readonly { date: string }[]
  series: ChartSeries[]
  lang: string
  /** Bornes de l'axe Y ; par défaut automatique. */
  yDomain?: [number | ((min: number) => number), number | ((max: number) => number)]
}

// Bornes entières pour des graduations lisibles.
const DEFAULT_Y_DOMAIN: [(min: number) => number, (max: number) => number] = [(min) => Math.floor(min), (max) => Math.ceil(max)]
const DAY_MS = 86_400_000
const locale = (lang: string) => (lang === 'en' ? 'en-GB' : 'fr-FR')
// L'axe X est numérique (jours) pour respecter l'espacement réel entre les dates.
const dayLabel = (day: number, lang: string, long = false) =>
  new Date(day * DAY_MS).toLocaleDateString(locale(lang), {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
    ...(long ? { year: 'numeric' } : {}),
  })

export default function LineChartImpl({ data, series, lang, yDomain = DEFAULT_Y_DOMAIN }: Props) {
  const points = data.map((d) => ({ ...d, day: dayIndex(d.date) }))
  const nf = new Intl.NumberFormat(locale(lang), { maximumFractionDigits: 2 })

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={points} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" />
        <XAxis
          dataKey="day"
          type="number"
          domain={['dataMin', 'dataMax']}
          tickFormatter={(d: number) => dayLabel(d, lang)}
          stroke="var(--muted)"
          tick={{ fill: 'var(--muted)', fontSize: 12 }}
          minTickGap={24}
        />
        <YAxis
          domain={yDomain}
          width={44}
          stroke="var(--muted)"
          tick={{ fill: 'var(--muted)', fontSize: 12 }}
          tickFormatter={(v: number) => nf.format(v)}
        />
        <Tooltip
          labelFormatter={(d) => dayLabel(Number(d), lang, true)}
          formatter={(v) => nf.format(Number(v))}
          contentStyle={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8, color: 'var(--ink)' }}
          labelStyle={{ color: 'var(--ink2)' }}
        />
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            strokeWidth={2}
            strokeDasharray={s.dashed ? '6 4' : undefined}
            dot={{ r: s.dashed ? 0 : 3, fill: s.color }}
            activeDot={{ r: 5 }}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
