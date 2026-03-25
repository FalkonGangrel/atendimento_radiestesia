// src/pages/DashboardMaster.tsx
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import {
  Users, Calendar, DollarSign, RotateCcw,
  TrendingUp, UserCheck, UserX,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AtendenteStat {
  id: number
  name: string
  atendimentos_mes: number
  atendimentos_total: number
  total_clientes: number
}

interface TipoStat {
  id: number
  nome: string
  atendimentos_mes: number
}

interface MasterStats {
  usuarios_por_role: Record<string, number>
  total_usuarios: number
  atendimentos_mes: number
  saldo_mes: number
  retornos_pendentes: number
  atendimentos_por_atendente: AtendenteStat[]
  atendimentos_por_tipo: TipoStat[]
  extras: Record<string, unknown>
}

function useMasterStats() {
  return useQuery<MasterStats>({
    queryKey: ['master-stats'],
    queryFn: async () => {
      const { data } = await api.get('/master/stats')
      return data
    },
  })
}

export default function DashboardMaster() {
  const { data, isLoading, isError } = useMasterStats()

  const mesAtual = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Carregando...</div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Erro ao carregar o dashboard master.</div>
      </div>
    )
  }

  const summaryCards = [
    {
      label: 'Total de usuários',
      value: data.total_usuarios,
      icon: <Users className="w-5 h-5 text-indigo-500" />,
      color: 'bg-indigo-50',
      sub: Object.entries(data.usuarios_por_role)
        .map(([role, total]) => `${total} ${role}`)
        .join(' · '),
    },
    {
      label: 'Atendimentos no mês',
      value: data.atendimentos_mes,
      icon: <Calendar className="w-5 h-5 text-blue-500" />,
      color: 'bg-blue-50',
      sub: null,
    },
    {
      label: 'Saldo do mês',
      value: formatCurrency(data.saldo_mes),
      icon: <DollarSign className="w-5 h-5 text-green-500" />,
      color: 'bg-green-50',
      sub: null,
    },
    {
      label: 'Retornos pendentes',
      value: data.retornos_pendentes,
      icon: <RotateCcw className="w-5 h-5 text-orange-500" />,
      color: 'bg-orange-50',
      sub: null,
    },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Master</h1>
        <p className="text-gray-500 mt-1 capitalize">{mesAtual}</p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(card => (
          <Card key={card.label} className={`${card.color} border-0`}>
            <CardContent className="pt-6 pb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">{card.label}</span>
                {card.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              {card.sub && (
                <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atendimentos por atendente */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-3">
            <UserCheck className="w-5 h-5 text-indigo-500" />
            <CardTitle className="text-lg">Atendimentos por Atendente</CardTitle>
          </CardHeader>
          <CardContent>
            {data.atendimentos_por_atendente.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">Nenhum atendente cadastrado.</p>
            ) : (
              <div className="space-y-3">
                {data.atendimentos_por_atendente
                  .sort((a, b) => b.atendimentos_mes - a.atendimentos_mes)
                  .map(atendente => {
                    const max = Math.max(...data.atendimentos_por_atendente.map(a => a.atendimentos_mes), 1)
                    const pct = Math.round((atendente.atendimentos_mes / max) * 100)

                    return (
                      <div key={atendente.id}>
                        <div className="flex justify-between items-center mb-1">
                          <div>
                            <span className="text-sm font-medium text-gray-800">{atendente.name}</span>
                            <span className="text-xs text-gray-400 ml-2">
                              {atendente.total_clientes} cliente{atendente.total_clientes !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-indigo-600">{atendente.atendimentos_mes}</span>
                            <span className="text-xs text-gray-400 ml-1">/ mês</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-indigo-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Atendimentos por tipo */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-3">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <CardTitle className="text-lg">Atendimentos por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            {data.atendimentos_por_tipo.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">Nenhum atendimento no mês.</p>
            ) : (
              <div className="space-y-3">
                {data.atendimentos_por_tipo
                  .filter(t => t.atendimentos_mes > 0)
                  .sort((a, b) => b.atendimentos_mes - a.atendimentos_mes)
                  .map(tipo => {
                    const max = Math.max(...data.atendimentos_por_tipo.map(t => t.atendimentos_mes), 1)
                    const pct = Math.round((tipo.atendimentos_mes / max) * 100)

                    return (
                      <div key={tipo.id}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-800">{tipo.nome}</span>
                          <span className="text-sm font-bold text-purple-600">{tipo.atendimentos_mes}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-purple-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Usuários por role — breakdown visual */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2 pb-3">
          <UserX className="w-5 h-5 text-gray-500" />
          <CardTitle className="text-lg">Composição de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6 flex-wrap">
            {Object.entries(data.usuarios_por_role).map(([role, total]) => (
              <div key={role} className="text-center">
                <p className="text-3xl font-bold text-gray-900">{total}</p>
                <p className="text-sm text-gray-500 capitalize mt-1">{role}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}