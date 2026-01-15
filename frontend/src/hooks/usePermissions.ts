// src/hooks/usePermissions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { permissionsQueryKeys } from '@/lib/queryKeys/permissions';
import type { UserPermissionsDTO } from '@/types/dtos/UserPermissionsDTO';
import type { SavePermissionsPayload } from '@/types/payloads/SavePermissionsPayload';
import type { AxiosError } from 'axios';

/**
 * Busca as permissões de um usuário para um tipo de atendimento
 */
export function useUserPermissionsForTipo(
  userId?: number,
  tipoId?: number
) {
  return useQuery<UserPermissionsDTO, AxiosError>({
    queryKey:
      userId && tipoId
        ? permissionsQueryKeys.userTipo(userId, tipoId)
        : permissionsQueryKeys.all,

    queryFn: async () => {
      if (!userId || !tipoId) {
        throw new Error('User ID e Tipo ID são obrigatórios');
      }

      const { data } = await api.get<UserPermissionsDTO>(
        `/master/tipos-atendimento/${tipoId}/users/${userId}/permissions`
      );

      return data;
    },

    enabled: Boolean(userId && tipoId),
    staleTime: 1000 * 60, // 1 minuto
  });
}

/**
 * Salva as permissões de um usuário para um tipo de atendimento
 */
export function useSaveUserPermissions() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError,
    { userId: number; tipoId: number; payload: SavePermissionsPayload }
  >({
    mutationFn: async ({ userId, tipoId, payload }) => {
      await api.post(
        `/master/tipos-atendimento/${tipoId}/users/${userId}/permissions`,
        payload
      );
    },

    onSuccess: (_, { userId, tipoId }) => {
      queryClient.invalidateQueries({
        queryKey: permissionsQueryKeys.userTipo(userId, tipoId),
      });
    },
  });
}
