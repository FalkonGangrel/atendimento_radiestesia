import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts';

export default function MasterRoute() {
    const { hasPermission, isLoading } = useAuth();

    if (isLoading) return null;

    if (!hasPermission('dashboard.master')) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

