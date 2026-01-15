import { useState } from 'react';
import type { ReactNode } from 'react';

import { api } from '@/lib/api';
import { AuthContext } from '@/contexts/AuthContext';
import type { User } from '@/types';
import { getAuthToken, setAuthToken, clearAuthToken } from '@/lib/utils';
import { Permissions } from "@/constants/permissions";
import { rolePermissions } from "@/constants/rolePermissions";

interface AuthProviderProps {
    children: ReactNode;
}

function getInitialUser(): User | null {
    if (typeof window === 'undefined') return null;

    const token = getAuthToken();
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
        try {
            return JSON.parse(savedUser) as User;
        } catch {
            return null;
        }
    }

    return null;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(getInitialUser);
    const [isLoading] = useState(false);

    function hasPermission(permission: Permissions): boolean {
        if (!user) return false;

        const permissionsList = rolePermissions[user.role];
        return permissionsList ? permissionsList.includes(permission) : false;
    }
    
    async function login(credentials: { email: string; password: string }) {
        const { data } = await api.post('/login', credentials);

        const { token, user: loggedUser } = data;

        setAuthToken(token);
        localStorage.setItem('user', JSON.stringify(loggedUser));
        setUser(loggedUser);
    }

    async function register(credentials: {
        name: string;
        email: string;
        password: string;
    }) {
        await api.post('/register', credentials);
    }

    async function logout() {
        try {
            await api.post('/logout');
        } catch {
            // ignora erro do backend
        }

        clearAuthToken();
        localStorage.removeItem('user');
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                register,
                logout,
                hasPermission,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
