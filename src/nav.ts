// Libellés provisoires en français : ils passeront dans fr.json / en.json avec i18next en phase 2.
export type TabId = 'overview' | 'sessions' | 'exercises' | 'tracking' | 'settings'

export interface TabDef {
  id: TabId
  path: string
  label: string
}

export const TABS: readonly TabDef[] = [
  { id: 'overview', path: '/', label: 'Aperçu' },
  { id: 'sessions', path: '/seances', label: 'Séances' },
  { id: 'exercises', path: '/exercices', label: 'Exercices' },
  { id: 'tracking', path: '/suivi', label: 'Suivi' },
  { id: 'settings', path: '/reglages', label: 'Réglages' },
]
