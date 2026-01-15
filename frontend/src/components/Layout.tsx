import { BarChart, ClipboardList, DollarSign, LayoutDashboard, ListTodo, LogOut, Menu, PlusCircle, Settings, Users, X } from 'lucide-react'; // Importar ícones relevantes
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/useAuthContext';


// Definir a interface para o objeto User, conforme o backend
interface User {
    id: number;
    name: string;
    email: string;
    role: 'master' | 'atendente'; // Definir roles específicas
    created_at: string;
    // Adicione outros campos do usuário se necessário
}

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    // Tipar o user com a interface User
    const { user, logout } = useAuthContext() as { user: User | null; logout: () => Promise<void> };
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={`${
                    sidebarOpen ? 'w-64' : 'w-20'
                } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
            >
                {/* Header do Sidebar */}
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h1 className={`font-bold ${sidebarOpen ? 'text-xl' : 'text-xs'}`}>
                        {sidebarOpen ? 'Radionics' : 'R'}
                    </h1>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 text-gray-400 hover:text-white">
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 p-4 space-y-2">
                    {/* Dashboard Principal (para todos) */}
                    <button
                        onClick={() => navigate('/')}
                        className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition flex items-center gap-2"
                    >
                        <LayoutDashboard size={20} />
                        {sidebarOpen && 'Dashboard'}
                    </button>

                    {/* Atendimentos */}
                    <button
                        onClick={() => navigate('/atendimentos')}
                        className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition flex items-center gap-2"
                    >
                        <ClipboardList size={20} />
                        {sidebarOpen && 'Meus Atendimentos'}
                    </button>

                    {/* Novo Atendimento */}
                    <button
                        onClick={() => navigate('/novo-atendimento')}
                        className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition flex items-center gap-2"
                    >
                        <PlusCircle size={20} />
                        {sidebarOpen && 'Novo Atendimento'}
                    </button>

                    {/* Clientes */}
                    <button
                        onClick={() => navigate('/clientes')}
                        className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition flex items-center gap-2"
                    >
                        <Users size={20} />
                        {sidebarOpen && 'Clientes'}
                    </button>

                    {/* Divisor e Menu Master */}
                    {user?.role === 'master' && (
                        <>
                            <div className="border-t border-gray-700 my-4"></div>
                            <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase">
                                {sidebarOpen ? 'Administração' : 'ADM'}
                            </p>

                            {/* Usuários */}
                            <button
                                onClick={() => navigate('/master/usuarios')}
                                className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition flex items-center gap-2"
                            >
                                <Users size={20} />
                                {sidebarOpen && 'Usuários'}
                            </button>

                            {/* Tipos de Atendimento */}
                            <button
                                onClick={() => navigate('/master/tipos-atendimento')}
                                className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition flex items-center gap-2"
                            >
                                <DollarSign size={20} />
                                {sidebarOpen && 'Tipos de Atendimento'}
                            </button>

                            {/* Campos Configuráveis */}
                            <button
                                onClick={() => navigate('/master/campos')}
                                className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition flex items-center gap-2"
                            >
                                <Settings size={20} />
                                {sidebarOpen && 'Campos Configuráveis'}
                            </button>

                            {/* Listas (Observação: Futuramente pode ser um dropdown para sub-itens) */}
                            <button
                                onClick={() => navigate('/listas')}
                                className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition flex items-center gap-2"
                            >
                                <ListTodo size={20} />
                                {sidebarOpen && 'Listas'}
                            </button>

                            {/* Dashboard Master */}
                            <button
                                onClick={() => navigate('/dashboard-master')}
                                className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition flex items-center gap-2"
                            >
                                <BarChart size={20} />
                                {sidebarOpen && 'Dashboard Master'}
                            </button>
                        </>
                    )}
                </nav>

                {/* Footer do Sidebar */}
                <div className="p-4 border-t border-gray-700">
                    <div className="mb-4">
                        <p className={`font-semibold truncate ${sidebarOpen ? 'text-sm' : 'text-xs'}`}>{user?.name}</p>
                        <p className={`text-gray-400 truncate ${sidebarOpen ? 'text-xs' : 'text-xxs'}`}>{user?.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
                    >
                        <LogOut size={18} />
                        {sidebarOpen && 'Sair'}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-8">{children}</div>
            </div>
        </div>
    );
}
