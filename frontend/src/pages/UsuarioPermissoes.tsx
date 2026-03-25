// src/pages/UsuarioPermissoes.tsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, ChevronDown, ChevronUp } from 'lucide-react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { TipoAtendimento } from '@/types'
import { useTiposAtendimentoList } from '@/hooks/useTiposAtendimento'

interface TipoPermissaoState {
  modo: 'completo' | 'simplificado' | ''
  enabled: boolean          // se o usuário tem acesso a este tipo
  // preparado para campos e listas (fase 2)
  selectedFields: number[]
  selectedLists: number[]
  availableFields: { id: number; name: string }[]
  availableListModels: { id: number; name: string }[]
}

interface UserInfo {
  id: number
  name: string
  email: string
  role: string
}

export default function UsuarioPermissoes() {
  const { userId } = useParams<{ userId: string }>()
  const navigate   = useNavigate()

  const [userInfo, setUserInfo]       = useState<UserInfo | null>(null)
  const [states, setStates]           = useState<Record<number, TipoPermissaoState>>({})
  const [expanded, setExpanded]       = useState<number | null>(null)
  const [saving, setSaving]           = useState<number | null>(null)
  const [loadingTipo, setLoadingTipo] = useState<number | null>(null)
  const [error, setError]             = useState<string | null>(null)
  const [successId, setSuccessId]     = useState<number | null>(null)

  const { data: tipos, isLoading: loadingTipos } = useTiposAtendimentoList()

  // Carrega info do usuário
  useEffect(() => {
    api.get(`/users/${userId}`).then(r => setUserInfo(r.data.data ?? r.data))
  }, [userId])

  // Ao expandir um tipo, carrega as permissões atuais
  const handleExpand = async (tipo: TipoAtendimento) => {
    if (expanded === tipo.id) {
      setExpanded(null)
      return
    }
    setExpanded(tipo.id)

    if (states[tipo.id]) return // já carregado

    setLoadingTipo(tipo.id)
    try {
      const { data } = await api.get(`/users/${userId}/permissions/${tipo.id}`)

      setStates(prev => ({
        ...prev,
        [tipo.id]: {
          modo:               data.modo ?? '',
          enabled:            !!data.modo,
          selectedFields:     data.selected_field_ids  ?? [],
          selectedLists:      data.selected_list_model_ids ?? [],
          availableFields:    data.available_fields    ?? [],
          availableListModels: data.available_lists   ?? [],
        },
      }))
    } catch {
      setError('Erro ao carregar permissões deste tipo.')
    } finally {
      setLoadingTipo(null)
    }
  }

  const handleModo = (tipoId: number, modo: 'completo' | 'simplificado') => {
    setStates(prev => ({
      ...prev,
      [tipoId]: { ...prev[tipoId], modo, enabled: true },
    }))
  }

  const handleToggleEnabled = (tipoId: number) => {
    setStates(prev => ({
      ...prev,
      [tipoId]: {
        ...prev[tipoId],
        enabled: !prev[tipoId].enabled,
        modo: !prev[tipoId].enabled ? (prev[tipoId].modo || 'simplificado') : '',
      },
    }))
  }

  const handleSave = async (tipo: TipoAtendimento) => {
    const state = states[tipo.id]
    if (!state) return

    setSaving(tipo.id)
    setError(null)
    try {
      // Permissões a serem salvas com base no modo escolhido
      const permissions = buildPermissions(state.modo as string, state.enabled)

      await api.post(`/users/${userId}/permissions/${tipo.id}`, {
        modo: state.enabled ? state.modo : 'simplificado',
        permissions,
      })

      setSuccessId(tipo.id)
      setTimeout(() => setSuccessId(null), 2000)
    } catch {
      setError(`Erro ao salvar permissões para ${tipo.nome}.`)
    } finally {
      setSaving(null)
    }
  }

  if (loadingTipos) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Carregando...</div>
      </div>
    )
  }

  const tiposAtivos = tipos?.filter(t => !t.deleted_at) ?? []

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/master/usuarios')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Permissões por Tipo</h1>
          {userInfo && (
            <p className="text-gray-500 text-sm mt-1">
              {userInfo.name} — <span className="font-medium">{userInfo.email}</span>
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Um card por tipo de atendimento */}
      <div className="space-y-3">
        {tiposAtivos.map(tipo => {
          const state   = states[tipo.id]
          const isOpen  = expanded === tipo.id
          const loading = loadingTipo === tipo.id
          const isSaving = saving === tipo.id
          const saved    = successId === tipo.id

          return (
            <Card key={tipo.id} className={`transition-all ${state?.enabled ? 'border-indigo-200' : ''}`}>
              {/* Cabeçalho clicável */}
              <CardHeader
                className="cursor-pointer select-none py-4"
                onClick={() => handleExpand(tipo)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-base font-semibold">{tipo.nome}</CardTitle>
                    {state?.enabled && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        state.modo === 'completo'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {state.modo}
                      </span>
                    )}
                    {!state?.enabled && state && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">
                        sem acesso
                      </span>
                    )}
                  </div>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </CardHeader>

              {/* Corpo expansível */}
              {isOpen && (
                <CardContent className="pt-0 space-y-5">
                  {loading ? (
                    <p className="text-gray-400 text-sm">Carregando permissões...</p>
                  ) : state ? (
                    <>
                      {/* Toggle de acesso */}
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={state.enabled}
                            onChange={() => handleToggleEnabled(tipo.id)}
                            className="rounded"
                          />
                          <span className="text-sm font-medium">Permitir acesso a este tipo</span>
                        </label>
                      </div>

                      {state.enabled && (
                        <>
                          {/* Modo */}
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Modo de acesso</p>
                            <div className="flex gap-3">
                              {(['completo', 'simplificado'] as const).map(m => (
                                <label
                                  key={m}
                                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                                    state.modo === m
                                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                      : 'border-gray-200 hover:bg-gray-50'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`modo-${tipo.id}`}
                                    checked={state.modo === m}
                                    onChange={() => handleModo(tipo.id, m)}
                                    className="sr-only"
                                  />
                                  <span className="text-sm font-medium capitalize">{m}</span>
                                </label>
                              ))}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              {state.modo === 'completo'
                                ? 'Acesso a todos os campos e funcionalidades do tipo.'
                                : 'Acesso restrito — apenas campos essenciais.'}
                            </p>
                          </div>

                          {/* Campos disponíveis (preparado para fase 2) */}
                          {state.availableFields.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">
                                Campos personalizados disponíveis
                                <span className="ml-2 text-xs text-gray-400 font-normal">(em breve)</span>
                              </p>
                              <div className="grid grid-cols-2 gap-2 opacity-50 pointer-events-none">
                                {state.availableFields.map(f => (
                                  <label key={f.id} className="flex items-center gap-2 text-sm">
                                    <input type="checkbox" disabled className="rounded" />
                                    {f.name}
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Listas disponíveis (preparado para fase 2) */}
                          {state.availableListModels.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">
                                Listas disponíveis
                                <span className="ml-2 text-xs text-gray-400 font-normal">(em breve)</span>
                              </p>
                              <div className="grid grid-cols-2 gap-2 opacity-50 pointer-events-none">
                                {state.availableListModels.map(l => (
                                  <label key={l.id} className="flex items-center gap-2 text-sm">
                                    <input type="checkbox" disabled className="rounded" />
                                    {l.name}
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {/* Salvar */}
                      <div className="flex justify-end pt-2 border-t">
                        <Button
                          size="sm"
                          disabled={isSaving}
                          onClick={() => handleSave(tipo)}
                          className={saved ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {isSaving ? 'Salvando...' : saved ? 'Salvo!' : 'Salvar'}
                        </Button>
                      </div>
                    </>
                  ) : null}
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// Monta o array de permissões com base no modo e no acesso habilitado
function buildPermissions(modo: string, enabled: boolean) {
  const atendimentoPerms = ['atendimentos.view', 'atendimentos.create', 'atendimentos.update', 'atendimentos.delete']

  return atendimentoPerms.map(key => ({
    key,
    allowed: enabled && (modo === 'completo'
      ? true
      : key === 'atendimentos.view' || key === 'atendimentos.create'), // simplificado: só view e create
  }))
}