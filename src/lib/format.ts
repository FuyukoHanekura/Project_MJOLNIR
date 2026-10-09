import { parseLocalDate } from './date'

const locale = (lang: string) => (lang === 'en' ? 'en-GB' : 'fr-FR')

/** Date YYYY-MM-DD → texte lisible dans la langue de l'interface (heure locale). */
export function formatLocalDate(date: string, lang: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }): string {
  const d = parseLocalDate(date)
  return d ? d.toLocaleDateString(locale(lang), opts) : date
}

export function numberFormatter(lang: string): (n: number) => string {
  const nf = new Intl.NumberFormat(locale(lang), { maximumFractionDigits: 2 })
  return (n) => nf.format(n)
}
