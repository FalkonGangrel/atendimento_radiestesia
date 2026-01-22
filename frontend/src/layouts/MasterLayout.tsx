import { Outlet } from 'react-router-dom'
import SidebarMaster from '@/components/SidebarMaster'

export default function MasterLayout() {
  return (
    <div className="flex h-screen">
      <SidebarMaster />

      <main className="flex-1 overflow-auto p-6 bg-zinc-50">
        <Outlet />
      </main>
    </div>
  )
}
