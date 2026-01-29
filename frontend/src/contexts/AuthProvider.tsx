// src/contexts/AuthProvider.tsx
import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import type { Permission } from '@/constants/permissions'
import { api } from '@/lib/api'
import { setAuthToken, clearAuthToken } from '@/lib/utils'
import type { AuthUser } from './AuthContext.types'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        const { data } = await api.get('/me')

        setUser({
          ...data.user,
          permissions: data.user.permissions ?? [],
        })
      } catch {
        clearAuthToken()
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  function hasPermission(permission: Permission): boolean {
    if (!user) return false

    if (user.role === 'master') {
      return true
    }

    return user.permissions.includes(permission)
  }

  async function login(email: string, password: string) {
    const { data } = await api.post('/login', { email, password })

    setAuthToken(data.token)

    setUser({
      ...data.user,
      permissions: data.user.permissions ?? [],
    })
  }

  function logout() {
    clearAuthToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        hasPermission,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
