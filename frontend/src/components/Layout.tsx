import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const { user, logout } = useAuth();
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
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1">
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 p-4 space-y-2">
            {/* Dashboard */}
            <button
                onClick={() => navigate('/')}
                className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition"
            >
                {sidebarOpen ? '📊 Dashboard' : '📊'}
            </button>

            {/* Atendimentos */}
            <button
                onClick={() => navigate('/atendimentos')}
                className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition"
            >
                {sidebarOpen ? '📋 Meus Atendimentos' : '📋'}
            </button>

            {/* Novo Atendimento */}
            <button
                onClick={() => navigate('/novo-atendimento')}
                className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition"
            >
                {sidebarOpen ? '➕ Novo Atendimento' : '➕'}
            </button>

            {/* Clientes */}
            <button
                onClick={() => navigate('/clientes')}
                className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition"
            >
                {sidebarOpen ? '👥 Clientes' : '👥'}
            </button>

            {/* Divisor */}
            {user?.role === 'master' && <div className="border-t border-gray-700 my-4"></div>}

            {/* Menu Master */}
            {user?.role === 'master' && (
                <>
                <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase">
                    {sidebarOpen ? 'Administração' : 'ADM'}
                </p>

                <button
                    onClick={() => navigate('/master/usuarios')}
                    className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition"
                >
                    {sidebarOpen ? '👥 Usuários' : '👥'}
                </button>

                <button
                    onClick={() => navigate('/master/tipos-atendimento')}
                    className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition"
                >
                    {sidebarOpen ? '💰 Tipos de Atendimento' : '💰'}
                </button>

                <button
                    onClick={() => navigate('/master/campos')}
                    className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition"
                >
                    {sidebarOpen ? '⚙️ Campos Configuráveis' : '⚙️'}
                </button>

                <button
                    onClick={() => navigate('/listas')}
                    className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition"
                >
                    {sidebarOpen ? '📝 Listas' : '📝'}
                </button>

                <button
                    onClick={() => navigate('/dashboard-master')}
                    className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition"
                >
                    {sidebarOpen ? '📈 Dashboard Master' : '📈'}
                </button>
                </>
            )}
            </nav>

            {/* Footer do Sidebar */}
            <div className="p-4 border-t border-gray-700">
            <div className={`mb-4 ${sidebarOpen ? 'text-sm' : 'text-xs'}`}>
                <p className="font-semibold truncate">{user?.name}</p>
                <p className="text-gray-400 text-xs truncate">{user?.email}</p>
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
