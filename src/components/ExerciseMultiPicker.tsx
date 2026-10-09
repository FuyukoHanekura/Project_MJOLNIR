import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { filterExercises, sortExercises } from '../lib/exercises'
import type { Exercise } from '../types'
import BilingualName from './BilingualName'

interface Props {
  label: string
  exercises: readonly Exercise[]
  selected: readonly string[]
  onChange: (ids: string[]) => void
  /** Exercice en cours d'édition, exclu des propositions. */
  excludeId?: string
}

/** Sélection de plusieurs exercices : puces retirables et recherche pour en ajouter. */
export default function ExerciseMultiPicker({ label, exercises, selected, onChange, excludeId }: Props) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const byId = useMemo(() => new Map(exercises.map((e) => [e.id, e])), [exercises])
  const results = useMemo(
    () => (query.trim() ? sortExercises(filterExercises(exercises, { query }).filter((e) => e.id !== excludeId && !selected.includes(e.id))).slice(0, 8) : []),
    [exercises, query, excludeId, selected],
  )

  return (
    <div>
      <p className="text-sm font-semibold text-ink2">{label}</p>
      {selected.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2">
          {selected.map((id) => {
            const name = byId.get(id)?.name ?? id
            return (
              <li key={id} className="flex items-center rounded-full border border-line bg-surface pl-3 text-sm text-ink">
                {name}
                <button
                  type="button"
                  aria-label={t('customExercise.relatedRemove', { name })}
                  onClick={() => onChange(selected.filter((x) => x !== id))}
                  className="flex min-h-11 min-w-11 items-center justify-center text-ink2"
                >
                  ✕
                </button>
              </li>
            )
          })}
        </ul>
      )}
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label={`${t('customExercise.relatedSearch')} : ${label}`}
        placeholder={t('exercises.searchPlaceholder')}
        className="mt-2 min-h-11 w-full rounded-lg border border-line bg-surface px-3 text-base text-ink"
      />
      {results.length > 0 && (
        <ul className="mt-1 rounded-lg border border-line bg-surface">
          {results.map((e) => (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => {
                  onChange([...selected, e.id])
                  setQuery('')
                }}
                className="flex min-h-12 w-full items-center px-3 py-1 text-left hover:bg-accent/10"
              >
                <BilingualName name={e.name} nameEn={e.nameEn} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
