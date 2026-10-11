import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App'
import { loadSavedTheme } from './db/preferences'
import { seedExercises } from './db/seed'
import { loadSavedLanguage } from './i18n'

/**
 * The saved theme and language are applied before the first render, to avoid a flash
 * of the wrong theme. If storage is slow or unavailable, the app is shown after 800 ms.
 */
async function start() {
  const timeout = new Promise<void>((resolve) => setTimeout(resolve, 800))
  const saved = Promise.all([loadSavedTheme(), loadSavedLanguage()]).then(
    () => undefined,
    (e: unknown) => console.error(e),
  )
  await Promise.race([saved, timeout])

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )

  // The built-in catalogue loads in the background; lists update on their own.
  void seedExercises().catch((e: unknown) => console.error(e))
}

void start()
