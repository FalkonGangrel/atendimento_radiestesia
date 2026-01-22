import { NavLink } from 'react-router-dom'
import clsx from 'clsx'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  clsx(
    'block px-3 py-2 rounded transition',
    isActive
      ? 'bg-zinc-700 text-white'
      : 'text-zinc-300 hover:bg-zinc-800'
  )

export default function SidebarMaster() {
  return (
    <aside className="w-64 bg-zinc-900 text-white p-4">
      <h2 className="text-lg font-semibold mb-4">Master</h2>

      <nav className="space-y-2">
        <NavLink to="/dashboard-master" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/master/usuarios" className={linkClass}>
          Usuários
        </NavLink>

        <NavLink to="/master/tipos-atendimento" className={linkClass}>
          Tipos de Atendimento
        </NavLink>
      </nav>
    </aside>
  )
}
