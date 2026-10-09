import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App'
import { loadSavedTheme } from './db/preferences'
import { seedExercises } from './db/seed'
import { loadSavedLanguage } from './i18n'

/**
 * Thème et langue enregistrés sont appliqués avant le premier rendu, pour éviter un flash
 * du mauvais thème. Si le stockage est lent ou indisponible, on affiche l'appli après 800 ms.
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

  // La base de départ se charge en arrière-plan ; les listes se mettent à jour toutes seules.
  void seedExercises().catch((e: unknown) => console.error(e))
}

void start()
