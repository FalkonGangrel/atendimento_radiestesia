// src/hooks/useTiposAtendimento.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { TipoAtendimento, TipoAtendimentoFormData } from '@/types'
import type { AxiosError } from 'axios'

interface ApiCollection<T> {
  data: T[]
}

interface ApiItem<T> {
  data: T
}

// 🔹 LISTAGEM — página de gerenciamento (master only)
export const useTiposAtendimentoList = () => {
  return useQuery<TipoAtendimento[], AxiosError>({
    queryKey: ['tiposAtendimento'],
    queryFn: async () => {
      const { data } = await api.get<ApiCollection<TipoAtendimento>>('/tipos-atendimento')
      return data.data
    },
  })
}

// 🔹 LISTAGEM PARA SELECT (UI)
export const useTiposAtendimentoSelect = () => {
  const query = useTiposAtendimentoList()

  return {
    ...query,
    options:
      query.data?.map(tipo => ({
        value: tipo.id.toString(),
        label: tipo.nome,
      })) ?? [],
  }
}

// 🔹 DETALHE
export const useTipoAtendimento = (id: number | undefined) => {
  return useQuery<TipoAtendimento, AxiosError>({
    queryKey: ['tiposAtendimento', id],
    queryFn: async () => {
      const { data } = await api.get<ApiItem<TipoAtendimento>>(`/tipos-atendimento/${id}`)
      return data.data
    },
    enabled: !!id,
  })
}

// 🔹 FORMULÁRIO (edição)
export const useTipoAtendimentoForm = (id: number | undefined) => {
  return useQuery<TipoAtendimentoFormData, AxiosError>({
    queryKey: ['tiposAtendimento', id, 'form'],
    queryFn: async () => {
      const { data } = await api.get<ApiItem<TipoAtendimento>>(`/tipos-atendimento/${id}`)
      const tipo = data.data

      return {
        nome:            tipo.nome,
        slug:            tipo.slug,
        descricao:       tipo.descricao ?? '',
        valor:           tipo.valor?.toString() ?? '0',
        duracao_minutos: tipo.duracao_minutos?.toString() ?? '',
        ordem:           tipo.ordem?.toString() ?? '0',
        ativo:           tipo.ativo ?? true,
      }
    },
    enabled: !!id,
  })
}

// 🔹 CREATE / UPDATE
export const useSaveTipoAtendimento = () => {
  const queryClient = useQueryClient()

  return useMutation<TipoAtendimento, AxiosError, { id?: number; data: TipoAtendimentoFormData }>({
    mutationFn: async ({ id, data }) => {
      if (id) {
        const res = await api.put<ApiItem<TipoAtendimento>>(`/tipos-atendimento/${id}`, data)
        return res.data.data
      }
      const res = await api.post<ApiItem<TipoAtendimento>>('/tipos-atendimento', data)
      return res.data.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tiposAtendimento'] })
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ['tiposAtendimento', variables.id] })
      }
    },
  })
}

// 🔹 DELETE (soft-delete)
export const useDeleteTipoAtendimento = () => {
  const queryClient = useQueryClient()

  return useMutation<void, AxiosError, number>({
    mutationFn: async (id) => {
      await api.delete(`/tipos-atendimento/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tiposAtendimento'] })
    },
  })
}

// 🔹 RESTORE
export const useRestoreTipoAtendimento = () => {
  const queryClient = useQueryClient()

  return useMutation<TipoAtendimento, AxiosError, number>({
    mutationFn: async (id) => {
      const res = await api.post<ApiItem<TipoAtendimento>>(`/tipos-atendimento/${id}/restore`)
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tiposAtendimento'] })
    },
  })
}