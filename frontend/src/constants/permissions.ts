export const Permissions = {
  DASHBOARD_MASTER: 'dashboard.master',
  USERS_MANAGE: 'users.manage',

  TIPOS_ATENDIMENTO: 'tipos-atendimento',
  TIPOS_ATENDIMENTO_MANAGE: 'tipos-atendimento.manage',

  CAMPOS_MANAGE: 'campos.manage',
  LISTAS_MANAGE: 'listas.manage',
} as const

/**
 * Tipo Permission = union dos valores
 * 'dashboard.master' | 'users.manage' | ...
 */
export type Permission =
  typeof Permissions[keyof typeof Permissions]
