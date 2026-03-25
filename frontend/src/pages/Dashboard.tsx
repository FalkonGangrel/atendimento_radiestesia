// src/pages/Dashboard.tsx
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Calendar, Users, DollarSign, RotateCcw, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RetornoPrevisto {
  id: number
  cliente: string
  tipo: string
  data_retorno: string
  data_atendimento: string
}

interface DashboardStats {
  atendimentos_mes: number
  clientes_cadastrados: number
  saldo_mes: number
  retornos_concluidos: number
  retornos_previstos: RetornoPrevisto[]
}

function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/stats')
      return data
    },
  })
}

export default function Dashboard() {
  const { user } = useAuth()
  const { data, isLoading, isError } = useDashboardStats()

  const mesAtual = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Carregando dashboard...</div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Erro ao carregar o dashboard.</div>
      </div>
    )
  }

  const statCards = [
    {
      label: 'Atendimentos no mês',
      value: data.atendimentos_mes,
      icon: <Calendar className="w-5 h-5 text-indigo-500" />,
      color: 'bg-indigo-50',
    },
    {
      label: 'Clientes cadastrados',
      value: data.clientes_cadastrados,
      icon: <Users className="w-5 h-5 text-blue-500" />,
      color: 'bg-blue-50',
    },
    {
      label: 'Saldo do mês',
      value: formatCurrency(data.saldo_mes),
      icon: <DollarSign className="w-5 h-5 text-green-500" />,
      color: 'bg-green-50',
    },
    {
      label: 'Retornos concluídos',
      value: data.retornos_concluidos,
      icon: <RotateCcw className="w-5 h-5 text-purple-500" />,
      color: 'bg-purple-50',
    },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Olá, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1 capitalize">{mesAtual}</p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => (
          <Card key={card.label} className={`${card.color} border-0`}>
            <CardContent className="pt-6 pb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">{card.label}</span>
                {card.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Retornos previstos */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2 pb-3">
          <Clock className="w-5 h-5 text-orange-500" />
          <CardTitle className="text-lg">Retornos Previstos</CardTitle>
          {data.retornos_previstos.length > 0 && (
            <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
              {data.retornos_previstos.length}
            </span>
          )}
        </CardHeader>
        <CardContent>
          {data.retornos_previstos.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">
              Nenhum retorno previsto pendente.
            </p>
          ) : (
            <div className="space-y-2">
              {data.retornos_previstos.map(retorno => {
                const diasRestantes = Math.ceil(
                  (new Date(retorno.data_retorno).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
                )
                const urgente = diasRestantes <= 3

                return (
                  <div
                    key={retorno.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      urgente ? 'border-orange-200 bg-orange-50' : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{retorno.cliente}</p>
                      <p className="text-xs text-gray-500">{retorno.tipo}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${urgente ? 'text-orange-600' : 'text-gray-700'}`}>
                        {formatDate(retorno.data_retorno)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {diasRestantes === 0
                          ? 'Hoje'
                          : diasRestantes === 1
                          ? 'Amanhã'
                          : `em ${diasRestantes} dias`}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}