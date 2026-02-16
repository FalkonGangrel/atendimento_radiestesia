// src/hooks/useClientes.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Cliente, ClienteFormData } from '@/types';
import { AxiosError } from 'axios';

/* =======================
 * TIPAGEM DA RESPOSTA DA API
 * ======================= */
interface ApiCollection<T> {
    data: T[];
}

interface ApiItem<T> {
    data: T;
}

/* =======================
 * LISTAGEM
 * ======================= */
export const useClientesList = () => {
    return useQuery<Cliente[], AxiosError>({
        queryKey: ['clientes'],
        queryFn: async () => {
            const { data } = await api.get<ApiCollection<Cliente>>('/clientes');
            return data.data; // ✅ retorna SOMENTE o array
        },
    });
};

/* =======================
 * DETALHE
 * ======================= */
export const useCliente = (id?: number) => {
    return useQuery<Cliente, AxiosError>({
        queryKey: ['clientes', id],
        queryFn: async () => {
            const { data } = await api.get<ApiItem<Cliente>>(`/clientes/${id}`);
            return data.data; // ✅ retorna o cliente puro
        },
        enabled: !!id,
    });
};

/* =======================
 * FORMULÁRIO (DTO)
 * ======================= */
export const useClienteForm = (id?: number) => {
    return useQuery<ClienteFormData, AxiosError>({
        queryKey: ['clientes', id, 'form'],
        queryFn: async () => {
            const { data } = await api.get<ApiItem<Cliente>>(`/clientes/${id}`);

            const cliente = data.data;

            return {
                name: cliente.name,
                email: cliente.email ?? null,
                phone: cliente.phone ?? null,
                whatsapp: cliente.whatsapp ?? null,
                birth_date: cliente.birth_date ?? null,
                observation: cliente.observation ?? null,
            };
        },
        enabled: !!id,
    });
};

/* =======================
 * CREATE / UPDATE
 * ======================= */
export const useSaveCliente = () => {
    const queryClient = useQueryClient();

    return useMutation<
        Cliente,
        AxiosError,
        { id?: number; data: ClienteFormData }
    >({
        mutationFn: async ({ id, data }) => {
            const payload = {
                ...data,
            };

            if (id) {
                const res = await api.put(`/clientes/${id}`, payload);
                return res.data;
            }

            const res = await api.post('/clientes', payload);
            return res.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['clientes'] });

            if (variables.id) {
                queryClient.invalidateQueries({
                    queryKey: ['clientes', variables.id],
                });
            }
        },
    });
};

/* =======================
 * DELETE
 * ======================= */
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
