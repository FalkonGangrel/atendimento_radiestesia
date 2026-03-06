import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, RotateCcw } from 'lucide-react'
import { useState } from 'react'

import {
  useTiposAtendimentoList,
  useDeleteTipoAtendimento,
  useRestoreTipoAtendimento,
} from '@/hooks/useTiposAtendimento'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts'
import { canManageTiposAtendimento } from '@/helpers/permissions'

export default function TiposAtendimento() {
  const navigate = useNavigate()
  const { user: authUser } = useAuth()

  const { data: tipos, isLoading, isError, error } = useTiposAtendimentoList()
  const deleteMutation  = useDeleteTipoAtendimento()
  const restoreMutation = useRestoreTipoAtendimento()

  const [actionError, setActionError] = useState<string | null>(null)

  const podeGerenciar = canManageTiposAtendimento(authUser)

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja desativar este tipo de atendimento?')) return
    setActionError(null)
    try {
      await deleteMutation.mutateAsync(id)
    } catch {
      setActionError('Erro ao desativar tipo de atendimento.')
    }
  }

  const handleRestore = async (id: number) => {
    if (!confirm('Reativar este tipo de atendimento?')) return
    setActionError(null)
    try {
      await restoreMutation.mutateAsync(id)
    } catch {
      setActionError('Erro ao reativar tipo de atendimento.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Carregando tipos de atendimento...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        Erro ao carregar tipos de atendimento: {error?.message}
      </div>
    )
  }

  const isPending = deleteMutation.isPending || restoreMutation.isPending

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Tipos de Atendimento</h1>

        {podeGerenciar && (
          <Button onClick={() => navigate('/master/tipos-atendimento/novo')}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Tipo
          </Button>
        )}
      </div>

      {actionError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {actionError}
        </div>
      )}

      {tipos && tipos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tipos.map(tipo => {
            const isRemoved = !!tipo.deleted_at   // soft-deleted
            const isInativo = !tipo.ativo         // ativo=false mas não removido

            return (
              <Card
                key={tipo.id}
                className={`shadow-lg transition-shadow ${
                  isRemoved ? 'opacity-50 border-dashed border-gray-300' : 'hover:shadow-xl'
                }`}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-semibold">{tipo.nome}</CardTitle>

                  {/* Badge de status — só um por vez */}
                  {isRemoved ? (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                      Removido
                    </span>
                  ) : isInativo ? (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Inativo
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Ativo
                    </span>
                  )}
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-gray-600 text-sm">{tipo.descricao}</p>

                  <div className="flex justify-between text-gray-700">
                    <p><strong>Valor:</strong> {formatCurrency(tipo.valor)}</p>
                    <p><strong>Duração:</strong> {tipo.duracao_minutos} min</p>
                  </div>

                  {podeGerenciar && (
                    <div className="flex gap-2 mt-4 justify-end">
                      {/* Editar — apenas se não removido */}
                      {!isRemoved && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isPending}
                          onClick={() => navigate(`/master/tipos-atendimento/${tipo.id}/editar`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Reativar — se removido (soft-delete) */}
                      {isRemoved ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isPending}
                          onClick={() => handleRestore(tipo.id)}
                          title="Reativar"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      ) : (
                        /* Desativar — se ativo */
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={isPending}
                          onClick={() => handleDelete(tipo.id)}
                          title="Desativar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
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
            <p className="text-gray-500 mb-4">Nenhum tipo de atendimento cadastrado ainda.</p>
            {podeGerenciar && (
              <Button onClick={() => navigate('/master/tipos-atendimento/novo')}>
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Primeiro Tipo
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}