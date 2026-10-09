import { useTranslation } from 'react-i18next'
import { MUSCLE_BY_ID } from '../data/muscles'
import { BACK, BASE, FRONT } from './silhouetteShapes'

export type SilhouetteView = 'front' | 'back'

interface Props {
  view: SilhouetteView
  primary: readonly string[]
  secondary: readonly string[]
}

/** Silhouette avant ou arrière : muscles principaux en couleur forte, secondaires en couleur claire. */
export default function Silhouette({ view, primary, secondary }: Props) {
  const { t } = useTranslation()
  const names = (ids: readonly string[]) =>
    ids
      .map((id) => {
        const m = MUSCLE_BY_ID.get(id)
        return m ? m.name : id
      })
      .join(', ') || t('detail.none')

  const label = t('detail.silhouetteLabel', {
    view: t(view === 'front' ? 'detail.front' : 'detail.back'),
    primary: names(primary),
    secondary: names(secondary),
  })

  return (
    <svg viewBox="0 0 200 362" role="img" aria-label={label} className="h-auto w-full">
      {BASE}
      {(view === 'front' ? FRONT : BACK).map(([id, shapes]) => {
        const level = primary.includes(id) ? 'primary' : secondary.includes(id) ? 'secondary' : undefined
        return (
          <g key={id} className="sil-mu" data-level={level}>
            {shapes}
          </g>
        )
      })}
    </svg>
  )
}
