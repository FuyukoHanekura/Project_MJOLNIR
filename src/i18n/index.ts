import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getSetting, setSetting } from '../db/settings'
import en from './en.json'
import fr from './fr.json'

export type Language = 'fr' | 'en'
export const LANGUAGES: readonly Language[] = ['fr', 'en']

const isLanguage = (v: unknown): v is Language => v === 'fr' || v === 'en'

/** Langue par défaut selon le navigateur : fr ou en, sans autre détection automatique. */
export function defaultLanguage(): Language {
  return navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en'
}

function applyLanguage(lang: Language) {
  document.documentElement.lang = lang
}

void i18n.use(initReactI18next).init({
  resources: { fr: { translation: fr }, en: { translation: en } },
  lng: defaultLanguage(),
  fallbackLng: 'fr',
  interpolation: { escapeValue: false },
})
applyLanguage(i18n.language as Language)

/** Applique la langue enregistrée dans les réglages, si elle existe. */
export async function loadSavedLanguage(): Promise<void> {
  const saved = await getSetting<unknown>('language')
  if (isLanguage(saved) && saved !== i18n.language) {
    await i18n.changeLanguage(saved)
    applyLanguage(saved)
  }
}

export async function setLanguage(lang: Language): Promise<void> {
  await i18n.changeLanguage(lang)
  applyLanguage(lang)
  await setSetting('language', lang)
}

export default i18n
