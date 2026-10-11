import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ConfirmDeleteButton from '../components/ConfirmDeleteButton'
import ExercisePicker from '../components/ExercisePicker'
import SessionEntryCard from '../components/SessionEntryCard'
import { db } from '../db/db'
import { emptyDraftSet, toDraft, toSession, type DraftEntry, type SessionDraft } from '../lib/sessionDraft'
import { lastPerformance, newId } from '../lib/sessions'
import type { Exercise, Session } from '../types'

const input = 'min-h-11 w-full rounded-lg border border-line bg-surface px-3 text-base text-ink'

/** Editor: the draft is the source of truth and is saved on every change. */
function SessionEditor({ session }: { session: Session }) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [draft, setDraft] = useState<SessionDraft>(() => toDraft(session, i18n.language === 'fr' ? ',' : '.'))
  const [picking, setPicking] = useState(false)
  const initial = useRef(draft)

  const exercises = useLiveQuery(() => db.exercises.toArray())
  const sessions = useLiveQuery(() => db.sessions.toArray())
  const byId = new Map((exercises ?? []).map((e) => [e.id, e]))

  // Autosave (not on open: the draft is still identical).
  useEffect(() => {
    if (draft === initial.current) return
    void db.sessions.put(toSession(session.id, draft))
  }, [draft, session.id])

  const patch = (p: Partial<SessionDraft>) => setDraft((d) => ({ ...d, ...p }))
  const updateEntry = (key: string, entry: DraftEntry) => patch({ entries: draft.entries.map((e) => (e.key === key ? entry : e)) })

  const addExercise = (ex: Exercise) => {
    patch({ entries: [...draft.entries, { key: newId(), exerciseId: ex.id, sets: [emptyDraftSet()] }] })
    setPicking(false)
  }

  const move = (index: number, delta: -1 | 1) => {
    const entries = [...draft.entries]
    const [moved] = entries.splice(index, 1)
    entries.splice(index + delta, 0, moved)
    patch({ entries })
  }

  const reuseLast = (entry: DraftEntry, sets: { reps: number; weight: number; rpe?: number }[]) =>
    updateEntry(entry.key, {
      ...entry,
      sets: sets.map((s) => ({ key: newId(), reps: String(s.reps), weight: String(s.weight), rpe: s.rpe === undefined ? '' : String(s.rpe) })),
    })

  return (
    <article>
      <Link to="/seances" className="inline-flex min-h-11 items-center font-semibold text-accent">
        ← {t('sessions.back')}
      </Link>

      <div className="mt-2 grid gap-3 sm:grid-cols-[1fr_12rem]">
        <label className="block text-sm font-semibold text-ink2">
          {t('sessions.name')}
          <input
            className={`${input} mt-1 font-normal`}
            value={draft.name}
            maxLength={60}
            placeholder={t('sessions.namePlaceholder')}
            onChange={(e) => patch({ name: e.target.value })}
          />
        </label>
        <label className="block text-sm font-semibold text-ink2">
          {t('sessions.date')}
          <input
            type="date"
            className={`${input} mt-1 font-normal`}
            value={draft.date}
            // A cleared date field gives '': keep the previous value rather than an invalid date.
            onChange={(e) => e.target.value && patch({ date: e.target.value })}
          />
        </label>
      </div>

      {draft.entries.length === 0 && <p className="mt-6 text-ink2">{t('sessions.noEntries')}</p>}

      <ul className="mt-4 space-y-3">
        {draft.entries.map((entry, i) => {
          const last = lastPerformance(sessions ?? [], entry.exerciseId, { excludeSessionId: session.id, onOrBefore: draft.date })
          return (
            <SessionEntryCard
              key={entry.key}
              entry={entry}
              exercise={byId.get(entry.exerciseId)}
              last={last}
              isFirst={i === 0}
              isLast={i === draft.entries.length - 1}
              onChange={(e) => updateEntry(entry.key, e)}
              onRemove={() => patch({ entries: draft.entries.filter((e) => e.key !== entry.key) })}
              onMove={(delta) => move(i, delta)}
              onReuseLast={() => last && reuseLast(entry, last.sets)}
            />
          )
        })}
      </ul>

      {picking ? (
        <ExercisePicker exercises={exercises ?? []} onPick={addExercise} onClose={() => setPicking(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setPicking(true)}
          className="mt-4 min-h-12 w-full rounded-xl border border-dashed border-accent font-semibold text-accent"
        >
          + {t('sessions.addExercise')}
        </button>
      )}

      <label className="mt-6 block text-sm font-semibold text-ink2">
        {t('sessions.notes')}
        <textarea
          className={`${input} mt-1 p-3 font-normal`}
          rows={3}
          maxLength={2000}
          value={draft.notes}
          onChange={(e) => patch({ notes: e.target.value })}
        />
      </label>

      <div className="mt-6">
        <ConfirmDeleteButton
          ariaLabel={t('sessions.deleteAria', { name: draft.name || t('sessions.untitled') })}
          onConfirm={() => void db.sessions.delete(session.id).then(() => navigate('/seances', { replace: true }))}
        />
      </div>
    </article>
  )
}

export default function SessionEditPage() {
  const { id = '' } = useParams()
  const { t } = useTranslation()
  // null = not found, undefined = loading. Loaded once: the editor then manages its own state.
  const [session, setSession] = useState<Session | null | undefined>()

  useEffect(() => {
    let cancelled = false
    void db.sessions.get(id).then((s) => !cancelled && setSession(s ?? null))
    return () => {
      cancelled = true
    }
  }, [id])

  if (session === undefined) return <p className="text-muted">{t('common.loading')}</p>
  if (session === null) {
    return (
      <section>
        <Link to="/seances" className="inline-flex min-h-11 items-center font-semibold text-accent">
          ← {t('sessions.back')}
        </Link>
        <p className="mt-2 text-ink2">{t('sessions.notFound')}</p>
      </section>
    )
  }
  return <SessionEditor key={session.id} session={session} />
}
