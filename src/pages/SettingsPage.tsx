import { useLiveQuery } from 'dexie-react-hooks'
import { useTranslation } from 'react-i18next'
import DataPanel from '../components/DataPanel'
import DemoPanel from '../components/DemoPanel'
import RadioChoice from '../components/RadioChoice'
import { db } from '../db/db'
import { saveTheme } from '../db/preferences'
import { getSetting } from '../db/settings'
import { LANGUAGES, setLanguage, type Language } from '../i18n'
import { parseTheme, THEMES, type Theme } from '../lib/theme'

const sectionTitle = 'font-display text-3xl font-extrabold tracking-wide text-ink uppercase'

export default function SettingsPage() {
  const { t, i18n } = useTranslation()
  // Vérifie que la base IndexedDB est ouverte et lisible (undefined = en cours de chargement).
  const sessionCount = useLiveQuery(() => db.sessions.count())
  const theme = parseTheme(useLiveQuery(() => getSetting<unknown>('theme')))

  return (
    <section>
      <h1 className="font-display text-4xl font-extrabold tracking-wide text-ink uppercase">{t('settings.title')}</h1>

      <RadioChoice<Language>
        name="language"
        legend={t('settings.language')}
        help={t('settings.languageHelp')}
        options={LANGUAGES.map((l) => ({ value: l, label: l.toUpperCase() }))}
        value={i18n.language as Language}
        onChange={(l) => void setLanguage(l)}
      />

      <RadioChoice<Theme>
        name="theme"
        legend={t('settings.theme')}
        help={t('settings.themeHelp')}
        options={THEMES.map((v) => ({ value: v, label: t(`settings.themes.${v}`) }))}
        value={theme}
        onChange={(v) => void saveTheme(v)}
      />

      <section className="mt-10">
        <h2 className={sectionTitle}>{t('data.title')}</h2>
        <div className="mt-4">
          <DataPanel />
        </div>
      </section>

      <div className="mt-10">
        <DemoPanel />
      </div>

      <p className="mt-10 text-sm text-muted">
        {t('settings.dbStatus', {
          state: sessionCount === undefined ? t('settings.dbOpening') : t('settings.dbReady', { count: sessionCount }),
        })}
      </p>
    </section>
  )
}
