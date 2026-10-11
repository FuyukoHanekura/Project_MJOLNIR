import { useTranslation } from 'react-i18next'
import { MUSCLE_BY_ID } from '../data/muscles'
import { localizedName } from './displayName'

/** Noms d'exercices et de muscles dans la langue de l'interface, pour les libellés simples (listes, aria-label). */
export function useNames() {
  const { i18n } = useTranslation()
  const lang = i18n.language
  return {
    lang,
    exercise: (e: { name: string; nameEn?: string }) => localizedName(e, lang),
    muscle: (id: string) => {
      const m = MUSCLE_BY_ID.get(id)
      return m ? localizedName(m, lang) : id
    },
  }
}
