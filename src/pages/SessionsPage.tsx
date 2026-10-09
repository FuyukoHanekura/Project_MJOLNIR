import { useLiveQuery } from 'dexie-react-hooks'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import ConfirmDeleteButton from '../components/ConfirmDeleteButton'
import { db } from '../db/db'
import { todayLocal } from '../lib/date'
import { formatLocalDate } from '../lib/format'
import { countSets, createSession, duplicateSession, sortSessions } from '../lib/sessions'
import type { Session } from '../types'

export default function SessionsPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const sessions = useLiveQuery(() => db.sessions.toArray())
  const exercises = useLiveQuery(() => db.exercises.toArray())
  const nameOf = new Map((exercises ?? []).map((e) => [e.id, e.name]))

  const open = (id: string) => navigate(`/seances/${id}`)

  const create = async () => {
    const s = createSession(todayLocal())
    await db.sessions.add(s)
    open(s.id)
  }

  const duplicate = async (source: Session) => {
    const copy = duplicateSession(source, todayLocal())
    await db.sessions.add(copy)
    open(copy.id)
  }

  const sorted = sessions ? sortSessions(sessions) : []

  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-4xl font-extrabold tracking-wide text-ink uppercase">{t('sessions.title')}</h1>
        <button
          type="button"
          onClick={() => void create()}
          className="min-h-11 rounded-lg bg-accent px-4 font-semibold text-accent-ink"
        >
          + {t('sessions.new')}
        </button>
      </div>

      {sessions && sorted.length === 0 && <p className="mt-6 text-ink2">{t('sessions.empty')}</p>}

      <ul className="mt-4 space-y-3">
        {sorted.map((s) => {
          const title = s.name || t('sessions.untitled')
          const names = s.entries.map((e) => nameOf.get(e.exerciseId) ?? e.exerciseId)
          return (
            <li key={s.id} className="rounded-xl border border-line bg-surface p-4">
              <Link to={`/seances/${s.id}`} className="block min-h-11">
                <span className="block text-sm text-muted">{formatLocalDate(s.date, i18n.language, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className="block text-lg font-semibold text-ink">{title}</span>
                <span className="block text-sm text-ink2">
                  {s.entries.length
                    ? t('sessions.summary', { count: s.entries.length, sets: countSets(s.entries) })
                    : t('sessions.noExercise')}
                </span>
                {names.length > 0 && (
                  <span className="mt-1 block truncate text-sm text-muted">
                    {names.slice(0, 3).join(' · ')}
                    {names.length > 3 ? ' …' : ''}
                  </span>
                )}
              </Link>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  aria-label={t('sessions.duplicateAria', { name: title })}
                  onClick={() => void duplicate(s)}
                  className="min-h-11 rounded-lg border border-line bg-surface px-4 text-sm font-semibold text-accent"
                >
                  {t('sessions.duplicate')}
                </button>
                <ConfirmDeleteButton ariaLabel={t('sessions.deleteAria', { name: title })} onConfirm={() => void db.sessions.delete(s.id)} />
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
