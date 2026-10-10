import { useLiveQuery } from 'dexie-react-hooks'
import { useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import BilingualName from '../components/BilingualName'
import BodyWeightPanel from '../components/BodyWeightPanel'
import ExerciseProgress from '../components/ExerciseProgress'
import RecordsList from '../components/RecordsList'
import { db } from '../db/db'
import { exercisesWithData, personalRecords } from '../lib/tracking'
import type { Exercise, Session } from '../types'

type Tab = 'weight' | 'progress' | 'records'
const TABS: readonly Tab[] = ['weight', 'progress', 'records']

function ProgressPanel({ sessions, exercises }: { sessions: Session[]; exercises: Map<string, Exercise> }) {
  const { t } = useTranslation()
  const ids = exercisesWithData(sessions)
  const [chosen, setChosen] = useState<string | undefined>()
  const selected = chosen && ids.includes(chosen) ? chosen : ids[0]

  if (!selected) return <p className="text-ink2">{t('tracking.progress.noData')}</p>
  return (
    <div>
      <label className="block text-sm font-semibold text-ink2">
        {t('tracking.progress.exercise')}
        <select
          className="mt-1 min-h-11 w-full rounded-lg border border-line bg-surface px-3 text-base font-normal text-ink"
          value={selected}
          onChange={(e) => setChosen(e.target.value)}
        >
          {ids.map((id) => (
            <option key={id} value={id}>
              {exercises.get(id)?.name ?? id}
            </option>
          ))}
        </select>
      </label>
      <div className="mt-6">
        <ExerciseProgress key={selected} exerciseId={selected} sessions={sessions} />
      </div>
    </div>
  )
}

function RecordsPanel({ sessions, exercises }: { sessions: Session[]; exercises: Map<string, Exercise> }) {
  const { t } = useTranslation()
  const ids = exercisesWithData(sessions)
  if (!ids.length) return <p className="text-ink2">{t('tracking.records.empty')}</p>
  return (
    <ul className="space-y-4">
      {ids.map((id) => {
        const ex = exercises.get(id)
        return (
          <li key={id} className="rounded-xl border border-line p-3">
            {ex ? (
              <Link to={`/exercices/${id}`} className="block min-h-11">
                <BilingualName name={ex.name} nameEn={ex.nameEn} mainClassName="text-lg font-semibold text-ink" />
              </Link>
            ) : (
              <p className="text-ink2">{id}</p>
            )}
            <div className="mt-2">
              <RecordsList records={personalRecords(sessions, id)} />
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default function TrackingPage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<Tab>('weight')
  const sessions = useLiveQuery(() => db.sessions.toArray())
  const exerciseList = useLiveQuery(() => db.exercises.toArray())
  const exercises = new Map((exerciseList ?? []).map((e) => [e.id, e]))

  // Navigation clavier du tablist : flèches gauche/droite, début/fin.
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = TABS.indexOf(tab)
    const next =
      e.key === 'ArrowRight' ? TABS[(i + 1) % TABS.length] : e.key === 'ArrowLeft' ? TABS[(i + TABS.length - 1) % TABS.length] : e.key === 'Home' ? TABS[0] : e.key === 'End' ? TABS[TABS.length - 1] : undefined
    if (!next) return
    e.preventDefault()
    setTab(next)
    document.getElementById(`tracking-tab-${next}`)?.focus()
  }

  return (
    <section>
      <h1 className="font-display text-4xl font-extrabold tracking-wide text-ink uppercase">{t('tracking.title')}</h1>

      <div role="tablist" aria-label={t('tracking.tabsLabel')} className="mt-4 flex gap-2 overflow-x-auto">
        {TABS.map((id) => (
          <button
            key={id}
            id={`tracking-tab-${id}`}
            type="button"
            role="tab"
            aria-selected={tab === id}
            aria-controls="tracking-panel"
            tabIndex={tab === id ? 0 : -1}
            onClick={() => setTab(id)}
            onKeyDown={onKeyDown}
            className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold ${
              tab === id ? 'border-brand bg-brand text-brand-ink' : 'border-line bg-surface text-ink2'
            }`}
          >
            {t(`tracking.tabs.${id}`)}
          </button>
        ))}
      </div>

      <div id="tracking-panel" role="tabpanel" aria-labelledby={`tracking-tab-${tab}`} className="mt-6">
        {tab === 'weight' && <BodyWeightPanel />}
        {tab === 'progress' && (sessions ? <ProgressPanel sessions={sessions} exercises={exercises} /> : <p className="text-muted">{t('common.loading')}</p>)}
        {tab === 'records' && (sessions ? <RecordsPanel sessions={sessions} exercises={exercises} /> : <p className="text-muted">{t('common.loading')}</p>)}
      </div>
    </section>
  )
}
