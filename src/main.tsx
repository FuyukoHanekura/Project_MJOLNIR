import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App'
import { seedExercises } from './db/seed'
import { loadSavedLanguage } from './i18n'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// La base de départ et la langue enregistrée se chargent en arrière-plan ;
// les listes se mettent à jour toutes seules (useLiveQuery).
void seedExercises()
void loadSavedLanguage()
