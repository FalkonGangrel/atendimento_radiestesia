import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/'

interface RequireRoleProps {
  roles: Array<'master' | 'atendente'>
}

export default function RequireRole({ roles }: RequireRoleProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/403" replace />
  }

  return <Outlet />
}
