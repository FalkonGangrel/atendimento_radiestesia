import axios, {
    AxiosError,
    type AxiosInstance,
    type InternalAxiosRequestConfig,
} from 'axios';

import { getAuthToken, clearAuthToken } from './utils';

export const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

/**
 * Interceptor de request
 * Adiciona o token de autenticação automaticamente
 */
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAuthToken();

        if (token) {
            // Axios v1+: headers é AxiosHeaders
            config.headers.set('Authorization', `Bearer ${token}`);
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Interceptor de response
 * Trata erros globais de autenticação
 */
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            clearAuthToken();
            // Redirecionamento será responsabilidade do AuthContext
        }

        return Promise.reject(error);
    }
);
