// src/helpers/permissions.ts
import type { AuthUser } from '@/contexts/AuthContext.types'
import { Permissions } from '@/constants/permissions'

/**
 * Usuários (CRUD + restore)
 */
export function canViewUsuarios(user: AuthUser | null): boolean {
  if (!user) return false
  if (user.role === 'master') return true

  return user.permissions?.includes(Permissions.USUARIOS_VIEW) ?? false
}

export function canManageUsuarios(user: AuthUser | null): boolean {
  if (!user) return false
  if (user.role === 'master') return true

  return (
    user.permissions?.includes(Permissions.USUARIOS_CREATE) ||
    user.permissions?.includes(Permissions.USUARIOS_UPDATE) ||
    user.permissions?.includes(Permissions.USUARIOS_DELETE)
  ) ?? false
}

export function canManagePermissionsUsuarios(user: AuthUser | null): boolean {
  if (!user) return false
  if (user.role === 'master') return true

  return user.permissions?.includes(Permissions.USUARIOS_MANAGE) ?? false
}

export function canRestoreUsuarios(user: AuthUser | null): boolean {
  if (!user) return false
  if (user.role === 'master') return true

  return user.permissions?.includes(Permissions.USUARIOS_RESTORE) ?? false
}

/**
 * Clientes
 */
export function canViewClientes(user: AuthUser | null): boolean {
  if (!user) return false
  if (user.role === 'master') return true

  return user.permissions?.includes(Permissions.CLIENTES_VIEW) ?? false
}

export function canManageClientes(user: AuthUser | null): boolean {
  if (!user) return false
  if (user.role === 'master') return true

  return (
    user.permissions?.includes(Permissions.CLIENTES_CREATE) ||
    user.permissions?.includes(Permissions.CLIENTES_UPDATE) ||
    user.permissions?.includes(Permissions.CLIENTES_DELETE)
  ) ?? false
}

/**
 * Tipos de Atendimento
 */
export function canManageTiposAtendimento(user: AuthUser | null): boolean {
  if (!user) return false
  if (user.role === 'master') return true

  return user.permissions?.includes(Permissions.TIPOS_ATENDIMENTO_MANAGE) ?? false
}

/**
 * Dashboard
 */
export function canAccessMasterDashboard(user: AuthUser | null): boolean {
  if (!user) return false

  return user.role === 'master'
}
