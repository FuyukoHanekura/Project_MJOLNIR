import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import ConfirmDeleteButton from '../components/ConfirmDeleteButton'
import { db } from '../db/db'
import { todayLocal } from '../lib/date'
import { formatLocalDate } from '../lib/format'
import { countSets, createSession, duplicateSession, sortSessions } from '../lib/sessions'
import { useNames } from '../lib/useNames'
import type { Session } from '../types'

export default function SessionsPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const sessions = useLiveQuery(() => db.sessions.toArray())
  const exercises = useLiveQuery(() => db.exercises.toArray())
  const names = useNames()
  const nameOf = new Map((exercises ?? []).map((e) => [e.id, names.exercise(e)]))

  const open = (id: string) => navigate(`/seances/${id}`)

  const [error, setError] = useState<string | null>(null)

  /** Adds the session then opens it; on failure (storage unavailable...), shows the reason. */
  const addAndOpen = async (session: Session) => {
    try {
      setError(null)
      await db.sessions.add(session)
      open(session.id)
    } catch (e) {
      console.error(e)
      setError(e instanceof Error ? `${e.name}: ${e.message}` : String(e))
    }
  }

  const create = () => addAndOpen(createSession(todayLocal()))
  const duplicate = (source: Session) => addAndOpen(duplicateSession(source, todayLocal()))

  const sorted = sessions ? sortSessions(sessions) : []

  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-4xl font-extrabold tracking-wide text-ink uppercase">{t('sessions.title')}</h1>
        <button
          type="button"
          onClick={() => void create()}
          className="min-h-11 rounded-lg bg-brand px-4 font-semibold text-brand-ink"
        >
          + {t('sessions.new')}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-danger p-3 text-sm text-danger">
          {t('sessions.createError', { message: error })}
        </p>
      )}

      {sessions && sorted.length === 0 && <p className="mt-6 text-ink2">{t('sessions.empty')}</p>}

      <ul className="mt-4 space-y-3">
        {sorted.map((s) => {
          const title = s.name || t('sessions.untitled')
          const exerciseNames = s.entries.map((e) => nameOf.get(e.exerciseId) ?? e.exerciseId)
          return (
            <li key={s.id} className="rounded-xl border border-line bg-surface p-4">
              <Link to={`/seances/${s.id}`} className="block min-h-11">
                <span className="block text-sm text-muted">{formatLocalDate(s.date, i18n.language, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className="block text-lg font-semibold text-ink">
                  {title}
                  {s.demo && <span className="ml-2 rounded-full bg-accent/10 px-2 py-0.5 align-middle text-xs font-semibold text-accent">{t('sessions.demoBadge')}</span>}
                </span>
                <span className="block text-sm text-ink2">
                  {s.entries.length
                    ? t('sessions.summary', { count: s.entries.length, sets: countSets(s.entries) })
                    : t('sessions.noExercise')}
                </span>
                {exerciseNames.length > 0 && (
                  <span className="mt-1 block truncate text-sm text-muted">
                    {exerciseNames.slice(0, 3).join(' · ')}
                    {exerciseNames.length > 3 ? ' …' : ''}
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
