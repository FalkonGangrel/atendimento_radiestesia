import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useUsersList,
  useUpdateUser,
  useDeleteUser,
} from '@/hooks/useUsers'
import type { User } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Edit,
  Trash2,
  Save,
  XCircle,
  Shield,
  Plus,
} from 'lucide-react'

export default function Usuarios() {
  const navigate = useNavigate()

  const { data: users, isLoading, isError, error } = useUsersList()
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingData, setEditingData] = useState<Partial<User> | null>(null)

  const handleEdit = (user: User) => {
    setEditingId(user.id)
    setEditingData({
      name: user.name,
      email: user.email,
      role: user.role,
    })
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditingData(prev => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: User['role']) => {
    setEditingData(prev => ({ ...prev, role: value }))
  }

  const handleSaveEdit = async () => {
    if (!editingId || !editingData) return

    try {
      await updateUserMutation.mutateAsync({
        id: editingId,
        ...editingData,
      })
      setEditingId(null)
      setEditingData(null)
    } catch (err) {
      console.error('Erro ao salvar edição:', err)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingData(null)
  }

  const handleDelete = async (userId: number) => {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return

    try {
      await deleteUserMutation.mutateAsync(userId)
    } catch (err) {
      console.error('Erro ao deletar usuário:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Carregando usuários...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        Erro ao carregar usuários: {error?.message}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
            <p className="text-gray-600 mt-1">
              Visualize, edite e gerencie os usuários do sistema.
            </p>
          </div>

          <Button onClick={() => navigate('/master/usuarios/novo')}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        </div>

        {/* Erros de mutação */}
        {(updateUserMutation.isError || deleteUserMutation.isError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {updateUserMutation.error?.message ||
              deleteUserMutation.error?.message ||
              'Erro ao executar operação'}
          </div>
        )}

        {/* Tabela */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Perfil
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Criado em
                </th>
                <th className="px-6 py-3" />
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {users?.map(user => (
                <tr key={user.id}>
                  {editingId === user.id ? (
                    <>
                      <td className="px-6 py-4">
                        <Input
                          name="name"
                          value={editingData?.name || ''}
                          onChange={handleEditChange}
                        />
                      </td>

                      <td className="px-6 py-4">
                        <Input
                          name="email"
                          value={editingData?.email || ''}
                          onChange={handleEditChange}
                        />
                      </td>

                      <td className="px-6 py-4">
                        <Select
                          value={editingData?.role}
                          onValueChange={handleRoleChange}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Perfil" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="master">Master</SelectItem>
                            <SelectItem value="atendente">
                              Atendente
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        <Button size="sm" onClick={handleSaveEdit}>
                          <Save className="w-4 h-4 mr-2" />
                          Salvar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancelar
                        </Button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 font-medium">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        {user.role === 'master' ? 'Master' : 'Atendente'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            navigate(`/master/permissoes/${user.id}`)
                          }
                        >
                          <Shield className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
