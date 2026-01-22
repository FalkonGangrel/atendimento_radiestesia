// src/hooks/usePermissions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { permissionsQueryKeys } from '@/lib/queryKeys/permissions';
import type { UserPermissionsDTO } from '@/types/dtos/UserPermissionsDTO';
import type { SavePermissionsPayload } from '@/types/payloads/SavePermissionsPayload';
import type { AxiosError } from 'axios';

export function useUserPermissionsForTipo(
  userId?: number,
  tipoId?: number
) {
  const query = useQuery<UserPermissionsDTO, AxiosError>({
    queryKey: permissionsQueryKeys.userTipo(userId!, tipoId!),
    enabled: Boolean(userId && tipoId),
    staleTime: 1000 * 60,

    queryFn: async () => {
      const { data } = await api.get<UserPermissionsDTO>(
        `/master/tipos-atendimento/${tipoId}/users/${userId}/permissions`
      );
      return data;
    },
  });

  return {
    ...query,

    // ✅ Estado derivado (pronto para UI)
    hasPermission: query.data?.has_permission ?? false,
    availableFields: query.data?.available_fields ?? [],
    availableListModels: query.data?.available_list_models ?? [],

    selectedFieldIds: query.data?.selected_field_ids ?? [],
    selectedListModelIds: query.data?.selected_list_model_ids ?? [],
    selectedListItemIds: query.data?.selected_list_item_ids ?? [],
  };
}

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
