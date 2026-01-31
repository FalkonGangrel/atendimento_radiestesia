// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from '@/lib/queryClient'
import { AuthProvider } from '@/contexts'

import RequireAuth from '@/guards/RequireAuth'
import PermissionRoute from '@/routes/PermissionRoute'
import LayoutRoute from '@/routes/LayoutRoute'

import { Permissions } from '@/constants/permissions'

// Pages
import Login from '@/pages/Login'
import Forbidden from '@/pages/Forbidden'
import Dashboard from '@/pages/Dashboard'
import Clientes from '@/pages/Clientes'
import ClienteDetail from '@/pages/ClienteDetail'
import ClienteForm from '@/pages/ClienteForm'
import Usuarios from '@/pages/Usuarios'
import TiposAtendimento from '@/pages/TiposAtendimento'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            {/* 🌐 Públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/403" element={<Forbidden />} />

            {/* 🔐 Autenticadas */}
            <Route element={<RequireAuth />}>
              <Route element={<LayoutRoute />}>

                {/* Dashboard */}
                <Route path="/" element={<Dashboard />} />

                {/* Clientes */}
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/clientes/novo" element={<ClienteForm />} />
                <Route path="/clientes/:id" element={<ClienteDetail />} />
                <Route path="/clientes/:id/editar" element={<ClienteForm />} />

                {/* 👑 Usuários (perm. granular) */}
                <Route
                  element={
                    <PermissionRoute permission={Permissions.USUARIOS_VIEW} />
                  }
                >
                  <Route path="/master/usuarios" element={<Usuarios />} />
                </Route>

                {/* Tipos de Atendimento (perm. granular) */}
                <Route
                  element={
                    <PermissionRoute permission={Permissions.TIPOS_ATENDIMENTO_VIEW} />
                  }
                >
                  <Route path="/master/tipos-atendimento" element={<TiposAtendimento />} />
                </Route>

              </Route>
            </Route>

            {/* 🚨 Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
