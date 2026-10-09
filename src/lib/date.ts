const pad = (n: number) => String(n).padStart(2, '0')

/** Formate une Date en YYYY-MM-DD selon l'heure locale (jamais UTC). */
export function toLocalDateString(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function todayLocal(): string {
  return toLocalDateString(new Date())
}

/** Parse un YYYY-MM-DD en Date à minuit, heure locale. Renvoie null si invalide. */
export function parseLocalDate(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
  if (!m) return null
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const date = new Date(y, mo - 1, d)
  if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return null
  return date
}

export function addDays(s: string, days: number): string | null {
  const d = parseLocalDate(s)
  if (!d) return null
  d.setDate(d.getDate() + days)
  return toLocalDateString(d)
}

/** Numéro de jour (jours depuis 1970) d'un YYYY-MM-DD, sans effet d'heure d'été. NaN si invalide. */
export function dayIndex(s: string): number {
  const d = parseLocalDate(s)
  return d ? Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000) : NaN
}
