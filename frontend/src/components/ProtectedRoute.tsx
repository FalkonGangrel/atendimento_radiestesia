// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts';

export default function ProtectedRoute() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return null; // ou <Loading /> no futuro
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
