import { applyTheme, parseTheme, type Theme } from '../lib/theme'
import { getSetting, setSetting } from './settings'

/** Lit le thème enregistré et l'applique (« système » par défaut). */
export async function loadSavedTheme(): Promise<Theme> {
  const theme = parseTheme(await getSetting<unknown>('theme'))
  applyTheme(theme)
  return theme
}

export async function saveTheme(theme: Theme): Promise<void> {
  applyTheme(theme)
  await setSetting('theme', theme)
}
