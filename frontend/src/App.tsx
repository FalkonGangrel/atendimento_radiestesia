import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthProvider';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';

// Páginas
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import AtendimentosList from '@/pages/AtendimentosList';
import AtendimentoForm from '@/pages/AtendimentoForm';
import AtendimentoDetail from '@/pages/AtendimentoDetail';
import Listas from '@/pages/Listas';
import DashboardMaster from '@/pages/DashboardMaster';
import { Usuarios } from '@/pages/Usuarios';
import { CamposConfiguraveis } from '@/pages/CamposConfiguraveis';
import { PermissoesUsuario } from '@/pages/PermissoesUsuario';
import ClienteForm from '@/pages/ClienteForm';
import ClienteDetail from '@/pages/ClienteDetail';
import Clientes from '@/pages/Clientes';
import TiposAtendimento from '@/pages/TiposAtendimento';
import TipoAtendimentoForm from '@/pages/TipoAtendimentoForm';
import ProtectedRoute from '@/components/ProtectedRoute';

const queryClient = new QueryClient();

// Rotas que exigem apenas usuário logado
function PrivateRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

// Rotas exclusivas para MASTER
function MasterRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (user?.role !== 'master') {
    return <Navigate to="/" replace />;
  }
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />

            {/* Rotas do atendente */}
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/atendimentos" element={<PrivateRoute><AtendimentosList /></PrivateRoute>} />
            <Route path="/novo-atendimento" element={<PrivateRoute><AtendimentoForm /></PrivateRoute>} />
            <Route path="/atendimentos/:id" element={<PrivateRoute><AtendimentoDetail /></PrivateRoute>} />
            <Route path="/atendimentos/:id/editar" element={<PrivateRoute><AtendimentoForm /></PrivateRoute>} />

            {/* Rotas do master */}
            <Route path="/listas" element={<MasterRoute><Listas /></MasterRoute>} />
            <Route path="/dashboard-master" element={<MasterRoute><DashboardMaster /></MasterRoute>} />
            <Route path="/master/usuarios" element={<MasterRoute><Usuarios /></MasterRoute>} />
            <Route path="/master/campos" element={<MasterRoute><CamposConfiguraveis /></MasterRoute>} />
            <Route path="/master/permissoes/:userId" element={<MasterRoute><PermissoesUsuario /></MasterRoute>} />
            <Route path="/master/tipos-atendimento" element={<PrivateRoute><TiposAtendimento /></PrivateRoute>} />
            <Route path="/master/tipos-atendimento/novo" element={<PrivateRoute><TipoAtendimentoForm /></PrivateRoute>} />
            <Route path="/master/tipos-atendimento/:id" element={<PrivateRoute><TipoAtendimentoForm /></PrivateRoute>} />
            <Route path="/master/tipos-atendimento/:id/editar" element={<PrivateRoute><TipoAtendimentoForm /></PrivateRoute>} />

            {/* Rotas de Clientes */}
            <Route path="/clientes" element={<PrivateRoute><Clientes /></PrivateRoute>} />
            <Route path="/clientes/novo" element={<PrivateRoute><ClienteForm /></PrivateRoute>} />
            <Route path="/clientes/:id" element={<PrivateRoute><ClienteDetail /></PrivateRoute>} />
            <Route path="/clientes/:id/editar" element={<PrivateRoute><ClienteForm /></PrivateRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
