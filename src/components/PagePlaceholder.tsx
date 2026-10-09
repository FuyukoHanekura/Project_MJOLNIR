import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  title: string
  children?: ReactNode
}

export default function PagePlaceholder({ title, children }: Props) {
  const { t } = useTranslation()
  return (
    <section>
      <h1 className="font-display text-4xl font-extrabold tracking-wide text-ink uppercase">{title}</h1>
      <p className="mt-2 text-ink2">{t('common.comingSoon')}</p>
      {children}
    </section>
  )
}
