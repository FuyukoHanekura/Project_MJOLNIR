import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ExerciseLink from '../components/ExerciseLink'
import { MUSCLE_BY_ID, MUSCLES } from '../data/muscles'
import { db } from '../db/db'
import { EQUIPMENT_TYPES, filterExercises, GROUPS, sortExercises } from '../lib/exercises'
import type { EquipmentType, ExerciseGroup } from '../types'

const selectClass = 'min-h-11 w-full rounded-lg border border-line bg-surface px-3 text-base text-ink'

export default function ExercisesPage() {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState<ExerciseGroup | undefined>()
  const [equipment, setEquipment] = useState<EquipmentType | undefined>()
  // Le lien « Voir les exercices » de l'aperçu arrive avec ?muscle=<id>.
  const [params] = useSearchParams()
  const [muscle, setMuscle] = useState<string | undefined>(() => {
    const m = params.get('muscle')
    return m && MUSCLE_BY_ID.has(m) ? m : undefined
  })

  const all = useLiveQuery(() => db.exercises.toArray())
  const shown = useMemo(
    () => (all ? sortExercises(filterExercises(all, { query, group, equipment, muscle })) : []),
    [all, query, group, equipment, muscle],
  )
  const hasFilters = Boolean(query || group || equipment || muscle)

  const reset = () => {
    setQuery('')
    setGroup(undefined)
    setEquipment(undefined)
    setMuscle(undefined)
  }

  return (
    <section>
      <h1 className="font-display text-4xl font-extrabold tracking-wide text-ink uppercase">{t('exercises.title')}</h1>

      <div className="mt-3 flex flex-wrap gap-2">
        <Link to="/exercices/nouveau" className="inline-flex min-h-11 items-center rounded-lg bg-brand px-4 font-semibold text-brand-ink">
          + {t('exercises.newExercise')}
        </Link>
        <Link to="/exercices/import" className="inline-flex min-h-11 items-center rounded-lg border border-line bg-surface px-4 font-semibold text-accent">
          {t('exercises.importExercises')}
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={t('exercises.searchLabel')}
          placeholder={t('exercises.searchPlaceholder')}
          className={selectClass}
        />

        <div role="group" aria-label={t('exercises.filterGroup')} className="flex flex-wrap gap-2">
          {[undefined, ...GROUPS].map((g) => (
            <button
              key={g ?? 'all'}
              type="button"
              aria-pressed={group === g}
              onClick={() => setGroup(g)}
              className={`min-h-11 rounded-full border px-4 text-sm font-semibold ${
                group === g ? 'border-brand bg-brand text-brand-ink' : 'border-line bg-surface text-ink2'
              }`}
            >
              {g ? t(`groups.${g}`) : t('common.all')}
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <select
            aria-label={t('exercises.filterEquipment')}
            value={equipment ?? ''}
            onChange={(e) => setEquipment((e.target.value || undefined) as EquipmentType | undefined)}
            className={selectClass}
          >
            <option value="">{t('exercises.filterEquipment')} : {t('common.all')}</option>
            {EQUIPMENT_TYPES.map((eq) => (
              <option key={eq} value={eq}>
                {t(`equipment.${eq}`)}
              </option>
            ))}
          </select>
          <select
            aria-label={t('exercises.filterMuscle')}
            value={muscle ?? ''}
            onChange={(e) => setMuscle(e.target.value || undefined)}
            className={selectClass}
          >
            <option value="">{t('exercises.filterMuscle')} : {t('common.all')}</option>
            {MUSCLES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted" role="status" aria-live="polite">
        {all ? t('exercises.results', { count: shown.length }) : t('common.loading')}
      </p>

      {all && shown.length === 0 && (
        <div className="mt-3">
          <p className="text-ink2">{t('exercises.empty')}</p>
          {hasFilters && (
            <button type="button" onClick={reset} className="mt-2 min-h-11 font-semibold text-accent underline">
              {t('exercises.reset')}
            </button>
          )}
        </div>
      )}

      <ul className="mt-3 space-y-2">
        {shown.map((ex) => (
          <li key={ex.id}>
            <ExerciseLink exercise={ex} />
          </li>
        ))}
      </ul>
    </section>
  )
}
