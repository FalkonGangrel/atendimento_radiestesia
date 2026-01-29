// src/constants/permissions.ts
export const Permissions = {
  CAMPOS_MANAGE: 'campos.manage',

  CLIENTES_VIEW: 'clientes.view',
  CLIENTES_CREATE: 'clientes.create',
  CLIENTES_UPDATE: 'clientes.update',
  CLIENTES_DELETE: 'clientes.delete',
  CLIENTES_VIEW_OWNER: 'clientes.view_owner',

  DASHBOARD_MASTER: 'dashboard.master',

  LISTAS_MANAGE: 'listas.manage',

  TIPOS_ATENDIMENTO_MANAGE: 'tipos-atendimento.manage',

  USUARIOS_MANAGE: 'usuarios.manage',
  USUARIOS_VIEW: 'usuarios.view',
  USUARIOS_CREATE: 'usuarios.create',
  USUARIOS_UPDATE: 'usuarios.update',
  USUARIOS_DELETE: 'usuarios.delete',
  USUARIOS_RESTORE: 'usuarios.restore',
} as const

export type Permission =
  typeof Permissions[keyof typeof Permissions]
