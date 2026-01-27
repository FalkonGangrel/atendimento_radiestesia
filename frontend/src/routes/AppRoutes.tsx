import { Routes, Route } from 'react-router-dom'

import RequireAuth from '@/guards/RequireAuth'
import RequireRole from '@/guards/RequireRole'

import Clientes from '@/pages/Clientes'
import ClienteForm from '@/pages/ClienteForm'
import Forbidden from '@/pages/Forbidden'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Usuarios from '@/pages/Usuarios'

export default function AppRoutes() {
  return (
    <Routes>

      {/* Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/403" element={<Forbidden />} />

      {/* 🔐 Autenticadas */}
      <Route element={<RequireAuth />}>
        <Route path="/" element={<Dashboard />} />

        <Route path="/clientes" element={<Clientes />} />
        <Route path="/clientes/novo" element={<ClienteForm />} />
        <Route path="/clientes/:id/editar" element={<ClienteForm />} />

        {/* 👑 Apenas Master */}
        <Route element={<RequireRole roles={['master']} />}>
          <Route path="/usuarios" element={<Usuarios />} />
        </Route>
      </Route>

    </Routes>
  )
}
