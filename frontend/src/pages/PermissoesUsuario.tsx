import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardTitle, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { ArrowLeft } from 'lucide-react'

import { useUsersList } from '@/hooks/useUsers'
import { useTiposAtendimentoList } from '@/hooks/useTiposAtendimento'
import {
  useUserPermissionsForTipo,
  useSaveUserPermissions,
} from '@/hooks/usePermissions'

import type { SavePermissionsPayload } from '@/types'

export default function PermissoesUsuario() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()

  const parsedUserId = userId ? Number(userId) : undefined

  const { data: users, isLoading: isLoadingUsers } = useUsersList()
  const user = users?.find(u => u.id === parsedUserId)

  const { data: tipos, isLoading: isLoadingTipos } =
    useTiposAtendimentoList()

  const [selectedTipoId, setSelectedTipoId] = useState<number>()

  const {
    data: permissionsData,
    isLoading: isLoadingPermissions,
  } = useUserPermissionsForTipo(parsedUserId, selectedTipoId)

  const { mutate: savePermissions, isPending } =
    useSaveUserPermissions()

  const hasPermission = permissionsData?.has_permission ?? false
  const selectedFieldIds = permissionsData?.selected_field_ids ?? []
  const selectedListModelIds =
    permissionsData?.selected_list_model_ids ?? []
  const selectedListItemIds =
    permissionsData?.selected_list_item_ids ?? []

  const handleSave = () => {
    if (!parsedUserId || !selectedTipoId) return

    const payload: SavePermissionsPayload = {
      active: hasPermission,
      field_ids: selectedFieldIds,
      list_model_ids: selectedListModelIds,
      list_item_ids: selectedListItemIds,
    }

    savePermissions({
      userId: parsedUserId,
      tipoId: selectedTipoId,
      payload,
    })
  }

  if (
    isLoadingUsers ||
    isLoadingTipos ||
    isLoadingPermissions
  ) {
    return <div className="text-center py-10">Carregando…</div>
  }

  if (!user) {
    return <div className="text-center py-10">Usuário não encontrado</div>
  }

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Permissões para {user.name}
        </h1>
        <Button variant="outline" onClick={() => navigate('/usuarios')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>

      <Card>
        <CardTitle className="p-4">Tipo de Atendimento</CardTitle>
        <CardContent>
          <Select
            value={selectedTipoId?.toString()}
            onValueChange={v => setSelectedTipoId(Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um tipo" />
            </SelectTrigger>
            {tipos?.map(tipo => (
              <SelectItem key={tipo.id} value={String(tipo.id)}>
                {tipo.nome}
              </SelectItem>
            ))}
          </Select>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={isPending}>
        Salvar Permissões
      </Button>
    </div>
  )
}
