// src/hooks/useCamposConfiguraveis.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { api } from '@/lib/api';
import { fieldSectionsQueryKeys } from '@/lib/queryKeys/fieldSections';
import type { FieldSection } from '@/types/entities/FieldSection';
import type { CustomField } from '@/types/entities/CustomField';
import type { CreateFieldSectionDTO } from '@/types/dtos/fields/CreateFieldSectionDTO';
import type { CreateCustomFieldDTO } from '@/types/dtos/fields/CreateCustomFieldDTO';
import type { AxiosError } from 'axios';

/**
 * Busca todas as seções de campos com seus campos aninhados
 */
export function useFieldSections() {
  return useQuery<FieldSection[], AxiosError>({
    queryKey: fieldSectionsQueryKeys.all,
    queryFn: async () => {
      const { data } = await api.get('/field-sections');
      return data;
    },
  });
}


/**
 * Cria uma nova seção de campos
 */
export function useCreateFieldSection(
  options?: UseMutationOptions<FieldSection, AxiosError, CreateFieldSectionDTO>
) {
  const queryClient = useQueryClient();

  return useMutation<FieldSection, AxiosError, CreateFieldSectionDTO>({
    mutationFn: async (payload) => {
      const { data } = await api.post<FieldSection>(
        '/field-sections',
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: fieldSectionsQueryKeys.all,
      });
    },
    ...options,
  });
}

/**
 * Remove uma seção de campos
 */
export function useDeleteFieldSection(
  options?: UseMutationOptions<void, AxiosError, number>
) {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, number>({
    mutationFn: async (sectionId) => {
      await api.delete(`/field-sections/${sectionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: fieldSectionsQueryKeys.all,
      });
    },
    ...options,
  });
}

/**
 * Cria um novo campo configurável
 */
export function useCreateCustomField(
  options?: UseMutationOptions<CustomField, AxiosError, CreateCustomFieldDTO>
) {
  const queryClient = useQueryClient();

  return useMutation<CustomField, AxiosError, CreateCustomFieldDTO>({
    mutationFn: async (payload) => {
      const { data } = await api.post<CustomField>(
        '/custom-fields',
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: fieldSectionsQueryKeys.all,
      });
    },
    ...options,
  });
}

/**
 * Remove um campo configurável
 */
export function useDeleteCustomField(
  options?: UseMutationOptions<void, AxiosError, number>
) {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, number>({
    mutationFn: async (fieldId) => {
      await api.delete(`/custom-fields/${fieldId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: fieldSectionsQueryKeys.all,
      });
    },
    ...options,
  });
}
