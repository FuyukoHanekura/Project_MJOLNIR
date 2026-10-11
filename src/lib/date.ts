const pad = (n: number) => String(n).padStart(2, '0')

/** Formats a Date as YYYY-MM-DD using local time (never UTC). */
export function toLocalDateString(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function todayLocal(): string {
  return toLocalDateString(new Date())
}

/** Parses a YYYY-MM-DD string into a Date at local midnight. Returns null if invalid. */
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

/** Day number (days since 1970) of a YYYY-MM-DD string, unaffected by daylight saving time. NaN if invalid. */
export function dayIndex(s: string): number {
  const d = parseLocalDate(s)
  return d ? Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000) : NaN
}

/** Monday (ISO) of the week containing the date. null if invalid. */
export function mondayOf(s: string): string | null {
  const d = parseLocalDate(s)
  return d ? addDays(s, -((d.getDay() + 6) % 7)) : null
}
