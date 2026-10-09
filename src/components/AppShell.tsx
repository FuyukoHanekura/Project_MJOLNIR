import { Outlet } from 'react-router-dom'
import TabBar from './TabBar'

export default function AppShell() {
  return (
    <div className="min-h-dvh md:flex">
      <TabBar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-6 pb-28 md:pb-10">
        <Outlet />
      </main>
    </div>
  )
}
