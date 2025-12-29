import type { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    FileText,
    List,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const menuItems = [
        {
        icon: LayoutDashboard,
        label: 'Dashboard',
        path: '/', // ← SEMPRE aponta para Dashboard.tsx
        },
        {
        icon: FileText,
        label: 'Atendimentos',
        path: '/atendimentos',
        },
        // Menu "Listas" só aparece para MASTER
        ...(user?.role === 'master' ? [{
        icon: List,
        label: 'Listas',
        path: '/listas',
        }] : []),
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-50">
        {/* Header Mobile */}
        <div className="lg:hidden bg-white border-b px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-bold text-blue-600">Radionics</h1>
            <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
        </div>

        {/* Sidebar */}
        <aside
            className={`fixed top-0 left-0 z-40 w-64 h-screen bg-white border-r transition-transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0`}
        >
            <div className="h-full flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b">
                <h1 className="text-2xl font-bold text-blue-600">Radionics</h1>
                <p className="text-sm text-gray-600 mt-1">{user?.name}</p>
                {user?.role === 'master' && (
                <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded">
                    MASTER
                </span>
                )}
            </div>

            {/* Menu */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                    <button
                    key={item.path}
                    onClick={() => {
                        navigate(item.path);
                        setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.path)
                        ? 'bg-blue-50 text-blue-600 font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    >
                    <Icon className="w-5 h-5" />
                    {item.label}
                    </button>
                );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t">
                <Button
                variant="outline"
                className="w-full"
                onClick={handleLogout}
                >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
                </Button>
            </div>
            </div>
        </aside>

        {/* Overlay Mobile */}
        {sidebarOpen && (
            <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            />
        )}

        {/* Main Content */}
        <main className="lg:ml-64 p-6">
            <div className="max-w-7xl mx-auto">{children}</div>
        </main>
        </div>
    );
}
