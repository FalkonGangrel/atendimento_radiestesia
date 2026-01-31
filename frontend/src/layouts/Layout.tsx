import { LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import clsx from 'clsx'

import { useAuth } from '@/contexts'
import { menuConfig } from '@/config/menu.config'
import { menuItemClass } from '@/components/menu.styles'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout, hasPermission, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // 🔒 Aguarda autenticação
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <span className="text-gray-500">Carregando...</span>
      </div>
    )
  }

  // 🔒 Segurança absoluta
  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={clsx(
          'bg-gray-900 text-white transition-all duration-300 flex flex-col',
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h1 className="font-bold">
            {sidebarOpen ? 'Radionics' : 'R'}
          </h1>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white"
            aria-label="Alternar menu"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-4">
          {menuConfig.map((section, index) => {
            const visibleItems = section.items.filter(
              item => !item.permission || hasPermission(item.permission)
            )

            if (visibleItems.length === 0) return null

            return (
              <div key={index}>
                {section.label && sidebarOpen && (
                  <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase">
                    {section.label}
                  </p>
                )}

                <div className="space-y-1">
                  {visibleItems.map(item => {
                    const Icon = item.icon
                    const isActive =
                      location.pathname === item.path

                    return (
                      <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={clsx(
                          menuItemClass(!sidebarOpen),
                          isActive && 'bg-gray-800'
                        )}
                      >
                        <Icon size={20} />
                        {sidebarOpen && item.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="mb-4">
            <p className="font-semibold truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">
              {user.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
          >
            <LogOut size={18} />
            {sidebarOpen && 'Sair'}
          </button>
        </div>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
