import { applyTheme, parseTheme, type Theme } from '../lib/theme'
import { getSetting, setSetting } from './settings'

/** Reads the saved theme and applies it (“system” by default). */
export async function loadSavedTheme(): Promise<Theme> {
  const theme = parseTheme(await getSetting<unknown>('theme'))
  applyTheme(theme)
  return theme
}

export async function saveTheme(theme: Theme): Promise<void> {
  applyTheme(theme)
  await setSetting('theme', theme)
}
