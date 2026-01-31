import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  useUsersList,
  useUpdateUser,
  useDeleteUser,
  useRestoreUser,
} from '@/hooks/useUsers'

import { canManageUsuarios, canManagePermissionsUsuarios } from '@/helpers/permissions'

import { useAuth } from '@/contexts'
import type { UserListItem } from '@/types'

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
  RotateCcw,
} from 'lucide-react'

export default function Usuarios() {
  const navigate = useNavigate()
  const { user: authUser } = useAuth()

  const { data: users, isLoading, isError, error } = useUsersList()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()
  const restoreUser = useRestoreUser()

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingData, setEditingData] = useState<Partial<UserListItem>>({})

  const handleEdit = (user: UserListItem) => {
    setEditingId(user.id)
    setEditingData({
      name: user.name,
      email: user.email,
      role: user.role,
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleRoleChange = (role: UserListItem['role']) => {
    setEditingData(prev => ({ ...prev, role }))
  }

  const handleSave = async () => {
    if (!editingId) return

    await updateUser.mutateAsync({
      id: editingId,
      ...editingData,
    })

    setEditingId(null)
    setEditingData({})
  }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Carregando usuários...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">
                    Erro ao carregar usuários: {error?.message}
                </div>
            </div>
        );
    }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Usuários</h1>

        {canManageUsuarios(authUser) && (
          <Button onClick={() => navigate('/master/usuarios/novo')}>
            <Plus className="w-4 h-4 mr-2" />
            Novo
          </Button>
        )}
      </div>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="text-left border-b">
            <th className="p-3">Nome</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Criado</th>
            <th className="p-3 text-right" />
          </tr>
        </thead>

        <tbody>
          {users?.map(user => (
            <tr key={user.id} className="border-b">
              {editingId === user.id ? (
                <>
                  <td className="p-3">
                    <Input
                      name="name"
                      value={editingData.name ?? ''}
                      onChange={handleChange}
                    />
                  </td>

                  <td className="p-3">
                    <Input
                      name="email"
                      value={editingData.email ?? ''}
                      onChange={handleChange}
                    />
                  </td>

                  <td className="p-3">
                    {canManageUsuarios(authUser) &&
                    authUser.id !== user.id ? (
                      <Select
                        value={editingData.role}
                        onValueChange={handleRoleChange}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="master">Master</SelectItem>
                          <SelectItem value="atendente">
                            Atendente
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-gray-500">{user.role}</span>
                    )}
                  </td>

                  <td className="p-3">
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </td>

                  <td className="p-3 text-right space-x-2">
                    <Button size="sm" onClick={handleSave}>
                      <Save className="w-4 h-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(null)
                        setEditingData({})
                      }}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3">
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </td>

                  <td className="p-3 text-right space-x-2">
                    {canManageUsuarios(authUser) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}

                    {canManagePermissionsUsuarios(authUser) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigate(`/master/permissoes/${user.id}`)
                        }
                      >
                        <Shield className="w-4 h-4" />
                      </Button>
                    )}

                    {user.deleted_at ? (
                      canManageUsuarios(authUser) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => restoreUser.mutate(user.id)}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      )
                    ) : (
                      canManageUsuarios(authUser) && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteUser.mutate(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )
                    )}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
