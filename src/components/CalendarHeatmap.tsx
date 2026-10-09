import { useMemo, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { db } from '../db/db'
import { addDays, todayLocal } from '../lib/date'
import { formatLocalDate, numberFormatter } from '../lib/format'
import { heatColor } from '../lib/heatColor'
import { calendarReference, calendarWeeks, dayTotals } from '../lib/heatmap'
import { createSession } from '../lib/sessions'
import { useIsDark } from '../lib/useIsDark'
import type { Session } from '../types'

type Metric = 'sets' | 'volume'

const WEEKS = 26
const DAY_FMT: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' }

/** Calendrier des jours d'entraînement : 26 semaines, une colonne par semaine (lundi en haut). */
export default function CalendarHeatmap({ sessions }: { sessions: readonly Session[] }) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const dark = useIsDark()
  const fmt = numberFormatter(i18n.language)
  const today = todayLocal()
  const [metric, setMetric] = useState<Metric>('sets')
  const [selected, setSelected] = useState<string | undefined>()
  const [focusDate, setFocusDate] = useState(today)

  const weeks = useMemo(() => calendarWeeks(today, WEEKS), [today])
  const totals = useMemo(() => dayTotals(sessions), [sessions])
  const ref = useMemo(() => calendarReference([...totals.values()].map((d) => d[metric])), [totals, metric])
  const first = weeks[0][0].date

  const label = (date: string) => {
    const name = formatLocalDate(date, i18n.language, DAY_FMT)
    const d = totals.get(date)
    if (!d) return t('overview.calendar.cellRest', { date: name })
    return metric === 'sets'
      ? t('overview.calendar.cellSets', { date: name, count: d.sets, n: fmt(d.sets) })
      : t('overview.calendar.cellVolume', { date: name, n: fmt(Math.round(d.volume)) })
  }

  // Déplacement au clavier : ←/→ changent de semaine, ↑/↓ de jour. On ne dépasse pas aujourd'hui.
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, date: string) => {
    const delta = { ArrowRight: 7, ArrowLeft: -7, ArrowDown: 1, ArrowUp: -1 }[e.key]
    if (delta === undefined) return
    e.preventDefault()
    let next = addDays(date, delta) as string
    if (next > today) next = today
    if (next < first) next = first
    setFocusDate(next)
    document.getElementById(`cal-${next}`)?.focus()
  }

  const addSession = async (date: string) => {
    const s = createSession(date)
    await db.sessions.add(s)
    navigate(`/seances/${s.id}`)
  }

  const day = selected ? totals.get(selected) : undefined
  const dayName = selected ? formatLocalDate(selected, i18n.language, DAY_FMT) : ''

  return (
    <div>
      <div role="group" aria-label={t('overview.calendar.metric')} className="flex gap-2">
        {(['sets', 'volume'] as const).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={metric === m}
            onClick={() => setMetric(m)}
            className={`min-h-11 rounded-full border px-4 text-sm font-semibold ${
              metric === m ? 'border-accent bg-accent text-accent-ink' : 'border-line bg-surface text-ink2'
            }`}
          >
            {t(`overview.calendar.${m}`)}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-[3px]" style={{ gridTemplateColumns: `auto repeat(${WEEKS}, minmax(0, 1fr))` }}>
        {[0, 2, 4, 6].map((d) => (
          <span key={d} aria-hidden="true" className="pr-1 text-xs leading-none text-muted" style={{ gridRow: d + 2, gridColumn: 1, alignSelf: 'center' }}>
            {formatLocalDate(weeks[0][d].date, i18n.language, { weekday: 'short' })}
          </span>
        ))}

        {weeks.map((col, w) => {
          const month = (date: string) => Number(date.slice(5, 7))
          const showMonth = w === 0 ? month(weeks[1][0].date) === month(col[0].date) : month(col[0].date) !== month(weeks[w - 1][0].date)
          return (
            <div key={col[0].date} className="contents">
              {showMonth && (
                <span aria-hidden="true" className="text-xs leading-none whitespace-nowrap text-muted" style={{ gridRow: 1, gridColumn: w + 2 }}>
                  {formatLocalDate(col[0].date, i18n.language, { month: 'short' })}
                </span>
              )}
              {col.map((d, r) => {
                const style = { gridRow: r + 2, gridColumn: w + 2 }
                if (d.future) return <span key={d.date} aria-hidden="true" style={style} />
                const value = totals.get(d.date)?.[metric] ?? 0
                const color = heatColor(value / ref, dark)
                return (
                  <button
                    key={d.date}
                    id={`cal-${d.date}`}
                    type="button"
                    aria-label={label(d.date)}
                    aria-pressed={selected === d.date}
                    tabIndex={d.date === focusDate ? 0 : -1}
                    title={label(d.date)}
                    onClick={() => {
                      setSelected(d.date)
                      setFocusDate(d.date)
                    }}
                    onKeyDown={(e) => onKeyDown(e, d.date)}
                    className={`aspect-square w-full rounded-[3px] ${selected === d.date ? 'outline-2 outline-ink' : ''}`}
                    style={{ ...style, background: color ?? 'var(--m0)' }}
                  />
                )
              })}
            </div>
          )
        })}
      </div>

      <p className="mt-3 flex items-center gap-1 text-xs text-muted" aria-hidden="true">
        {t('overview.calendar.less')}
        <i className="inline-block size-3 rounded-[3px]" style={{ background: 'var(--m0)' }} />
        {[0.05, 0.3, 0.55, 0.8, 1].map((v) => (
          <i key={v} className="inline-block size-3 rounded-[3px]" style={{ background: heatColor(v, dark) ?? undefined }} />
        ))}
        {t('overview.calendar.more')}
      </p>

      <div role="status" aria-live="polite" className="mt-3 min-h-11 text-sm text-ink2">
        {!selected && t('overview.calendar.hint')}
        {selected && !day && (
          <>
            <b className="text-ink">{dayName}</b> — {t('overview.calendar.rest')}{' '}
            <button type="button" onClick={() => void addSession(selected)} className="min-h-11 font-semibold text-accent underline">
              {t('overview.calendar.add')}
            </button>
          </>
        )}
        {selected && day && (
          <>
            <b className="text-ink">{dayName}</b> —{' '}
            {day.sessions.map((s, i) => (
              <span key={s.id}>
                {i > 0 && ' · '}
                <Link to={`/seances/${s.id}`} className="inline-flex min-h-11 items-center font-semibold text-accent underline">
                  {s.name || t('overview.calendar.unnamed')}
                </Link>{' '}
                {t('overview.calendar.daySummary', {
                  count: s.entries.reduce((n, e) => n + e.sets.length, 0),
                  volume: fmt(Math.round(s.entries.reduce((v, e) => v + e.sets.reduce((a, x) => a + x.reps * x.weight, 0), 0))),
                })}
              </span>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
