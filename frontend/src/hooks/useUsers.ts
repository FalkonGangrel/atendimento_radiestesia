// src/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { usersQueryKeys } from '@/lib/queryKeys/users';
import type { User } from '@/types/entities/User';
import type { AxiosError } from 'axios';

/**
 * Lista todos os usuários
 */
export function useUsersList() {
  return useQuery<User[], AxiosError>({
    queryKey: usersQueryKeys.all,
    queryFn: async () => {
      const { data } = await api.get<User[]>('/users');
      return data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

/**
 * Atualiza um usuário
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation<
    User,
    AxiosError,
    Partial<User> & { id: number }
  >({
    mutationFn: async ({ id, ...payload }) => {
      const { data } = await api.put<User>(`/users/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.all,
      });
    },
  });
}

/**
 * Remove ou desativa um usuário
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, number>({
    mutationFn: async (userId) => {
      await api.delete(`/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.all,
      });
    },
  });
}
