import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import type { User } from '@/types';

export function Usuarios() {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<Partial<User> | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
        setLoading(true);
        const { data } = await api.get('/users');
        setUsers(data);
        setError(null);
        } catch (err) {
        setError('Erro ao carregar usuários');
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    const handleEdit = (user: User) => {
        setEditingId(user.id);
        setEditingData({ ...user });
    };

    const handleSaveEdit = async () => {
        if (!editingId || !editingData) return;

        try {
        await api.put(`/users/${editingId}`, editingData);
        setUsers(users.map(u => u.id === editingId ? { ...u, ...editingData } : u));
        setEditingId(null);
        setEditingData(null);
        } catch (err) {
        setError('Erro ao atualizar usuário');
        console.error(err);
        }
    };

    const handleDelete = async (userId: number) => {
        if (!confirm('Tem certeza que deseja deletar este usuário?')) return;

        try {
        await api.delete(`/users/${userId}`);
        setUsers(users.filter(u => u.id !== userId));
        } catch (err) {
        setError('Erro ao deletar usuário');
        console.error(err);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditingData(null);
    };

    if (loading) {
        return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-gray-500">Carregando usuários...</div>
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Usuários</h1>
            <p className="text-gray-600 mt-2">Visualize e gerencie todos os usuários do sistema</p>
            </div>

            {/* Error Message */}
            {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
            </div>
            )}

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
                <thead className="bg-gray-100 border-b">
                <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nome</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Criado em</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Ações</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                    {editingId === user.id ? (
                        <>
                        <td className="px-6 py-4">
                            <input
                            type="text"
                            value={editingData?.name || ''}
                            onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </td>
                        <td className="px-6 py-4">
                            <input
                            type="email"
                            value={editingData?.email || ''}
                            onChange={(e) => setEditingData({ ...editingData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </td>
                        <td className="px-6 py-4">
                            <select
                            value={editingData?.role || 'atendente'}
                            onChange={(e) => setEditingData({ ...editingData, role: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            >
                            <option value="atendente">Atendente</option>
                            <option value="master">Master</option>
                            </select>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(user.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                            <button
                            onClick={handleSaveEdit}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                            >
                            Salvar
                            </button>
                            <button
                            onClick={handleCancel}
                            className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm"
                            >
                            Cancelar
                            </button>
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
                        <td className="px-6 py-4 text-right space-x-2">
                            <button
                            onClick={() => handleEdit(user)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                            >
                            Editar
                            </button>
                            <button
                            onClick={() => navigate(`/master/permissoes/${user.id}`)}
                            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                            >
                            Permissões
                            </button>
                            <button
                            onClick={() => handleDelete(user.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                            >
                            Deletar
                            </button>
                        </td>
                        </>
                    )}
                    </tr>
                ))}
                </tbody>
            </table>
            </div>

            {users.length === 0 && (
            <div className="text-center py-12 text-gray-500">
                Nenhum usuário encontrado
            </div>
            )}
        </div>
        </div>
    );
}
