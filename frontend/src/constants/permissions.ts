export const Permissions = {
  CAMPOS_MANAGE: 'campos.manage',
  
  CLIENTES_VIEW: 'clientes.view',
  CLIENTES_CREATE: 'clientes.create',
  CLIENTES_UPDATE: 'clientes.update',
  CLIENTES_DELETE: 'clientes.delete',
  CLIENTES_VIEW_OWNER: 'clientes.view_owner',
  
  DASHBOARD_MASTER: 'dashboard.master',
  
  LISTAS_MANAGE: 'listas.manage',
  
  TIPO_ATENDIMENTO_CREATE: 'tipo_atendimento.create',
  TIPO_ATENDIMENTO_DELETE: 'tipo_atendimento.delete',
  TIPO_ATENDIMENTO_UPDATE: 'tipo_atendimento.update',

  TIPOS_ATENDIMENTO: 'tipos-atendimento',
  TIPOS_ATENDIMENTO_MANAGE: 'tipos-atendimento.manage',
  
  USUARIOS_MANAGE: 'usuarios.manage',
  USUARIOS_VIEW: 'usuarios.view',
  USUARIOS_CREATE: 'usuarios.create',
  USUARIOS_UPDATE: 'usuarios.update',
  USUARIOS_DELETE: 'usuarios.delete',
  USUARIOS_RESTORE: 'usuarios.restore',
} as const

/**
 * Tipo Permission = union dos valores
 * 'dashboard.master' | 'usuarios.manage' | ...
 */
export type Permission =
  typeof Permissions[keyof typeof Permissions]
