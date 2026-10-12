import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { GLOSSARY_IDS, isGlossaryId, type GlossaryId } from '../data/glossary'
import { numberFormatter } from '../lib/format'
import { estimateOneRepMax } from '../lib/tracking'

/** Worked example of the estimated 1RM, computed with the app's own formula. */
const E1RM_EXAMPLE = { weight: 80, reps: 8 } as const

const RPE_SCALE = [10, 9, 8, 7, 6] as const

function Extra({ id }: { id: GlossaryId }) {
  const { t, i18n } = useTranslation()
  const fmt = numberFormatter(i18n.language)
  if (id === 'rpe') {
    return (
      <>
        <h4 className="mt-3 font-semibold text-ink">{t('help.rpeScaleTitle')}</h4>
        <dl className="mt-1 space-y-1">
          {RPE_SCALE.map((v) => (
            <div key={v} className="flex gap-3">
              <dt className="w-8 shrink-0 font-bold text-accent">{v}</dt>
              <dd>{t(`help.rpeScale.${v}`)}</dd>
            </div>
          ))}
        </dl>
        <h4 className="mt-3 font-semibold text-ink">{t('help.rpeHowTitle')}</h4>
        <p className="mt-1">{t('help.rpeHow')}</p>
      </>
    )
  }
  if (id === 'e1rm') {
    const { weight, reps } = E1RM_EXAMPLE
    return <p className="mt-2 rounded-lg bg-accent/10 p-3">{t('help.e1rmExample', { weight, reps, value: fmt(estimateOneRepMax(weight, reps)) })}</p>
  }
  return null
}

/** Help tab: glossary of the terms the app displays. `/aide/:term` opens and scrolls to one entry. */
export default function HelpPage() {
  const { t } = useTranslation()
  const { term } = useParams()

  useEffect(() => {
    if (!isGlossaryId(term)) return
    const el = document.getElementById(`term-${term}`)
    if (el instanceof HTMLDetailsElement) {
      el.open = true
      el.scrollIntoView({ block: 'start' })
    }
  }, [term])

  return (
    <section>
      <h1 className="font-display text-4xl font-extrabold tracking-wide text-ink uppercase">{t('help.title')}</h1>
      <p className="mt-2 text-ink2">{t('help.intro')}</p>

      <h2 className="mt-6 font-display text-2xl font-extrabold tracking-wide text-ink uppercase">{t('help.glossary')}</h2>
      <div className="mt-3 space-y-2">
        {GLOSSARY_IDS.map((id) => (
          <details key={id} id={`term-${id}`} className="rounded-xl border border-line bg-surface px-4 py-1 scroll-mt-4">
            <summary className="min-h-11 cursor-pointer py-2.5 font-semibold text-ink">{t(`help.terms.${id}.name`)}</summary>
            <div className="pb-3 text-ink2">
              <p className="font-semibold text-ink">{t(`help.terms.${id}.short`)}</p>
              <p className="mt-2">{t(`help.terms.${id}.body`)}</p>
              <Extra id={id} />
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
