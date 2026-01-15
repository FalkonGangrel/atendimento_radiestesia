// src/hooks/useAtendimentos.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { atendimentosQueryKeys } from '@/lib/queryKeys/atendimentos';
import { listModelsQueryKeys } from '@/lib/queryKeys/listModels';
import type { Atendimento } from '@/types/entities/Atendimento';
import type { ListModel } from '@/types/entities/ListModel';
import type { AxiosError } from 'axios';

/**
 * Lista todos os atendimentos do usuário logado
 */
export function useAtendimentos() {
  return useQuery<Atendimento[], AxiosError>({
    queryKey: atendimentosQueryKeys.all,
    queryFn: async () => {
      const { data } = await api.get<Atendimento[]>('/atendimentos');
      return data;
    },
    staleTime: 1000 * 60, // 1 minuto
  });
}

/**
 * Busca um atendimento específico pelo ID
 */
export function useAtendimento(id?: number) {
  return useQuery<Atendimento, AxiosError>({
    queryKey: id
      ? atendimentosQueryKeys.detail(id)
      : atendimentosQueryKeys.all, // fallback seguro
    queryFn: async () => {
      if (!id) {
        throw new Error('ID do atendimento não fornecido');
      }

      const { data } = await api.get<Atendimento>(
        `/atendimentos/${id}`
      );
      return data;
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60,
  });
}

/**
 * Lista todos os modelos de listas (master/admin)
 */
export function useListModels() {
  return useQuery<ListModel[], AxiosError>({
    queryKey: listModelsQueryKeys.all,
    queryFn: async () => {
      const { data } = await api.get<ListModel[]>('/lists');
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
