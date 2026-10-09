import { useSyncExternalStore } from 'react'

const query = () => window.matchMedia('(prefers-color-scheme: dark)')

function currentIsDark(): boolean {
  const forced = document.documentElement.getAttribute('data-theme')
  return forced ? forced === 'dark' : query().matches
}

function subscribe(onChange: () => void): () => void {
  const mq = query()
  mq.addEventListener('change', onChange)
  // Le réglage de thème (phase 7) force clair ou sombre via data-theme sur <html>.
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => {
    mq.removeEventListener('change', onChange)
    observer.disconnect()
  }
}

/** Thème sombre actif, selon le système ou le réglage forcé. Les couleurs de chaleur en dépendent. */
export function useIsDark(): boolean {
  return useSyncExternalStore(subscribe, currentIsDark, () => false)
}
