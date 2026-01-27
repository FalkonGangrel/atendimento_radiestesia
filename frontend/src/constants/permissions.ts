export const Permissions = {
  CAMPOS_MANAGE: 'campos.manage',
  
  CLIENTE_CREATE: 'cliente.create',
  CLIENTE_UPDATE: 'cliente.update',
  CLIENTE_DELETE: 'cliente.delete',
  
  DASHBOARD_MASTER: 'dashboard.master',
  
  LISTAS_MANAGE: 'listas.manage',
  
  TIPO_ATENDIMENTO_CREATE: 'tipo_atendimento.create',
  TIPO_ATENDIMENTO_DELETE: 'tipo_atendimento.delete',
  TIPO_ATENDIMENTO_UPDATE: 'tipo_atendimento.update',

  TIPOS_ATENDIMENTO: 'tipos-atendimento',
  TIPOS_ATENDIMENTO_MANAGE: 'tipos-atendimento.manage',
  
  USERS_MANAGE: 'users.manage',
} as const

/**
 * Tipo Permission = union dos valores
 * 'dashboard.master' | 'users.manage' | ...
 */
export type Permission =
  typeof Permissions[keyof typeof Permissions]
