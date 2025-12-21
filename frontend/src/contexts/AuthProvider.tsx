import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { api } from '@/lib/api';
import type { User } from '@/types';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (token) {
        fetchUser();
        } else {
        setIsLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
        const { data } = await api.get('/me');
            setUser(data.user);
        } catch (error) {
            localStorage.removeItem('token');
            setToken(null);
            console.error('Failed to fetch user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const { data } = await api.post('/login', { email, password });
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
    };

    const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
        const { data } = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        });
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
    };

    const logout = async () => {
        try {
        await api.post('/logout');
        } finally {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
        {children}
        </AuthContext.Provider>
    );
}
