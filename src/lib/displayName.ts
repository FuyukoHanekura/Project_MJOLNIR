interface Named {
  name: string
  nameEn?: string
}

/** Lowercase without accents: to tell whether two names are “identical”. */
const flat = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

/** Name of an exercise, muscle or machine in the interface language (falls back to `name`). */
export function localizedName(item: Named, lang: string): string {
  return lang === 'en' ? item.nameEn?.trim() || item.name : item.name
}

/**
 * What a name displays depending on the interface language:
 * - English: the English name alone;
 * - French: the original name in large type and the English name smaller below (a single line if they are identical).
 */
export function displayNames(name: string, nameEn: string | undefined, lang: string): { main: string; sub?: string } {
  if (lang === 'en') return { main: nameEn?.trim() || name }
  if (!nameEn || flat(nameEn) === flat(name)) return { main: name }
  return { main: name, sub: nameEn }
}
