import { useTranslation } from 'react-i18next'
import { useNames } from '../lib/useNames'
import { BACK, BASE, FRONT } from './silhouetteShapes'

export type SilhouetteView = 'front' | 'back'

interface Props {
  view: SilhouetteView
  primary: readonly string[]
  secondary: readonly string[]
}

/** Front or back silhouette: primary muscles in a strong colour, secondary ones in a light colour. */
export default function Silhouette({ view, primary, secondary }: Props) {
  const { t } = useTranslation()
  const { muscle } = useNames()
  const names = (ids: readonly string[]) => ids.map(muscle).join(', ') || t('detail.none')

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
