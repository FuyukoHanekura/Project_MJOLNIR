import { heatColor } from '../lib/heatColor'
import { useNames } from '../lib/useNames'
import { BACK, BASE, FRONT } from './silhouetteShapes'

interface Props {
  view: 'front' | 'back'
  /** Intensity from 0 to 1 per muscle id. */
  heat: Readonly<Record<string, number>>
  dark: boolean
  selected?: string
  onSelect: (muscleId: string) => void
  /** Text read for a muscle (name and value), for screen readers. */
  describe: (muscleId: string) => string
  /** Name of the view (“front” / “back”). */
  label: string
}

/** Silhouette coloured by intensity; each muscle is a button (keyboard and touch). */
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
