// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from '@/lib/queryClient'
import { AuthProvider } from '@/contexts'

import ProtectedRoute from '@/routes/ProtectedRoute'
import MasterRoute from '@/routes/MasterRoute'
import LayoutRoute from '@/routes/LayoutRoute'

// Pages
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import AtendimentosList from '@/pages/AtendimentosList'
import AtendimentoDetail from '@/pages/AtendimentoDetail'
import AtendimentoForm from '@/pages/AtendimentoForm'
import Clientes from '@/pages/Clientes'
import ClienteDetail from '@/pages/ClienteDetail'
import ClienteForm from '@/pages/ClienteForm'

// Master pages
import DashboardMaster from '@/pages/DashboardMaster'
import Listas from '@/pages/Listas'
import Usuarios from '@/pages/Usuarios'
import PermissoesUsuario from '@/pages/PermissoesUsuario'
import CamposConfiguraveis from '@/pages/CamposConfiguraveis'
import TiposAtendimento from '@/pages/TiposAtendimento'
import TipoAtendimentoForm from '@/pages/TipoAtendimentoForm'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Login */}
            <Route path="/login" element={<Login />} />

            {/* Rotas protegidas */}
            <Route element={<ProtectedRoute />}>
              {/* 🔥 AQUI ENTRA O LAYOUT */}
              <Route element={<LayoutRoute />}>
                {/* Rotas comuns */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/atendimentos" element={<AtendimentosList />} />
                <Route path="/novo-atendimento" element={<AtendimentoForm />} />
                <Route path="/atendimentos/:id" element={<AtendimentoDetail />} />
                <Route path="/atendimentos/:id/editar" element={<AtendimentoForm />} />

                <Route path="/clientes" element={<Clientes />} />
                <Route path="/clientes/novo" element={<ClienteForm />} />
                <Route path="/clientes/:id" element={<ClienteDetail />} />
                <Route path="/clientes/:id/editar" element={<ClienteForm />} />

                {/* Rotas master */}
                <Route element={<MasterRoute />}>
                  <Route path="/dashboard-master" element={<DashboardMaster />} />
                  <Route path="/listas" element={<Listas />} />
                  <Route path="/master/usuarios" element={<Usuarios />} />
                  <Route path="/master/permissoes/:userId" element={<PermissoesUsuario />} />
                  <Route path="/master/campos" element={<CamposConfiguraveis />} />
                  <Route path="/master/tipos-atendimento" element={<TiposAtendimento />} />
                  <Route path="/master/tipos-atendimento/novo" element={<TipoAtendimentoForm />} />
                  <Route path="/master/tipos-atendimento/:id" element={<TipoAtendimentoForm />} />
                  <Route path="/master/tipos-atendimento/:id/editar" element={<TipoAtendimentoForm />} />
                </Route>
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
