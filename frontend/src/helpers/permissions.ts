// src/helpers/permissions.ts
import { Permissions } from '@/constants/permissions'
import type { AuthUser } from '@/contexts/AuthContext.types'

const isMaster = (user: AuthUser | null) => user?.role === 'master'
//const hasRole  = (user: AuthUser | null, ...roles: string[]) => !!user && roles.includes(user.role)
const hasPerm  = (user: AuthUser | null, perm: string) =>
  user?.permissions?.includes(perm as any) ?? false

/* -------------------------------------------------------
 | Usuários
 ------------------------------------------------------- */
export function canViewUsuarios(user: AuthUser | null): boolean {
  return isMaster(user) || hasPerm(user, Permissions.USUARIOS_VIEW)
}

export function canManageUsuarios(user: AuthUser | null): boolean {
  return isMaster(user) || (
    hasPerm(user, Permissions.USUARIOS_CREATE) ||
    hasPerm(user, Permissions.USUARIOS_UPDATE) ||
    hasPerm(user, Permissions.USUARIOS_DELETE)
  )
}

export function canManagePermissionsUsuarios(user: AuthUser | null): boolean {
  return isMaster(user) || hasPerm(user, Permissions.USUARIOS_MANAGE)
}

export function canRestoreUsuarios(user: AuthUser | null): boolean {
  return isMaster(user) || hasPerm(user, Permissions.USUARIOS_RESTORE)
}

/* -------------------------------------------------------
 | Clientes — baseado em autenticação + ownership (sem permissão granular)
 ------------------------------------------------------- */
export function canViewClientes(user: AuthUser | null): boolean {
  return !!user // todo autenticado vê seus próprios clientes
}

export function canManageClientes(user: AuthUser | null): boolean {
  return !!user // todo autenticado gerencia seus próprios clientes
}

/* -------------------------------------------------------
 | Tipos de Atendimento — apenas master
 ------------------------------------------------------- */
export function canViewTiposAtendimento(user: AuthUser | null): boolean {
  return isMaster(user)
}

export function canManageTiposAtendimento(user: AuthUser | null): boolean {
  return isMaster(user) // somente master cadastra/edita/exclui tipos
}

/* -------------------------------------------------------
 | Dashboard
 ------------------------------------------------------- */
export function canAccessMasterDashboard(user: AuthUser | null): boolean {
  return isMaster(user)
}