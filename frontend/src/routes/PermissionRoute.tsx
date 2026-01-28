import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts'
import type { Permission } from '@/constants/permissions'

interface PermissionRouteProps {
  permission: Permission
}

export default function PermissionRoute({ permission }: PermissionRouteProps) {
  const { hasPermission, isLoading } = useAuth()

  if (isLoading) return null

  if (!hasPermission(permission)) {
    return <Navigate to="/403" replace />
  }

  return <Outlet />
}
