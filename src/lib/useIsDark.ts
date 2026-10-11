import { useSyncExternalStore } from 'react'

const query = () => window.matchMedia('(prefers-color-scheme: dark)')

function currentIsDark(): boolean {
  const forced = document.documentElement.getAttribute('data-theme')
  return forced ? forced === 'dark' : query().matches
}

function subscribe(onChange: () => void): () => void {
  const mq = query()
  mq.addEventListener('change', onChange)
  // The theme setting forces light or dark through data-theme on <html>.
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => {
    mq.removeEventListener('change', onChange)
    observer.disconnect()
  }
}

/** Whether the dark theme is active, from the system or the forced setting. Heat colours depend on it. */
export function useIsDark(): boolean {
  return useSyncExternalStore(subscribe, currentIsDark, () => false)
}
