import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import BodyHeatmap from '../components/BodyHeatmap'
import CalendarHeatmap from '../components/CalendarHeatmap'
import { db } from '../db/db'
import { todayLocal } from '../lib/date'
import { overviewStats } from '../lib/heatmap'

const sectionTitle = 'font-display text-2xl font-extrabold tracking-wide text-ink uppercase'

export default function OverviewPage() {
  const { t } = useTranslation()
  const sessions = useLiveQuery(() => db.sessions.toArray())
  const exerciseList = useLiveQuery(() => db.exercises.toArray())
  const exercises = useMemo(() => new Map((exerciseList ?? []).map((e) => [e.id, e])), [exerciseList])
  const stats = sessions ? overviewStats(sessions, todayLocal()) : undefined

  return (
    <section>
      <h1 className="font-display text-4xl font-extrabold tracking-wide text-ink uppercase">{t('nav.overview')}</h1>

      {stats && (
        <p className="mt-2 text-ink2">
          {t('overview.stats.sessions30', { count: stats.sessions30 })} · {t('overview.stats.setsWeek', { count: stats.setsThisWeek })} ·{' '}
          {t('overview.stats.streak', { count: stats.streakWeeks })}
        </p>
      )}

      {sessions && sessions.length === 0 && (
        <div className="mt-6 rounded-xl border border-dashed border-line p-4">
          <p className="text-ink2">{t('overview.empty')}</p>
          <Link to="/seances" className="mt-3 inline-flex min-h-11 items-center rounded-lg bg-accent px-4 font-semibold text-accent-ink">
            {t('overview.emptyAction')}
          </Link>
        </div>
      )}

      {sessions && (
        <>
          <section className="mt-8">
            <h2 className={sectionTitle}>{t('overview.body.title')}</h2>
            <div className="mt-3">
              <BodyHeatmap sessions={sessions} exercises={exercises} />
            </div>
          </section>

          <section className="mt-10">
            <h2 className={sectionTitle}>{t('overview.calendar.title')}</h2>
            <div className="mt-3">
              <CalendarHeatmap sessions={sessions} />
            </div>
          </section>
        </>
      )}
    </section>
  )
}
