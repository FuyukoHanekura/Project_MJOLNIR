import { useLiveQuery } from 'dexie-react-hooks'
import { useTranslation } from 'react-i18next'
import { db } from '../db/db'
import { LANGUAGES, setLanguage, type Language } from '../i18n'

export default function SettingsPage() {
  const { t, i18n } = useTranslation()
  // Vérifie que la base IndexedDB est ouverte et lisible (undefined = en cours de chargement).
  const sessionCount = useLiveQuery(() => db.sessions.count())

  return (
    <section>
      <h1 className="font-display text-4xl font-extrabold tracking-wide text-ink uppercase">{t('settings.title')}</h1>

      <fieldset className="mt-6">
        <legend className="font-semibold text-ink">{t('settings.language')}</legend>
        <p className="mt-1 text-sm text-muted">{t('settings.languageHelp')}</p>
        <div className="mt-3 flex gap-2">
          {LANGUAGES.map((lang: Language) => (
            <label
              key={lang}
              className={`flex min-h-11 min-w-20 cursor-pointer items-center justify-center rounded-lg border px-4 font-semibold uppercase has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
                i18n.language === lang ? 'border-accent bg-accent text-accent-ink' : 'border-line bg-surface text-ink2'
              }`}
            >
              <input
                type="radio"
                name="language"
                value={lang}
                checked={i18n.language === lang}
                onChange={() => void setLanguage(lang)}
                className="sr-only"
              />
              {lang}
            </label>
          ))}
        </div>
      </fieldset>

      <p className="mt-8 text-sm text-muted">
        {t('settings.dbStatus', {
          state: sessionCount === undefined ? t('settings.dbOpening') : t('settings.dbReady', { count: sessionCount }),
        })}
      </p>
    </section>
  )
}
