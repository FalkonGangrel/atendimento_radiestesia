import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useClienteForm, useSaveCliente } from '@/hooks/useClientes'
import type { ClienteFormData } from '@/types'
import { AxiosError } from 'axios'
import { ArrowLeft } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// Clientes são de ownership — não há permissão granular por tipo.
// Todo usuário autenticado pode criar/editar seus próprios clientes.
// O backend protege via ClientePolicy + authorizeResource().

export default function ClienteForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)

  const {
    data: clienteData,
    isLoading: isLoadingCliente,
    isError: isErrorCliente,
    error: clienteError,
  } = useClienteForm(id ? Number(id) : undefined)

  const saveCliente = useSaveCliente()

  const [isSaving, setIsSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [formData, setFormData] = useState<ClienteFormData>({
    name: '',
    email: null,
    phone: null,
    whatsapp: null,
    birth_date: null,
    observation: null,
  })

  useEffect(() => {
    if (isEditing && clienteData) {
      setFormData({
        name: clienteData.name,
        email: clienteData.email ?? null,
        phone: clienteData.phone ?? null,
        whatsapp: clienteData.whatsapp ?? null,
        birth_date: clienteData.birth_date ?? null,
        observation: clienteData.observation ?? null,
      })
    }
  }, [isEditing, clienteData])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value === '' ? null : value,
      }))
    },
    [],
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!formData.name.trim()) {
      setSubmitError('O nome do cliente é obrigatório.')
      return
    }

    try {
      setIsSaving(true)
      await saveCliente.mutateAsync({
        id: isEditing ? Number(id) : undefined,
        data: formData,
      })
      navigate('/clientes', { replace: true })
    } catch (err) {
      if (err instanceof AxiosError) {
        setSubmitError(err.response?.data?.message || 'Erro ao salvar cliente.')
      } else {
        setSubmitError('Erro ao salvar cliente.')
      }
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoadingCliente && isEditing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Carregando cliente para edição...</div>
      </div>
    )
  }

  if (isErrorCliente && isEditing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">
          Erro ao carregar cliente: {clienteError?.message || 'Desconhecido'}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/clientes')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? `Editar Cliente: ${clienteData?.name}` : 'Novo Cliente'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditing
              ? 'Atualize as informações do cliente.'
              : 'Preencha os dados para cadastrar um novo cliente.'}
          </p>
        </div>

        {submitError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="name">
                  Nome <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nome completo do cliente"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  placeholder="exemplo@email.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="phone">
                    Telefone
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="whatsapp">
                    WhatsApp
                  </label>
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp || ''}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="birth_date">
                  Data de Nascimento
                </label>
                <Input
                  id="birth_date"
                  name="birth_date"
                  type="date"
                  value={formData.birth_date || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="observation">
                  Observações
                </label>
                <Textarea
                  id="observation"
                  name="observation"
                  className="w-full min-h-[100px]"
                  value={formData.observation || ''}
                  onChange={handleInputChange}
                  placeholder="Informações adicionais sobre o cliente..."
                />
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex gap-4">
            <Button type="submit" disabled={isSaving}>
              {isSaving
                ? 'Salvando...'
                : isEditing
                  ? 'Atualizar Cliente'
                  : 'Cadastrar Cliente'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/clientes')}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}