import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  ariaLabel: string
  onConfirm: () => void
  /** Texte du premier bouton ; « Supprimer » par défaut. */
  label?: string
  /** Texte du bouton de confirmation ; « Confirmer la suppression » par défaut. */
  confirmLabel?: string
}

/** Action destructive en deux temps : un premier appui demande confirmation. */
export default function ConfirmDeleteButton({ ariaLabel, onConfirm, label, confirmLabel }: Props) {
  const { t } = useTranslation()
  const [confirming, setConfirming] = useState(false)
  const base = 'min-h-11 rounded-lg border px-4 text-sm font-semibold'

  if (!confirming) {
    return (
      <button type="button" aria-label={ariaLabel} onClick={() => setConfirming(true)} className={`${base} border-line bg-surface text-danger`}>
        {label ?? t('sessions.delete')}
      </button>
    )
  }
  return (
    <span className="flex flex-wrap gap-2" role="group" aria-label={ariaLabel}>
      <button type="button" autoFocus onClick={onConfirm} className={`${base} border-danger bg-danger text-accent-ink`}>
        {confirmLabel ?? t('sessions.confirmDelete')}
      </button>
      <button type="button" onClick={() => setConfirming(false)} className={`${base} border-line bg-surface text-ink2`}>
        {t('sessions.cancel')}
      </button>
    </span>
  )
}
