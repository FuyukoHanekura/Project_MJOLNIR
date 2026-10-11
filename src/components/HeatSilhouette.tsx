import { heatColor } from '../lib/heatColor'
import { useNames } from '../lib/useNames'
import { BACK, BASE, FRONT } from './silhouetteShapes'

interface Props {
  view: 'front' | 'back'
  /** Intensité de 0 à 1 par id de muscle. */
  heat: Readonly<Record<string, number>>
  dark: boolean
  selected?: string
  onSelect: (muscleId: string) => void
  /** Texte lu pour un muscle (nom et valeur), pour les lecteurs d'écran. */
  describe: (muscleId: string) => string
  /** Nom de la vue (« de face » / « de dos »). */
  label: string
}

/** Silhouette colorée par intensité ; chaque muscle est un bouton (clavier et tactile). */
export default function HeatSilhouette({ view, heat, dark, selected, onSelect, describe, label }: Props) {
  const { muscle } = useNames()
  return (
    <svg viewBox="0 0 200 362" role="group" aria-label={label} className="h-auto w-full">
      {BASE}
      {(view === 'front' ? FRONT : BACK).map(([id, shapes]) => {
        const color = heatColor(heat[id] ?? 0, dark)
        return (
          <g
            key={id}
            className="sil-mu sil-mu-interactive"
            role="button"
            tabIndex={0}
            aria-pressed={selected === id}
            aria-label={describe(id)}
            style={color ? { fill: color } : undefined}
            onClick={() => onSelect(id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect(id)
              }
            }}
          >
            <title>{muscle(id)}</title>
            {shapes}
          </g>
        )
      })}
    </svg>
  )
}
