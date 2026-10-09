import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  ariaLabel: string
  onConfirm: () => void
}

/** Suppression en deux temps : un premier appui demande confirmation. */
export default function ConfirmDeleteButton({ ariaLabel, onConfirm }: Props) {
  const { t } = useTranslation()
  const [confirming, setConfirming] = useState(false)
  const base = 'min-h-11 rounded-lg border px-4 text-sm font-semibold'

  if (!confirming) {
    return (
      <button type="button" aria-label={ariaLabel} onClick={() => setConfirming(true)} className={`${base} border-line bg-surface text-danger`}>
        {t('sessions.delete')}
      </button>
    )
  }
  return (
    <span className="flex gap-2" role="group" aria-label={ariaLabel}>
      <button type="button" autoFocus onClick={onConfirm} className={`${base} border-danger bg-danger text-accent-ink`}>
        {t('sessions.confirmDelete')}
      </button>
      <button type="button" onClick={() => setConfirming(false)} className={`${base} border-line bg-surface text-ink2`}>
        {t('sessions.cancel')}
      </button>
    </span>
  )
}
