import type { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="text-center py-10">Carregando...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
