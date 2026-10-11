import { lazy, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell'
import OverviewPage from './pages/OverviewPage'
import SessionsPage from './pages/SessionsPage'
import SessionEditPage from './pages/SessionEditPage'
import ExercisesPage from './pages/ExercisesPage'
import ExerciseDetailPage from './pages/ExerciseDetailPage'
import SettingsPage from './pages/SettingsPage'

// Less frequent pages: loaded on demand to keep the first load light.
const ExerciseFormPage = lazy(() => import('./pages/ExerciseFormPage'))
const BulkImportPage = lazy(() => import('./pages/BulkImportPage'))
const PackExportPage = lazy(() => import('./pages/PackExportPage'))
const TrackingPage = lazy(() => import('./pages/TrackingPage'))

export default function App() {
  return (
    <HashRouter>
      <Suspense fallback={<p className="p-4 text-muted">…</p>}>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<OverviewPage />} />
            <Route path="seances" element={<SessionsPage />} />
            <Route path="seances/:id" element={<SessionEditPage />} />
            <Route path="exercices" element={<ExercisesPage />} />
            <Route path="exercices/nouveau" element={<ExerciseFormPage />} />
            <Route path="exercices/import" element={<BulkImportPage />} />
            <Route path="exercices/paquet" element={<PackExportPage />} />
            <Route path="exercices/:id/modifier" element={<ExerciseFormPage />} />
            <Route path="exercices/:id" element={<ExerciseDetailPage />} />
            <Route path="suivi" element={<TrackingPage />} />
            <Route path="reglages" element={<SettingsPage />} />
            <Route path="*" element={<OverviewPage />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  )
}
