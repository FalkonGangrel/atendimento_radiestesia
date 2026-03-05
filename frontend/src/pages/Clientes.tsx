import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Permissions } from '@/constants/permissions'
import { useAuth } from '@/contexts'
import { useClientesList } from '@/hooks/useClientes'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import AtendimentoModal from '@/modules/atendimento/components/AtendimentoModal'
import { Edit, Eye, MessageSquare, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Clientes() {
  const navigate = useNavigate()
  const { user, hasPermission } = useAuth()
  const { data: clientes, isLoading, isError, error, refetch } = useClientesList()
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [clienteHistoricoId, setClienteHistoricoId] = useState<number | null>(null)

  const isSuperUser = user?.role === 'master' || user?.role === 'admin'

  // master/admin: pode ver detalhes e editar qualquer cliente
  // created_by.id é o user_id do dono
  const canManage = (clienteUserId: number) =>
    isSuperUser || user?.id === clienteUserId

  // só o dono pode incluir atendimentos
  const canAddAtendimento = (clienteUserId: number) =>
    user?.id === clienteUserId

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja desativar este cliente?')) return
    setDeleteError(null)
    try {
      await api.delete(`/clientes/${id}`)
      refetch()
    } catch {
      setDeleteError('Erro ao desativar cliente')
    }
  }

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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
            <p className="text-gray-600 mt-2">Gerencie seus clientes aqui.</p>
          </div>
          {/* Todo autenticado pode cadastrar clientes */}
          <Button onClick={() => navigate('/clientes/novo')}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </div>

        {deleteError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {deleteError}
          </div>
        )}

        {clientes && clientes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientes.map(cliente => {
              const isActive = !cliente.deleted_at
              const owned = canManage(cliente.created_by.id)
              const canEdit = owned && isActive
              const canDelete = owned && isActive
              const canAtendimento = canAddAtendimento(cliente.created_by.id)

              return (
                <Card
                  key={cliente.id}
                  className={`transition-all ${!isActive ? 'opacity-60 border-dashed border-gray-300' : ''}`}
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-semibold flex flex-col">
                      <span className="text-gray-900">{cliente.name}</span>
                      {!isActive && (
                        <span className="text-xs text-red-500 mt-1">Inativo</span>
                      )}
                    </CardTitle>

                    <div className="flex gap-2">
                      {/* Ver detalhes: master/admin ou dono */}
                      {owned && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/clientes/${cliente.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Editar: dono ou master/admin, apenas ativo */}
                      {canEdit && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/clientes/${cliente.id}/editar`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Desativar: dono ou master/admin, apenas ativo */}
                      {canDelete && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(cliente.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Atendimento: apenas o dono */}
                      {canAtendimento && (
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

                    {/* Cadastrado por: apenas master/admin */}
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
              <p className="text-gray-500 mb-4">Nenhum cliente cadastrado ainda.</p>
              <Button onClick={() => navigate('/clientes/novo')}>
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Primeiro Cliente
              </Button>
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