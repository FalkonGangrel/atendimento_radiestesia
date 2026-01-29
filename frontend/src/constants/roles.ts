// src/constants/roles.ts
export const Roles = {
  MASTER: 'master',
  ADMIN: 'admin',
  ATENDENTE: 'atendente',
} as const

export type Role = typeof Roles[keyof typeof Roles]
