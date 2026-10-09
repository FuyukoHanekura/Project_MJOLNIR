import { useLiveQuery } from 'dexie-react-hooks'
import PagePlaceholder from '../components/PagePlaceholder'
import { db } from '../db/db'

export default function SettingsPage() {
  // Vérifie que la base IndexedDB est ouverte et lisible (undefined = en cours de chargement).
  const sessionCount = useLiveQuery(() => db.sessions.count())

  return (
    <PagePlaceholder title="Réglages">
      <p className="mt-6 text-sm text-muted">
        Base locale : {sessionCount === undefined ? 'ouverture…' : `prête (${sessionCount} séance${sessionCount > 1 ? 's' : ''})`}
      </p>
    </PagePlaceholder>
  )
}
