import type { User } from '@/types/entities/User';
import { Permissions } from '@/constants/permissions';

export interface AuthContextType {
    user: User | null; // O usuário autenticado ou null se não houver
    isLoading: boolean; // Indica se o estado de autenticação está sendo carregado

    login: (credentials: { email: string; password: string }) => Promise<void>; // Função para login
    register: (credentials: { name: string; email: string; password: string }) => Promise<void>; // Função para registro (simplificado o payload)
    logout: () => Promise<void>; // Função para logout

    hasPermission: (permission: Permissions) => boolean; // Função para verificar permissões do usuário
}