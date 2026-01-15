// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { queryClient } from '@/lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts';
import ProtectedRoute from '@/components/ProtectedRoute';
import MasterRoute from '@/components/MasterRoute';

// Importações dos componentes de página
import Login from '@/pages/Login';
//import Register from '@/pages/Register'; // Assumindo que você terá uma página de registro
import Dashboard from '@/pages/Dashboard';
import AtendimentosList from '@/pages/AtendimentosList';
import AtendimentoDetail from '@/pages/AtendimentoDetail';
import AtendimentoForm from '@/pages/AtendimentoForm';
import Clientes from '@/pages/Clientes';
import ClienteDetail from '@/pages/ClienteDetail';
import ClienteForm from '@/pages/ClienteForm';

// Componentes Master (nomes ajustados para clareza e consistência)
import DashboardMaster from '@/pages/DashboardMaster';
import Listas from '@/pages/Listas'; // Manter o nome do arquivo, mas o conceito é ListModels
import Usuarios from '@/pages/Usuarios';
import PermissoesUsuario from '@/pages/PermissoesUsuario';
import CamposConfiguraveis from '@/pages/CamposConfiguraveis';
import TiposAtendimento from '@/pages/TiposAtendimento';
import TipoAtendimentoForm from '@/pages/TipoAtendimentoForm';

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Rotas de Autenticação */}
                        <Route path="/login" element={<Login />} />
                        {/* <Route path="/register" element={<Register />} /> */}

                        <Route element={<ProtectedRoute />}>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/atendimentos" element={<AtendimentosList />} />
                            <Route path="/novo-atendimento" element={<AtendimentoForm />} />
                            <Route path="/atendimentos/:id" element={<AtendimentoDetail />} />
                            <Route path="/atendimentos/:id/editar" element={<AtendimentoForm />} />

                            <Route path="/clientes" element={<Clientes />} />
                            <Route path="/clientes/novo" element={<ClienteForm />} />
                            <Route path="/clientes/:id" element={<ClienteDetail />} />
                            <Route path="/clientes/:id/editar" element={<ClienteForm />} />
                        </Route>

                        <Route element={<MasterRoute />}>
                            <Route path="/dashboard-master" element={<DashboardMaster />} />
                            <Route path="/listas" element={<Listas />} />
                            <Route path="/master/usuarios" element={<Usuarios />} />
                            <Route path="/master/campos" element={<CamposConfiguraveis />} />
                            <Route path="/master/permissoes/:userId" element={<PermissoesUsuario />} />
                            <Route path="/master/tipos-atendimento" element={<TiposAtendimento />} />
                            <Route path="/master/tipos-atendimento/novo" element={<TipoAtendimentoForm />} />
                            <Route path="/master/tipos-atendimento/:id" element={<TipoAtendimentoForm />} />
                            <Route path="/master/tipos-atendimento/:id/editar" element={<TipoAtendimentoForm />} />
                        </Route>

                        {/* Fallback para rotas não encontradas */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>
    );
}
