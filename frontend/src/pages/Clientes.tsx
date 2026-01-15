import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import type { Cliente } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Edit, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useClientesList } from '@/hooks/useClientes'; // Importar o novo hook

export default function Clientes() {
    const navigate = useNavigate();
    const { data: clientes, isLoading, isError, error, refetch } = useClientesList(); // Usando useClientesList
    const [deleteError, setDeleteError] = useState<string | null>(null); // Renomeado para evitar conflito

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja desativar este cliente?')) return;
        setDeleteError(null); // Limpa erros anteriores
        try {
            await api.delete(`/clientes/${id}`);
            refetch(); // Refetch para atualizar a lista
        } catch (err) {
            if (err instanceof Error) { // AxiosError é uma subclasse de Error
                setDeleteError(err.message || 'Erro ao desativar cliente');
            } else {
                setDeleteError('Erro ao desativar cliente');
            }
            console.error(err);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Carregando clientes...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">Erro ao carregar clientes: {error?.message}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
                        <p className="text-gray-600 mt-2">Gerencie seus clientes aqui.</p>
                    </div>
                    <Button onClick={() => navigate('/clientes/novo')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Cliente
                    </Button>
                </div>

                {/* Mensagem de Erro de Exclusão */}
                {deleteError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {deleteError}
                    </div>
                )}

                {/* Lista de Clientes */}
                {clientes && clientes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clientes.map((cliente) => (
                            <Card key={cliente.id} className={`transition-all duration-200 ${!cliente.active ? 'opacity-60 border-dashed border-gray-300' : ''}`}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-lg font-semibold flex flex-col">
                                        <span className="text-gray-900">{cliente.name}</span> {/* Usando cliente.name */}
                                        {!cliente.active && (
                                            <span className="text-xs font-normal text-red-500 mt-1">Inativo</span>
                                        )}
                                    </CardTitle>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => navigate(`/clientes/${cliente.id}`)}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => navigate(`/clientes/${cliente.id}/editar`)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(cliente.id)}
                                            disabled={!cliente.active} // Desabilita o botão se já estiver inativo
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {cliente.email && (
                                        <p className="text-sm text-gray-600 mt-1">{cliente.email}</p>
                                    )}
                                    {cliente.telefone && (
                                        <p className="text-sm text-gray-600">{cliente.telefone}</p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="text-center py-12">
                            <p className="text-gray-500 mb-4">Nenhum cliente cadastrado ainda.</p>
                            <Button onClick={() => navigate('/clientes/novo')}>
                                <Plus className="w-4 h-4 mr-2" />
                                Cadastrar Primeiro Cliente
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
