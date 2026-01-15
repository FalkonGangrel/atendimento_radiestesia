// src/hooks/useTiposAtendimento.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { TipoAtendimento, TipoAtendimentoFormData } from '@/types';
import { AxiosError } from 'axios';

// 🔹 LISTAGEM
export const useTiposAtendimentoList = () => {
    return useQuery<TipoAtendimento[], AxiosError>({
        queryKey: ['tiposAtendimento'],
        queryFn: async () => {
            const { data } = await api.get('/tipos-atendimento');
            return data;
        },
    });
};

// 🔹 DETALHE (RAW)
export const useTipoAtendimento = (id: number | undefined) => {
    return useQuery<TipoAtendimento, AxiosError>({
        queryKey: ['tiposAtendimento', id],
        queryFn: async () => {
            const { data } = await api.get(`/tipos-atendimento/${id}`);
            return data;
        },
        enabled: !!id,
    });
};

// 🔹 FORMULÁRIO
export const useTipoAtendimentoForm = (id: number | undefined) => {
    return useQuery<TipoAtendimentoFormData, AxiosError>({
        queryKey: ['tiposAtendimento', id],
        queryFn: async () => {
            const { data } = await api.get(`/tipos-atendimento/${id}`);

            return {
                nome: data.nome,
                slug: data.slug,
                valor: data.valor,
                duracao_minutos: data.duracao_minutos,
                ordem: data.ordem,
                ativo: data.ativo,
                descricao: data.descricao ?? '',
            };
        },
        enabled: !!id,
    });
};

// 🔹 CREATE / UPDATE
export const useSaveTipoAtendimento = () => {
    const queryClient = useQueryClient();

    return useMutation<TipoAtendimento, AxiosError, { id?: number; data: TipoAtendimentoFormData }>({
        mutationFn: async ({ id, data }) => {
            if (id) {
                const res = await api.put(`/tipos-atendimento/${id}`, data);
                return res.data;
            }
            const res = await api.post('/tipos-atendimento', data);
            return res.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tiposAtendimento'] });

            if (variables.id) {
                queryClient.invalidateQueries({ queryKey: ['tiposAtendimento', variables.id] });
            }
        },
    });
};

// 🔹 DELETE
export const useDeleteTipoAtendimento = () => {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError, number>({
        mutationFn: async (id) => {
            await api.delete(`/tipos-atendimento/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tiposAtendimento'] });
        },
    });
};
