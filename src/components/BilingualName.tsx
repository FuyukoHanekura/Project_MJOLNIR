import { useTranslation } from 'react-i18next'
import { displayNames } from '../lib/displayName'

interface Props {
  name: string
  nameEn?: string
  /** Classes du nom principal (taille, graisse). */
  mainClassName?: string
}

/** Interface en anglais : le nom anglais seul. En français : nom d'origine en gros, anglais en plus petit dessous. */
export default function BilingualName({ name, nameEn, mainClassName = 'text-base font-semibold text-ink' }: Props) {
  const { i18n } = useTranslation()
  const { main, sub } = displayNames(name, nameEn, i18n.language)
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
