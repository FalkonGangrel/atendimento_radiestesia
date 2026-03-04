import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/'
import { api } from '@/lib/api'
import AtendimentoModal from '@/modules/atendimento/components/AtendimentoModal'
import type { Cliente } from '@/types'
import {
  ArrowLeft,
  Calendar,
  Edit,
  Mail,
  MessageCircle,
  Phone,
  Trash2,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function ClienteDetail() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { id } = useParams<{ id: string }>()

  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [atendimentos, setAtendimentos] = useState<any[]>([])
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [loadingAtendimentos, setLoadingAtendimentos] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [atendimentoModalOpen, setAtendimentoModalOpen] = useState(false)

  const fetchCliente = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get(`/clientes/${id}`)
      setCliente(response.data.data)
      setError(null)
    } catch {
      setError('Erro ao carregar cliente')
    } finally {
      setLoading(false)
    }
  }, [id])

  const fetchAtendimentos = useCallback(async () => {
    try {
      setLoadingAtendimentos(true)
      const response = await api.get(`/clientes/${id}/historico`)
      setAtendimentos(response.data.data)
    } catch {
      // silencioso — histórico vazio é estado válido
    } finally {
      setLoadingAtendimentos(false)
    }
  }, [id])

  useEffect(() => {
    fetchCliente()
    fetchAtendimentos()
  }, [fetchCliente, fetchAtendimentos])

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja desativar este cliente?')) return
    try {
      await api.delete(`/clientes/${id}`)
      navigate('/clientes')
    } catch {
      setError('Erro ao desativar cliente')
    }
  }

  // Ownership: atendente pode gerenciar apenas seus próprios clientes
  const canManage =
    user?.role === 'master' ||
    user?.role === 'admin' ||
    (cliente ? user?.id === cliente.created_by.id : false)

  function formatDateBR(date: string) {
    if (!date) return ''
    const [year, month, day] = date.split('-')
    return `${day}/${month}/${year}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Carregando cliente...</div>
      </div>
    )
  }

  if (!cliente) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Cliente não encontrado</div>
      </div>
    )
  }

  const isActive = !cliente.deleted_at

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/clientes')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{cliente.name}</h1>
              <p className="text-gray-600 mt-2">Detalhes do cliente</p>
            </div>

            {canManage && (
              <div className="flex gap-2">
                {isActive && (
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/clientes/${id}/editar`)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                )}

                {isActive && (
                  <Button variant="destructive" onClick={handleDelete}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Desativar
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cliente.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{cliente.email}</p>
                  </div>
                </div>
              )}
              {cliente.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Telefone</p>
                    <p className="font-medium">{cliente.phone}</p>
                  </div>
                </div>
              )}
              {cliente.whatsapp && (
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">WhatsApp</p>
                    <p className="font-medium">{cliente.whatsapp}</p>
                  </div>
                </div>
              )}
              {cliente.birth_date && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Data de Nascimento</p>
                    <p className="font-medium">{formatDateBR(cliente.birth_date)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {cliente.observation && (
            <Card>
              <CardHeader>
                <CardTitle>Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{cliente.observation}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Histórico de Atendimentos</CardTitle>
              {canManage && (
                <Button size="sm" onClick={() => setAtendimentoModalOpen(true)}>
                  Novo Atendimento
                </Button>
              )}
            </CardHeader>

            <CardContent>
              {loadingAtendimentos ? (
                <p className="text-gray-500 text-center py-6">Carregando atendimentos...</p>
              ) : atendimentos.length === 0 ? (
                <p className="text-gray-500 text-center py-6">Nenhum atendimento registrado</p>
              ) : (
                <div className="space-y-4">
                  {atendimentos.map(item => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 bg-gray-50 cursor-pointer"
                      onClick={() =>
                        setExpandedId(expandedId === item.id ? null : item.id)
                      }
                    >
                      <div className="flex justify-between items-center">
                        <span className="px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-700">
                          {item.tipo?.nome}
                        </span>
                        <div className="text-sm text-gray-500">
                          Atendido em: {formatDateBR(item.data_atendimento)}
                        </div>
                      </div>
                      {item.data_retorno && (
                        <div className="text-xs text-gray-500 mt-1">
                          Retorno: {formatDateBR(item.data_retorno)}
                        </div>
                      )}
                      {expandedId === item.id && item.observacao && (
                        <p className="mt-3 text-sm text-gray-700 whitespace-pre-wrap">
                          {item.observacao}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de novo atendimento */}
      {atendimentoModalOpen && (
        <AtendimentoModal
          clienteId={Number(id)}
          open={atendimentoModalOpen}
          onClose={() => {
            setAtendimentoModalOpen(false)
            fetchAtendimentos() // recarrega o histórico após fechar
          }}
        />
      )}
    </div>
  )
}