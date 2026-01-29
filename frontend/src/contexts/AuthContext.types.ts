// src/contexts/AuthContext.types.ts
import type { Role } from '@/constants/roles'
import type { Permission } from '@/constants/permissions'

export interface AuthUser {
  id: number
  name: string
  email: string
  role: Role
  permissions: Permission[]
}

export interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  hasPermission: (permission: Permission) => boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}
