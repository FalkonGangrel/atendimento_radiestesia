import type { ElementType } from 'react'
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  Users,
  DollarSign,
  Settings,
  ListTodo,
  BarChart,
} from 'lucide-react'

import { type Permission, Permissions } from '@/constants/permissions'

export interface MenuItem {
  label: string
  path: string
  icon: ElementType
  permission?: Permission
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
        permission: Permissions.USERS_MANAGE,
      },
      {
        label: 'Tipos de Atendimento',
        path: '/master/tipos-atendimento',
        icon: DollarSign,
        permission: Permissions.TIPOS_ATENDIMENTO_MANAGE,
      },
      {
        label: 'Campos Configuráveis',
        path: '/master/campos',
        icon: Settings,
        permission: Permissions.CAMPOS_MANAGE,
      },
      {
        label: 'Listas',
        path: '/listas',
        icon: ListTodo,
        permission: Permissions.LISTAS_MANAGE,
      },
      {
        label: 'Dashboard Master',
        path: '/dashboard-master',
        icon: BarChart,
        permission: Permissions.DASHBOARD_MASTER,
      },
    ],
  },
] as const
