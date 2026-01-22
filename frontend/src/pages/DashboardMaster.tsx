import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api'

type MasterStats = {
  total_users: number
  total_atendimentos: number
  total_lists: number
  total_list_items: number
}

export default function DashboardMaster() {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery<MasterStats, AxiosError>({
    queryKey: ['master-stats'],
    queryFn: async (): Promise<MasterStats> => {
      const { data } = await api.get('/master/stats')
      return data
    },
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Carregando estatísticas master...
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Erro ao carregar o dashboard master
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Master</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded shadow p-6">
          <p className="text-sm text-gray-500">Usuários</p>
          <p className="text-2xl font-semibold">{stats?.total_users}</p>
        </div>

        <div className="bg-white rounded shadow p-6">
          <p className="text-sm text-gray-500">Atendimentos</p>
          <p className="text-2xl font-semibold">
            {stats?.total_atendimentos}
          </p>
        </div>

        <div className="bg-white rounded shadow p-6">
          <p className="text-sm text-gray-500">Listas</p>
          <p className="text-2xl font-semibold">{stats?.total_lists}</p>
        </div>

        <div className="bg-white rounded shadow p-6">
          <p className="text-sm text-gray-500">Itens de Lista</p>
          <p className="text-2xl font-semibold">
            {stats?.total_list_items}
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <Link
          to="/usuarios"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Gerenciar Usuários
        </Link>

        <Link
          to="/listas"
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Gerenciar Listas
        </Link>
      </div>
    </div>
  )
}
