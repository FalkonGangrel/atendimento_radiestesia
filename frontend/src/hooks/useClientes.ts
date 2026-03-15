// src/hooks/useClientes.ts
import { api } from '@/lib/api'
import type { Cliente, ClienteFormData } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

interface ApiCollection<T> {
  data: T[]
}

interface ApiItem<T> {
  data: T
}

// 🔹 LISTAGEM — suporta filtro: 'all' | 'active' | 'inactive'
export const useClientesList = (filter: 'all' | 'active' | 'inactive' = 'all') => {
  return useQuery<Cliente[], AxiosError>({
    queryKey: ['clientes', filter],
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (filter === 'active')   params.active = 'true'
      if (filter === 'inactive') params.active = 'false'

      const { data } = await api.get<ApiCollection<Cliente>>('/clientes', { params })
      return data.data
    },
  })
}

// 🔹 DETALHE
export const useCliente = (id?: number) => {
  return useQuery<Cliente, AxiosError>({
    queryKey: ['clientes', id],
    queryFn: async () => {
      const { data } = await api.get<ApiItem<Cliente>>(`/clientes/${id}`)
      return data.data
    },
    enabled: !!id,
  })
}

// 🔹 HISTÓRICO
export const useClienteHistorico = (clienteId?: number, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['cliente-historico', clienteId],
    queryFn: async () => {
      const { data } = await api.get(`/clientes/${clienteId}/historico`)
      return data.data
    },
    enabled: enabled && !!clienteId,
  })
}

// 🔹 FORMULÁRIO (edição)
export const useClienteForm = (id?: number) => {
  return useQuery<ClienteFormData, AxiosError>({
    queryKey: ['clientes', id, 'form'],
    queryFn: async () => {
      const { data } = await api.get<ApiItem<Cliente>>(`/clientes/${id}`)
      const cliente = data.data

      return {
        name:        cliente.name,
        email:       cliente.email ?? null,
        phone:       cliente.phone ?? null,
        whatsapp:    cliente.whatsapp ?? null,
        birth_date:  cliente.birth_date ?? null,
        observation: cliente.observation ?? null,
      }
    },
    enabled: !!id,
  })
}

// 🔹 CREATE / UPDATE
export const useSaveCliente = () => {
  const queryClient = useQueryClient()

  return useMutation<Cliente, AxiosError, { id?: number; data: ClienteFormData }>({
    mutationFn: async ({ id, data }) => {
      if (id) {
        const res = await api.put(`/clientes/${id}`, data)
        return res.data
      }
      const res = await api.post('/clientes', data)
      return res.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ['clientes', variables.id] })
      }
    },
  })
}

// 🔹 DELETE (soft-delete)
export const useDeleteCliente = () => {
  const queryClient = useQueryClient()

  return useMutation<void, AxiosError, number>({
    mutationFn: async (id) => {
      await api.delete(`/clientes/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
    },
  })
}

// 🔹 RESTORE
export const useRestoreCliente = () => {
  const queryClient = useQueryClient()

  return useMutation<Cliente, AxiosError, number>({
    mutationFn: async (id) => {
      const res = await api.post<ApiItem<Cliente>>(`/clientes/${id}/restore`)
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
    },
  })
}