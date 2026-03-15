import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Permissions } from '@/constants/permissions'
import { useAuth } from '@/contexts'
import { useClientesList, useDeleteCliente, useRestoreCliente } from '@/hooks/useClientes'
import { formatDate } from '@/lib/utils'
import AtendimentoModal from '@/modules/atendimento/components/AtendimentoModal'
import { Edit, MessageSquare, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type FilterStatus = 'all' | 'active' | 'inactive'

export default function Clientes() {
  const navigate = useNavigate()
  const { user, hasPermission } = useAuth()
  const [filter, setFilter]                     = useState<FilterStatus>('active')
  const [actionError, setActionError]           = useState<string | null>(null)
  const [clienteHistoricoId, setClienteHistoricoId] = useState<number | null>(null)

  const { data: clientes, isLoading, isError, error } = useClientesList(filter)
  const deleteMutation  = useDeleteCliente()
  const restoreMutation = useRestoreCliente()

  const isSuperUser = user?.role === 'master' || user?.role === 'admin'

  const canManage        = (clienteUserId: number) => isSuperUser || user?.id === clienteUserId
  const canAddAtendimento = (clienteUserId: number) => user?.id === clienteUserId

  const handleDelete = async (id: number) => {
    if (!confirm('Desativar este cliente?')) return
    setActionError(null)
    try {
      await deleteMutation.mutateAsync(id)
    } catch {
      setActionError('Erro ao desativar cliente.')
    }
  }

  const handleRestore = async (id: number) => {
    if (!confirm('Reativar este cliente?')) return
    setActionError(null)
    try {
      await restoreMutation.mutateAsync(id)
    } catch {
      setActionError('Erro ao reativar cliente.')
    }
  }

  const isPending = deleteMutation.isPending || restoreMutation.isPending

  const filterTabs: { label: string; value: FilterStatus }[] = [
    { label: 'Todos',    value: 'all'      },
    { label: 'Ativos',   value: 'active'   },
    { label: 'Inativos', value: 'inactive' },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Carregando clientes...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Erro ao carregar clientes: {error?.message}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
            <p className="text-gray-600 mt-1">Gerencie seus clientes aqui.</p>
          </div>
          <Button onClick={() => navigate('/clientes/novo')}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </div>

        {/* Tabs de filtro */}
        <div className="flex gap-2 mb-6">
          {filterTabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === tab.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {actionError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {actionError}
          </div>
        )}

        {/* Lista */}
        {clientes && clientes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientes.map(cliente => {
              const isDeleted = !!cliente.deleted_at
              const owned      = canManage(cliente.created_by.id)
              const canAtendimento = canAddAtendimento(cliente.created_by.id)

              return (
                <Card
                  key={cliente.id}
                  className={`transition-all ${
                    isDeleted ? 'opacity-50 border-dashed border-gray-300' : ''
                  }`}
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-semibold flex flex-col">
                      <span className="text-gray-900">{cliente.name}</span>
                      {isDeleted && (
                        <span className="text-xs text-red-500 mt-1">Inativo</span>
                      )}
                    </CardTitle>

                    <div className="flex gap-2">
                      {owned && !isDeleted && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isPending}
                          onClick={() => navigate(`/clientes/${cliente.id}/editar`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Reativar — apenas inativos */}
                      {owned && isDeleted && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isPending}
                          title="Reativar cliente"
                          onClick={() => handleRestore(cliente.id)}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Desativar — apenas ativos */}
                      {owned && !isDeleted && (
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={isPending}
                          onClick={() => handleDelete(cliente.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Atendimento — apenas dono e ativo */}
                      {canAtendimento && !isDeleted && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setClienteHistoricoId(cliente.id)}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-1">
                    {cliente.email && (
                      <p className="text-sm text-gray-600">{cliente.email}</p>
                    )}
                    {cliente.phone && (
                      <p className="text-sm text-gray-600">{cliente.phone}</p>
                    )}

                    {cliente.ultimo_atendimento && (
                      <div className="pt-2 mt-2 border-t">
                        <p className="text-xs text-gray-500">Último Atendimento:</p>
                        <p className="text-sm font-medium text-gray-700">
                          {formatDate(cliente.ultimo_atendimento)}
                        </p>
                        {cliente.data_retorno && (
                          <p className="text-xs text-blue-600">
                            Retorno: {formatDate(cliente.data_retorno)}
                          </p>
                        )}
                        {cliente.observacao_resumo && (
                          <p className="text-xs text-gray-500 italic">
                            {cliente.observacao_resumo}
                          </p>
                        )}
                      </div>
                    )}

                    {hasPermission(Permissions.CLIENTES_VIEW_OWNER) && cliente.created_by && (
                      <div className="pt-2 mt-2 border-t">
                        <p className="text-xs text-gray-500">Cadastrado por:</p>
                        <p className="text-sm font-medium text-gray-700">
                          {cliente.created_by.name}
                        </p>
                        <p className="text-xs text-gray-500">{cliente.created_by.email}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 mb-4">
                {filter === 'inactive'
                  ? 'Nenhum cliente inativo.'
                  : 'Nenhum cliente cadastrado ainda.'}
              </p>
              {filter !== 'inactive' && (
                <Button onClick={() => navigate('/clientes/novo')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar Primeiro Cliente
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {clienteHistoricoId && (
        <AtendimentoModal
          clienteId={clienteHistoricoId}
          open={!!clienteHistoricoId}
          onClose={() => setClienteHistoricoId(null)}
        />
      )}
    </div>
  )
}