import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/'

export default function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-gray-500">Carregando...</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
