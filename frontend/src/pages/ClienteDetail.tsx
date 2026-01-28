import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/'
import { Permissions } from '@/constants/permissions'
import type { Cliente } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Mail,
  Phone,
  MessageCircle
} from 'lucide-react'

export default function ClienteDetail() {
  const navigate = useNavigate()
  const { hasPermission } = useAuth()
  const { id } = useParams<{ id: string }>()

  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Busca o cliente
   * useCallback evita warning do useEffect
   */
  const fetchCliente = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get(`/clientes/${id}`)
      setCliente(response.data.data)
      setError(null)
    } catch (err) {
      console.error(err)
      setError('Erro ao carregar cliente')
    } finally {
      setLoading(false)
    }
  }, [id])

  /**
   * Effect correto (sem warning)
   */
  useEffect(() => {
    fetchCliente()
  }, [fetchCliente])

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja desativar este cliente?')) return

    try {
      await api.delete(`/clientes/${id}`)
      navigate('/clientes')
    } catch (err) {
      console.error(err)
      setError('Erro ao desativar cliente')
    }
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/clientes')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {cliente.name}
              </h1>
              <p className="text-gray-600 mt-2">Detalhes do cliente</p>
            </div>

            <div className="flex gap-2">
              {hasPermission(Permissions.CLIENTES_UPDATE) && (
                <Button
                  variant="outline"
                  onClick={() => navigate(`/clientes/${id}/editar`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              )}

              {hasPermission(Permissions.CLIENTES_DELETE) && (
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Desativar
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Informações */}
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

              {cliente.telefone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Telefone</p>
                    <p className="font-medium">{cliente.telefone}</p>
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
                    <p className="text-sm text-gray-600">
                      Data de Nascimento
                    </p>
                    <p className="font-medium">
                      {new Date(cliente.birth_date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {cliente.observacoes && (
            <Card>
              <CardHeader>
                <CardTitle>Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {cliente.observacoes}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Histórico de Atendimentos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">
                Em breve: histórico de atendimentos deste cliente
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
