import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'

import { useTiposAtendimentoList, useDeleteTipoAtendimento } from '@/hooks/useTiposAtendimento'
import { formatCurrency } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

import { useAuth } from '@/contexts'
import { canManageTiposAtendimento } from '@/helpers/permissions'

export default function TiposAtendimento() {
  const navigate = useNavigate()
  const { user: authUser } = useAuth()

  const { data: tipos, isLoading, isError, error } =
    useTiposAtendimentoList()

  const deleteMutation = useDeleteTipoAtendimento()

  const podeGerenciar = canManageTiposAtendimento(authUser)

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja desativar este tipo de atendimento?')) {
      return
    }

    await deleteMutation.mutateAsync(id)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">
          Carregando tipos de atendimento...
        </div>
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

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Tipos de Atendimento
        </h1>

        {podeGerenciar && (
          <Button onClick={() => navigate('/master/tipos-atendimento/novo')}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Tipo
          </Button>
        )}
      </div>

      {tipos && tipos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tipos.map(tipo => (
            <Card
              key={tipo.id}
              className="shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-semibold">
                  {tipo.nome}
                </CardTitle>

                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tipo.ativo
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {tipo.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-gray-600 text-sm">
                  {tipo.descricao}
                </p>

                <div className="flex justify-between text-gray-700">
                  <p>
                    <strong>Valor:</strong>{' '}
                    {formatCurrency(tipo.valor)}
                  </p>
                  <p>
                    <strong>Duração:</strong>{' '}
                    {tipo.duracao_minutos} min
                  </p>
                </div>

                <div className="flex gap-2 mt-4 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      navigate(`/master/tipos-atendimento/${tipo.id}`)
                    }
                  >
                    <Eye className="w-4 h-4" />
                  </Button>

                  {podeGerenciar && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigate(
                            `/master/tipos-atendimento/${tipo.id}/editar`
                          )
                        }
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={
                          deleteMutation.isPending || !tipo.ativo
                        }
                        onClick={() => handleDelete(tipo.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">
              Nenhum tipo de atendimento cadastrado ainda.
            </p>

            {podeGerenciar && (
              <Button
                onClick={() =>
                  navigate('/master/tipos-atendimento/novo')
                }
              >
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
