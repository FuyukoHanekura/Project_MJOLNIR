import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { MUSCLE_BY_ID } from '../data/muscles'
import type { Exercise } from '../types'
import BilingualName from './BilingualName'

interface Props {
  exercise: Exercise
}

/** Ligne cliquable vers la fiche d'un exercice. */
export default function ExerciseLink({ exercise: ex }: Props) {
  const { t } = useTranslation()
  const muscles = ex.primaryMuscles
    .slice(0, 2)
    .map((id) => {
      const m = MUSCLE_BY_ID.get(id)
      return m ? m.name : id
    })
    .join(', ')

  return (
    <Link
      to={`/exercices/${ex.id}`}
      className="flex min-h-14 items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-2 hover:border-accent"
    >
      <span className="flex min-w-0 items-center gap-2">
        <BilingualName name={ex.name} nameEn={ex.nameEn} />
        {ex.isCustom && <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">{t('exercises.custom')}</span>}
      </span>
      <span className="shrink-0 text-right text-xs text-ink2">
        <span className="block">{muscles}</span>
        <span className="block text-muted">{t(`equipment.${ex.equipmentType}`)}</span>
      </span>
    </Link>
  )
}
