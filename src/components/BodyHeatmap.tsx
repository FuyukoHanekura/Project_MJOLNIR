import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { MUSCLES } from '../data/muscles'
import { diffDaysText } from '../lib/agoText'
import { todayLocal } from '../lib/date'
import { numberFormatter } from '../lib/format'
import { heatColor } from '../lib/heatColor'
import { heatLevel, muscleStats, PERIODS, REFERENCE_SETS_PER_WEEK, type Period } from '../lib/heatmap'
import { useIsDark } from '../lib/useIsDark'
import { useNames } from '../lib/useNames'
import type { Exercise, Session } from '../types'
import BilingualName from './BilingualName'
import HeatSilhouette from './HeatSilhouette'

interface Props {
  sessions: readonly Session[]
  exercises: ReadonlyMap<string, Exercise>
}

const periodKey = (p: Period) => (p === 0 ? 'all' : `d${p}`)

/** Front/back silhouette coloured by volume per muscle, with a ranking and details for the selected muscle. */
export default function BodyHeatmap({ sessions, exercises }: Props) {
  const { t, i18n } = useTranslation()
  const dark = useIsDark()
  const fmt = numberFormatter(i18n.language)
  const names = useNames()
  const today = todayLocal()
  const [period, setPeriod] = useState<Period>(30)
  const [selected, setSelected] = useState<string | undefined>()

  const stats = useMemo(() => muscleStats(sessions, exercises, period, today), [sessions, exercises, period, today])
  const heat = useMemo(
    () => Object.fromEntries(MUSCLES.map((m) => [m.id, heatLevel(stats.load[m.id] ?? 0, stats.weeks)])),
    [stats],
  )
  const ranking = useMemo(
    () => [...MUSCLES].sort((a, b) => (stats.load[b.id] ?? 0) - (stats.load[a.id] ?? 0)),
    [stats],
  )

  const sets = (v: number) => t('overview.body.sets', { count: v, n: fmt(Math.round(v * 10) / 10) })
  const describe = (id: string) => {
    const name = names.muscle(id)
    const v = stats.load[id] ?? 0
    return v ? t('overview.body.muscleValue', { name, count: v, n: fmt(Math.round(v * 10) / 10) }) : t('overview.body.muscleNone', { name })
  }
  const legend = [0.02, 0.5, 1].map((v) => heatColor(v, dark))

  const sel = selected ? MUSCLES.find((m) => m.id === selected) : undefined
  const selLoad = selected ? (stats.load[selected] ?? 0) : 0

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label={t('overview.body.period')} className="flex gap-2">
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={period === p}
              onClick={() => setPeriod(p)}
              className={`min-h-11 rounded-full border px-4 text-sm font-semibold ${
                period === p ? 'border-brand bg-brand text-brand-ink' : 'border-line bg-surface text-ink2'
              }`}
            >
              {t(`overview.body.${periodKey(p)}`)}
            </button>
          ))}
        </div>
        <p className="flex items-center gap-2 text-xs text-muted" aria-hidden="true">
          0
          <span className="inline-block h-3 w-24 rounded-full" style={{ background: `linear-gradient(to right, ${legend.join(',')})` }} />
          {t('overview.body.legendMax', { ref: REFERENCE_SETS_PER_WEEK })}
        </p>
      </div>

      <div className="mt-4 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="grid grid-cols-2 gap-3">
          {(['front', 'back'] as const).map((view) => (
            <figure key={view}>
              <HeatSilhouette
                view={view}
                heat={heat}
                dark={dark}
                selected={selected}
                onSelect={(id) => setSelected((cur) => (cur === id ? undefined : id))}
                describe={describe}
                label={t('overview.body.view', { view: t(`detail.${view}`) })}
              />
              <figcaption className="mt-1 text-center text-xs text-muted">{t(`detail.${view}`)}</figcaption>
            </figure>
          ))}
        </div>

        <div>
          <div role="status" aria-live="polite" className="min-h-24 rounded-xl border border-line bg-surface p-3 text-sm text-ink2">
            {sel ? (
              <>
                <BilingualName name={sel.name} nameEn={sel.nameEn} mainClassName="text-lg font-semibold text-ink" />
                <p className="mt-1">
                  {t('overview.body.selected', { sets: sets(selLoad), perWeek: sets(selLoad / stats.weeks) })}
                  <br />
                  {t('overview.body.last', { ago: diffDaysText(stats.last[sel.id], today, t) })}
                </p>
                <Link to={`/exercices?muscle=${sel.id}`} className="mt-1 inline-flex min-h-11 items-center font-semibold text-accent underline">
                  {t('overview.body.exercises')}
                </Link>
              </>
            ) : (
              t('overview.body.hint')
            )}
          </div>

          <h3 className="sr-only">{t('overview.body.ranking')}</h3>
          <ol className="mt-3 space-y-1">
            {ranking.map((m) => {
              const v = stats.load[m.id] ?? 0
              const color = heatColor(heat[m.id], dark)
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    aria-pressed={selected === m.id}
                    onClick={() => setSelected((cur) => (cur === m.id ? undefined : m.id))}
                    className={`grid min-h-11 w-full grid-cols-[1fr_auto] items-center gap-x-3 rounded-lg px-2 py-1 text-left ${
                      selected === m.id ? 'bg-accent/10' : 'hover:bg-accent/5'
                    }`}
                  >
                    <span className="text-ink">{names.muscle(m.id)}</span>
                    <span className="text-sm text-ink2">{v ? sets(v) : '—'}</span>
                    <span className="col-span-2 block h-1.5 overflow-hidden rounded-full bg-[var(--m0)]" aria-hidden="true">
                      <i className="block h-full rounded-full" style={{ width: `${Math.round(heat[m.id] * 100)}%`, background: color ?? undefined }} />
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </div>
  )
}
