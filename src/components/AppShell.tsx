import { Outlet } from 'react-router-dom'
import ExportReminder from './ExportReminder'
import TabBar from './TabBar'

export default function AppShell() {
  return (
    <div className="min-h-dvh md:flex">
      <TabBar />
      <div className="min-w-0 flex-1">
        <ExportReminder />
        <main className="mx-auto w-full max-w-3xl px-4 pt-6 pb-28 md:pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
