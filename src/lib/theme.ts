export type Theme = 'system' | 'light' | 'dark'
export const THEMES: readonly Theme[] = ['system', 'light', 'dark']

/** Valeur enregistrée → thème valide ; tout le reste retombe sur « système ». */
export function parseTheme(value: unknown): Theme {
  return value === 'light' || value === 'dark' ? value : 'system'
}

/**
 * Applique le thème sur <html> : `data-theme` force clair ou sombre, son absence laisse
 * le système décider (voir les variables de index.css).
 */
export function applyTheme(theme: Theme, root: HTMLElement = document.documentElement): void {
  if (theme === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', theme)
}
