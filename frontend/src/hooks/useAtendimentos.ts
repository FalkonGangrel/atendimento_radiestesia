import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Atendimento, List } from '@/types';

// Hook para listar todos os atendimentos do usuário
export function useAtendimentos() {
    return useQuery<Atendimento[]>({
        queryKey: ['atendimentos'],
        queryFn: async () => {
        const { data } = await api.get('/atendimentos');
        return data;
        },
    });
}

// Hook para buscar UM atendimento específico
export function useAtendimento(id?: number) {
    return useQuery<Atendimento>({
        queryKey: ['atendimento', id],
        queryFn: async () => {
        if (!id) throw new Error('ID não fornecido');
        const { data } = await api.get(`/atendimentos/${id}`);
        return data;
        },
        enabled: !!id, // Só executa se o ID existir
    });
}

// Hook para listar todas as listas (master)
export function useLists() {
    return useQuery<List[]>({
        queryKey: ['lists'],
        queryFn: async () => {
        const { data } = await api.get('/lists');
        return data;
        },
    });
}
