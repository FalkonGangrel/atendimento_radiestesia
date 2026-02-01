import {
  BarChart,
  ClipboardList,
  DollarSign,
  LayoutDashboard,
  ListTodo,
  PlusCircle,
  Settings,
  Users,
} from 'lucide-react'

import type { ElementType } from 'react'

import type { AuthUser } from '@/contexts/AuthContext.types'

import {
  canManageUsuarios,
  canManageTiposAtendimento,
  canAccessMasterDashboard,
} from '@/helpers/permissions'

export interface MenuItem {
  label: string
  path: string
  icon: ElementType
  can?: (user: AuthUser | null) => boolean
}

export interface MenuSection {
  label?: string
  items: readonly MenuItem[]
}

export const menuConfig: readonly MenuSection[] = [
  {
    items: [
      {
        label: 'Dashboard',
        path: '/',
        icon: LayoutDashboard,
      },
      {
        label: 'Meus Atendimentos',
        path: '/atendimentos',
        icon: ClipboardList,
      },
      {
        label: 'Novo Atendimento',
        path: '/novo-atendimento',
        icon: PlusCircle,
      },
      {
        label: 'Clientes',
        path: '/clientes',
        icon: Users,
      },
    ],
  },
  {
    label: 'Administração',
    items: [
      {
        label: 'Usuários',
        path: '/master/usuarios',
        icon: Users,
        can: canManageUsuarios,
      },
      {
        label: 'Tipos de Atendimento',
        path: '/master/tipos-atendimento',
        icon: DollarSign,
        can: canManageTiposAtendimento,
      },
      {
        label: 'Campos Configuráveis',
        path: '/master/campos',
        icon: Settings,
        can: canManageTiposAtendimento,
      },
      {
        label: 'Listas',
        path: '/listas',
        icon: ListTodo,
        can: canManageTiposAtendimento,
      },
      {
        label: 'Dashboard Master',
        path: '/dashboard-master',
        icon: BarChart,
        can: canAccessMasterDashboard,
      },
    ],
  },
] as const
