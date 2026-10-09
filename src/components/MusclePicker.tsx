import { useTranslation } from 'react-i18next'
import { MUSCLE_BY_ID } from '../data/muscles'
import { cycleMuscle } from '../lib/exercises'
import { BACK, BASE, FRONT } from './silhouetteShapes'

interface Props {
  primary: readonly string[]
  secondary: readonly string[]
  onChange: (primary: string[], secondary: string[]) => void
}

/** Choix des muscles par clic sur la silhouette : principal, secondaire ou aucun. */
export default function MusclePicker({ primary, secondary, onChange }: Props) {
  const { t } = useTranslation()
  const level = (id: string) => (primary.includes(id) ? 'primary' : secondary.includes(id) ? 'secondary' : 'none')
  const toggle = (id: string) => {
    const next = cycleMuscle(primary, secondary, id)
    onChange(next.primary, next.secondary)
  }
  const names = (ids: readonly string[]) => ids.map((id) => MUSCLE_BY_ID.get(id)?.name ?? id)

  return (
    <div>
      <p className="text-sm text-ink2">{t('customExercise.musclesHelp')}</p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:max-w-md">
        {(['front', 'back'] as const).map((view) => (
          <figure key={view}>
            <svg viewBox="0 0 200 362" role="group" aria-label={t('overview.body.view', { view: t(`detail.${view}`) })} className="h-auto w-full">
              {BASE}
              {(view === 'front' ? FRONT : BACK).map(([id, shapes]) => {
                const state = level(id)
                const name = MUSCLE_BY_ID.get(id)?.name ?? id
                return (
                  <g
                    key={id}
                    className="sil-mu sil-mu-interactive"
                    data-level={state === 'none' ? undefined : state}
                    role="button"
                    tabIndex={0}
                    aria-pressed={state !== 'none'}
                    aria-label={t('customExercise.muscleAria', { name, state: t(`customExercise.state.${state}`) })}
                    onClick={() => toggle(id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        toggle(id)
                      }
                    }}
                  >
                    <title>{name}</title>
                    {shapes}
                  </g>
                )
              })}
            </svg>
            <figcaption className="mt-1 text-center text-xs text-muted">{t(`detail.${view}`)}</figcaption>
          </figure>
        ))}
      </div>

      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted" aria-hidden="true">
        <span className="flex items-center gap-1">
          <i className="inline-block size-3 rounded-[3px]" style={{ background: 'var(--m-primary)' }} /> {t('customExercise.legendPrimary')}
        </span>
        <span className="flex items-center gap-1">
          <i className="inline-block size-3 rounded-[3px]" style={{ background: 'var(--m-secondary)' }} /> {t('customExercise.legendSecondary')}
        </span>
      </p>

      <dl className="mt-2 text-sm text-ink2">
        <div>
          <dt className="inline font-semibold">{t('detail.primary')} : </dt>
          <dd className="inline">{primary.length ? names(primary).join(', ') : t('detail.none')}</dd>
        </div>
        <div>
          <dt className="inline font-semibold">{t('detail.secondary')} : </dt>
          <dd className="inline">{secondary.length ? names(secondary).join(', ') : t('detail.none')}</dd>
        </div>
      </dl>
    </div>
  )
}
