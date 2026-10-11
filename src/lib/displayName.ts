interface Named {
  name: string
  nameEn?: string
}

/** Minuscules sans accents : pour savoir si deux noms sont « identiques ». */
const flat = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

/** Nom d'un exercice, d'un muscle ou d'une machine dans la langue de l'interface (repli sur `name`). */
export function localizedName(item: Named, lang: string): string {
  return lang === 'en' ? item.nameEn?.trim() || item.name : item.name
}

/**
 * Ce qu'affiche un nom selon la langue de l'interface :
 * - anglais : le nom anglais seul ;
 * - français : le nom d'origine en gros et l'anglais en petit dessous (une seule ligne s'ils sont identiques).
 */
export function displayNames(name: string, nameEn: string | undefined, lang: string): { main: string; sub?: string } {
  if (lang === 'en') return { main: nameEn?.trim() || name }
  if (!nameEn || flat(nameEn) === flat(name)) return { main: name }
  return { main: name, sub: nameEn }
}
