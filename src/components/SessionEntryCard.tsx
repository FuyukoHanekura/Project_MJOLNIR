import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { formatLocalDate, numberFormatter } from '../lib/format'
import { emptyDraftSet, type DraftEntry, type DraftSet } from '../lib/sessionDraft'
import { formatSets, RPE_VALUES, type Performance } from '../lib/sessions'
import type { Exercise } from '../types'
import BilingualName from './BilingualName'

interface Props {
  entry: DraftEntry
  /** undefined si l'exercice n'existe plus. */
  exercise?: Exercise
  last?: Performance
  isFirst: boolean
  isLast: boolean
  onChange: (entry: DraftEntry) => void
  onRemove: () => void
  onMove: (delta: -1 | 1) => void
  onReuseLast: () => void
}

const field = 'min-h-11 w-full rounded-lg border border-line bg-bg px-2 text-center text-base text-ink'
const iconBtn = 'flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-line bg-surface text-ink2 disabled:opacity-40'

export default function SessionEntryCard({ entry, exercise, last, isFirst, isLast, onChange, onRemove, onMove, onReuseLast }: Props) {
  const { t, i18n } = useTranslation()
  const fmt = numberFormatter(i18n.language)
  const name = exercise?.name ?? entry.exerciseId

  const setSets = (sets: DraftSet[]) => onChange({ ...entry, sets })
  const updateSet = (key: string, patch: Partial<DraftSet>) => setSets(entry.sets.map((s) => (s.key === key ? { ...s, ...patch } : s)))
  const addSet = () => {
    const prev = entry.sets[entry.sets.length - 1]
    setSets([...entry.sets, { ...emptyDraftSet(), reps: prev?.reps ?? '', weight: prev?.weight ?? '' }])
  }

  return (
    <li className="rounded-xl border border-line bg-surface p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          {exercise ? (
            <Link to={`/exercices/${exercise.id}`} className="block">
              <BilingualName name={exercise.name} nameEn={exercise.nameEn} mainClassName="text-lg font-semibold text-ink" />
            </Link>
          ) : (
            <p className="text-ink2">{t('sessions.unknownExercise', { id: entry.exerciseId })}</p>
          )}
        </div>
        <div className="flex shrink-0 gap-1">
          <button type="button" className={iconBtn} disabled={isFirst} aria-label={t('sessions.moveUp', { name })} onClick={() => onMove(-1)}>
            ↑
          </button>
          <button type="button" className={iconBtn} disabled={isLast} aria-label={t('sessions.moveDown', { name })} onClick={() => onMove(1)}>
            ↓
          </button>
          <button type="button" className={`${iconBtn} text-danger`} aria-label={t('sessions.removeExercise', { name })} onClick={onRemove}>
            ✕
          </button>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 text-sm text-ink2">
        {last ? (
          <>
            <span>
              {t('sessions.last', {
                date: formatLocalDate(last.date, i18n.language, { day: 'numeric', month: 'short' }),
                sets: formatSets(last.sets, fmt),
              })}
            </span>
            <button type="button" onClick={onReuseLast} className="min-h-11 font-semibold text-accent underline">
              {t('sessions.reuseLast')}
            </button>
          </>
        ) : (
          <span className="text-muted">{t('sessions.lastNone')}</span>
        )}
      </div>

      {entry.sets.length > 0 && (
        <div className="mt-2 grid grid-cols-[2rem_1fr_1fr_5rem_2.75rem] items-center gap-2 text-xs font-semibold text-muted">
          <span aria-hidden="true">#</span>
          <span>{t('sessions.reps')}</span>
          <span>{t('sessions.weight')}</span>
          <span>{t('sessions.rpe')}</span>
          <span />
        </div>
      )}
      <ul className="mt-1 space-y-2">
        {entry.sets.map((s, i) => {
          const n = i + 1
          return (
            <li key={s.key} className="grid grid-cols-[2rem_1fr_1fr_5rem_2.75rem] items-center gap-2">
              <span className="text-sm font-semibold text-ink2" aria-label={t('sessions.set', { n })}>
                {n}
              </span>
              <input
                className={field}
                inputMode="numeric"
                value={s.reps}
                onChange={(e) => updateSet(s.key, { reps: e.target.value })}
                aria-label={t('sessions.repsAria', { n })}
              />
              <input
                className={field}
                inputMode="decimal"
                value={s.weight}
                onChange={(e) => updateSet(s.key, { weight: e.target.value })}
                aria-label={t('sessions.weightAria', { n })}
              />
              <select className={field} value={s.rpe} onChange={(e) => updateSet(s.key, { rpe: e.target.value })} aria-label={t('sessions.rpeAria', { n })}>
                <option value="">{t('sessions.rpeNone')}</option>
                {RPE_VALUES.map((v) => (
                  <option key={v} value={String(v)}>
                    {fmt(v)}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className={iconBtn}
                aria-label={t('sessions.removeSet', { n })}
                onClick={() => setSets(entry.sets.filter((x) => x.key !== s.key))}
              >
                −
              </button>
            </li>
          )
        })}
      </ul>

      <button type="button" onClick={addSet} className="mt-3 min-h-11 rounded-lg border border-line px-4 text-sm font-semibold text-accent">
        + {t('sessions.addSet')}
      </button>
    </li>
  )
}
