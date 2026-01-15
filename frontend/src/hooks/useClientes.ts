// src/hooks/useClientes.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Cliente, ClienteFormData } from '@/types';
import { AxiosError } from 'axios';

// 🔹 LISTAGEM
export const useClientesList = () => {
    return useQuery<Cliente[], AxiosError>({
        queryKey: ['clientes'],
        queryFn: async () => {
            const { data } = await api.get('/clientes');
            return data;
        },
    });
};

// 🔹 DETALHE (RAW)
export const useCliente = (id: number | undefined) => {
    return useQuery<Cliente, AxiosError>({
        queryKey: ['clientes', id],
        queryFn: async () => {
            const { data } = await api.get(`/clientes/${id}`);
            return data;
        },
        enabled: !!id,
    });
};

// 🔹 FORMULÁRIO
export const useClienteForm = (id: number | undefined) => {
    return useQuery<ClienteFormData, AxiosError>({
        queryKey: ['clientes', id],
        queryFn: async () => {
            const { data } = await api.get(`/clientes/${id}`);
            return {
                name: data.name,
                email: data.email,
                telefone: data.telefone,
                whatsapp: data.whatsapp,
                data_nascimento: data.data_nascimento,
                observacoes: data.observacoes,
            };
        },
        enabled: !!id,
    });
};

// 🔹 CREATE / UPDATE
export const useSaveCliente = () => {
    const queryClient = useQueryClient();

    return useMutation<Cliente, AxiosError, { id?: number; data: ClienteFormData }>({
        mutationFn: async ({ id, data }) => {
            if (id) {
                const res = await api.put(`/clientes/${id}`, data);
                return res.data;
            }
            const res = await api.post('/clientes', data);
            return res.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['clientes'] });

            if (variables.id) {
                queryClient.invalidateQueries({ queryKey: ['clientes', variables.id] });
            }
        },
    });
};

// 🔹 DELETE
export const useDeleteCliente = () => {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError, number>({
        mutationFn: async (id) => {
            await api.delete(`/clientes/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clientes'] });
        },
    });
};
