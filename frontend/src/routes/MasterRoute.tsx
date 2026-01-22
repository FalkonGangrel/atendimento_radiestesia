import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts'
import { Permissions } from '@/constants/permissions'

export default function MasterRoute() {
  const { hasPermission, isLoading } = useAuth()

  if (isLoading) return null

  if (!hasPermission(Permissions.DASHBOARD_MASTER)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
