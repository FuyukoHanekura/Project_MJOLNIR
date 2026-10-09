import { bilingual } from '../lib/exercises'

interface Props {
  name: string
  nameEn?: string
  /** Classes du nom principal (taille, graisse). */
  mainClassName?: string
}

/** Nom d'origine en gros, anglais en plus petit dessous (une seule ligne si identique). */
export default function BilingualName({ name, nameEn, mainClassName = 'text-base font-semibold text-ink' }: Props) {
  const { main, sub } = bilingual(name, nameEn)
  return (
    <span className="block min-w-0">
      <span className={`block ${mainClassName}`}>{main}</span>
      {sub && (
        <span className="block text-sm text-muted" lang="en">
          {sub}
        </span>
      )}
    </span>
  )
}
