import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { GlossaryId } from '../data/glossary'

/** Small “?” button explaining a term. Opens on tap or click (no hover, for touch screens), closes with Escape. */
export default function InfoTip({ term }: { term: GlossaryId }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLSpanElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onPointer = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  const name = t(`help.terms.${term}.name`)
  return (
    <span ref={root} className="inline-block align-middle">
      <button
        type="button"
        aria-label={t('help.tip.label', { term: name })}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex size-6 items-center justify-center rounded-full border border-accent text-xs font-bold text-accent before:absolute before:-inset-3 before:content-['']"
      >
        ?
      </button>
      {open && (
        <span
          id={panelId}
          role="note"
          className="fixed inset-x-4 bottom-24 z-20 mx-auto block max-w-md rounded-xl border border-accent bg-surface p-4 text-left text-base font-normal text-ink shadow-lg md:bottom-8"
        >
          <span className="block font-semibold">{name}</span>
          <span className="mt-1 block text-ink2">{t(`help.terms.${term}.short`)}</span>
          <span className="mt-3 flex items-center justify-between gap-3">
            <Link to={`/aide/${term}`} onClick={() => setOpen(false)} className="inline-flex min-h-11 items-center font-semibold text-accent underline">
              {t('help.tip.more')}
            </Link>
            <button type="button" onClick={() => setOpen(false)} className="min-h-11 px-3 font-semibold text-ink2">
              {t('help.tip.close')}
            </button>
          </span>
        </span>
      )}
    </span>
  )
}
