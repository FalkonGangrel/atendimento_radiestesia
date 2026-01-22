import type { Role } from '@/constants/roles'
import type { Permission } from '@/constants/permissions'

export interface User {
  id: number
  name: string
  email: string
  role: Role
  permissions: Permission[]
  created_at: string
  updated_at: string
}
