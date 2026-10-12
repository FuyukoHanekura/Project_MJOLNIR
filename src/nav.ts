export type TabId = 'overview' | 'sessions' | 'exercises' | 'tracking' | 'settings' | 'help'

export interface TabDef {
  id: TabId
  path: string
  /** Translation key: nav.<id> */
  labelKey: `nav.${TabId}`
}

export const TABS: readonly TabDef[] = [
  { id: 'overview', path: '/', labelKey: 'nav.overview' },
  { id: 'sessions', path: '/seances', labelKey: 'nav.sessions' },
  { id: 'exercises', path: '/exercices', labelKey: 'nav.exercises' },
  { id: 'tracking', path: '/suivi', labelKey: 'nav.tracking' },
  { id: 'settings', path: '/reglages', labelKey: 'nav.settings' },
  { id: 'help', path: '/aide', labelKey: 'nav.help' },
]
