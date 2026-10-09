import type { ReactNode } from 'react'

interface Props {
  title: string
  children?: ReactNode
}

export default function PagePlaceholder({ title, children }: Props) {
  return (
    <section>
      <h1 className="font-display text-4xl font-extrabold tracking-wide text-ink uppercase">{title}</h1>
      <p className="mt-2 text-ink2">Cette section arrive dans une prochaine phase.</p>
      {children}
    </section>
  )
}
