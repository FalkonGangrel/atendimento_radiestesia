import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsersList, useUpdateUser, useDeleteUser } from '@/hooks/useUsers'; // Importar os novos hooks
import type { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'; // Importar componentes Select
import { Edit, Trash2, Save, XCircle, User as UserIcon, Shield } from 'lucide-react'; // Adicionar ícones

export default function Usuarios() {
    const navigate = useNavigate();
    const { data: users, isLoading, isError, error, refetch } = useUsersList(); // Usar useUsersList
    const updateUserMutation = useUpdateUser();
    const deleteUserMutation = useDeleteUser();

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<Partial<User> | null>(null);

    const handleEdit = (user: User) => {
        setEditingId(user.id);
        setEditingData({ name: user.name, email: user.email, role: user.role }); // Apenas campos editáveis
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditingData(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (value: string) => {
        setEditingData(prev => ({ ...prev, role: value as User['role'] }));
    };

    const handleSaveEdit = async () => {
        if (!editingId || !editingData) return;

        try {
            await updateUserMutation.mutateAsync({ id: editingId, ...editingData });
            setEditingId(null);
            setEditingData(null);
        } catch (err) {
            // Erro já é tratado no hook de mutação, mas podemos adicionar feedback aqui
            console.error("Erro ao salvar edição:", err);
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingData(null);
    };

    const handleDelete = async (userId: number) => {
        if (!confirm('Tem certeza que deseja deletar este usuário? Esta ação é irreversível.')) return;
        try {
            await deleteUserMutation.mutateAsync(userId);
        } catch (err) {
            console.error("Erro ao deletar usuário:", err);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Carregando usuários...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-screen text-red-600">
                Erro ao carregar usuários: {error?.message || 'Erro desconhecido'}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Usuários</h1>
                        <p className="text-gray-600 mt-1">
                            Visualize, edite e gerencie as permissões dos usuários do sistema.
                        </p>
                    </div>
                    <Button onClick={() => navigate('/master/usuarios/novo')}> {/* TODO: Criar rota e componente para novo usuário */}
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Usuário
                    </Button>
                </div>

                {/* Mensagem de Erro Global */}
                {(updateUserMutation.isError || deleteUserMutation.isError) && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Erro!</strong>
                        <span className="block sm:inline ml-2">
                            {updateUserMutation.error?.message || deleteUserMutation.error?.message || 'Ocorreu um erro na operação.'}
                        </span>
                    </div>
                )}

                {/* Tabela de Usuários */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nome
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Perfil
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Criado Em
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Ações</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users?.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                        Nenhum usuário encontrado.
                                    </td>
                                </tr>
                            ) : (
                                users?.map((user) => (
                                    <tr key={user.id}>
                                        {editingId === user.id ? (
                                            <>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Input
                                                        type="text"
                                                        name="name"
                                                        value={editingData?.name || ''}
                                                        onChange={handleEditChange}
                                                        className="w-full"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Input
                                                        type="email"
                                                        name="email"
                                                        value={editingData?.email || ''}
                                                        onChange={handleEditChange}
                                                        className="w-full"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Select
                                                        name="role"
                                                        value={editingData?.role || ''}
                                                        onValueChange={handleRoleChange}
                                                    >
                                                        <SelectTrigger className="w-[180px]">
                                                            <SelectValue placeholder="Selecione o Perfil" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="master">Master</SelectItem>
                                                            <SelectItem value="atendente">Atendente</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                                    <Button
                                                        size="sm"
                                                        onClick={handleSaveEdit}
                                                        disabled={updateUserMutation.isPending}
                                                    >
                                                        <Save className="w-4 h-4 mr-2" />
                                                        Salvar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={handleCancelEdit}
                                                        disabled={updateUserMutation.isPending}
                                                    >
                                                        <XCircle className="w-4 h-4 mr-2" />
                                                        Cancelar
                                                    </Button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                            user.role === 'master'
                                                                ? 'bg-purple-100 text-purple-800'
                                                                : 'bg-blue-100 text-blue-800'
                                                        }`}
                                                    >
                                                        {user.role === 'master' ? 'Master' : 'Atendente'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
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
                                                        onClick={() => navigate(`/master/permissoes/${user.id}`)}
                                                    >
                                                        <Shield className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleDelete(user.id)}
                                                        disabled={deleteUserMutation.isPending}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
