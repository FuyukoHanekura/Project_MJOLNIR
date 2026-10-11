import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { filterExercises, sortExercises } from '../lib/exercises'
import { useNames } from '../lib/useNames'
import type { Exercise } from '../types'
import BilingualName from './BilingualName'

interface Props {
  exercises: readonly Exercise[]
  onPick: (exercise: Exercise) => void
  onClose: () => void
}

/** Search for an exercise to add to the session. */
export default function ExercisePicker({ exercises, onPick, onClose }: Props) {
  const { t } = useTranslation()
  const { lang } = useNames()
  const [query, setQuery] = useState('')
  const results = useMemo(() => sortExercises(filterExercises(exercises, { query }), lang).slice(0, 40), [exercises, query, lang])

  return (
    <div className="mt-4 rounded-xl border border-accent bg-surface p-3">
      <div className="flex gap-2">
        <input
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={t('sessions.pickerSearch')}
          placeholder={t('exercises.searchPlaceholder')}
          className="min-h-11 w-full rounded-lg border border-line bg-bg px-3 text-base text-ink"
        />
        <button type="button" onClick={onClose} className="min-h-11 shrink-0 rounded-lg border border-line px-4 text-sm font-semibold text-ink2">
          {t('sessions.closePicker')}
        </button>
      </div>
      <ul className="mt-3 max-h-80 space-y-1 overflow-y-auto">
        {results.map((ex) => (
          <li key={ex.id}>
            <button
              type="button"
              onClick={() => onPick(ex)}
              className="flex min-h-12 w-full items-center justify-between gap-3 rounded-lg px-3 py-1 text-left hover:bg-accent/10"
            >
              <BilingualName name={ex.name} nameEn={ex.nameEn} />
              <span className="shrink-0 text-xs text-muted">{t(`equipment.${ex.equipmentType}`)}</span>
            </button>
          </li>
        ))}
      </ul>
      {results.length === 0 && <p className="mt-3 text-ink2">{t('exercises.empty')}</p>}
    </div>
  )
}
