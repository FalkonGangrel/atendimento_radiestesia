import { useAuth } from '@/hooks/useAuth';

import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-blue-900 text-white transition-all duration-300 flex flex-col`}>
            {/* Header */}
            <div className="p-4 border-b border-blue-800 flex items-center justify-between">
            {sidebarOpen && <h1 className="text-xl font-bold">Radionics</h1>}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1 hover:bg-blue-800 rounded"
            >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            </div>

            {/* Menu */}
            <nav className="flex-1 p-4 space-y-2">
            {user?.role === 'atendente' && (
                <>
                <NavLink
                    href="/"
                    label="Dashboard"
                    active={isActive('/')}
                    sidebarOpen={sidebarOpen}
                />
                <NavLink
                    href="/atendimentos"
                    label="Atendimentos"
                    active={isActive('/atendimentos')}
                    sidebarOpen={sidebarOpen}
                />
                <NavLink
                    href="/novo-atendimento"
                    label="Novo Atendimento"
                    active={isActive('/novo-atendimento')}
                    sidebarOpen={sidebarOpen}
                />
                </>
            )}

            {user?.role === 'master' && (
                <>
                <NavLink
                    href="/dashboard-master"
                    label="Dashboard"
                    active={isActive('/dashboard-master')}
                    sidebarOpen={sidebarOpen}
                />
                <NavLink
                    href="/listas"
                    label="Listas"
                    active={isActive('/listas')}
                    sidebarOpen={sidebarOpen}
                />
                </>
            )}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-blue-800">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">{user?.name.charAt(0).toUpperCase()}</span>
                </div>
                {sidebarOpen && (
                <div className="text-sm">
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-blue-200 text-xs">{user?.role}</p>
                </div>
                )}
            </div>
            <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-800 transition"
            >
                <LogOut size={18} />
                {sidebarOpen && <span>Sair</span>}
            </button>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
            <div className="p-8">
            {children}
            </div>
        </main>
        </div>
    );
}

interface NavLinkProps {
    href: string;
    label: string;
    active: boolean;
    sidebarOpen: boolean;
}

function NavLink({ href, label, active, sidebarOpen }: NavLinkProps) {
    const navigate = useNavigate();

    return (
        <button
        onClick={() => navigate(href)}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded transition ${
            active
            ? 'bg-blue-800 text-white'
            : 'text-blue-100 hover:bg-blue-800'
        }`}
        title={!sidebarOpen ? label : ''}
        >
        <span className="text-lg">→</span>
        {sidebarOpen && <span>{label}</span>}
        </button>
    );
}
