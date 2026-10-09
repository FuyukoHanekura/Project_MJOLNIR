import { HashRouter, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell'
import OverviewPage from './pages/OverviewPage'
import SessionsPage from './pages/SessionsPage'
import ExercisesPage from './pages/ExercisesPage'
import ExerciseDetailPage from './pages/ExerciseDetailPage'
import TrackingPage from './pages/TrackingPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<OverviewPage />} />
          <Route path="seances" element={<SessionsPage />} />
          <Route path="exercices" element={<ExercisesPage />} />
          <Route path="exercices/:id" element={<ExerciseDetailPage />} />
          <Route path="suivi" element={<TrackingPage />} />
          <Route path="reglages" element={<SettingsPage />} />
          <Route path="*" element={<OverviewPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
