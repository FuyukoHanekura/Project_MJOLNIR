import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { demoCounts, loadDemo, removeDemo } from '../db/demo'
import ConfirmDeleteButton from './ConfirmDeleteButton'

const sectionTitle = 'font-display text-2xl font-extrabold tracking-wide text-ink uppercase'

/** Réglages > Démo : charge ou retire des données d'exemple pour voir les heatmaps et les courbes. */
export default function DemoPanel() {
  const { t } = useTranslation()
  const counts = useLiveQuery(demoCounts)
  const [error, setError] = useState<string | null>(null)
  const present = !!counts && (counts.sessions > 0 || counts.bodyWeights > 0)

  const run = async (action: () => Promise<unknown>) => {
    setError(null)
    try {
      await action()
    } catch (e) {
      console.error(e)
      setError(t('settings.demo.failed', { message: e instanceof Error ? e.message : String(e) }))
    }
  }

  return (
    <section>
      <h2 className={sectionTitle}>{t('settings.demo.title')}</h2>
      <p className="mt-2 text-sm text-ink2">{t('settings.demo.help')}</p>

      {counts && (
        <p className="mt-2 text-sm text-muted" role="status">
          {present ? t('settings.demo.present', { sessions: counts.sessions, weights: counts.bodyWeights }) : t('settings.demo.none')}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => void run(loadDemo)} className="min-h-11 rounded-lg border border-accent px-4 font-semibold text-accent">
          {t('settings.demo.load')}
        </button>
        {present && (
          <ConfirmDeleteButton
            ariaLabel={t('settings.demo.remove')}
            label={t('settings.demo.remove')}
            confirmLabel={t('settings.demo.removeConfirm')}
            onConfirm={() => void run(removeDemo)}
          />
        )}
      </div>

      {error && (
        <p role="alert" className="mt-3 rounded-lg border border-danger p-3 text-sm text-danger">
          {error}
        </p>
      )}
    </section>
  )
}
