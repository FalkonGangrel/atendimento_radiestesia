import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import type { Cliente } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function Clientes() {
    const navigate = useNavigate();
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        try {
        setLoading(true);
        const { data } = await api.get('/clientes');
        setClientes(data);
        setError(null);
        } catch (err) {
        setError('Erro ao carregar clientes');
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja desativar este cliente?')) return;

        try {
        await api.delete(`/clientes/${id}`);
        fetchClientes();
        } catch (err) {
        setError('Erro ao desativar cliente');
        console.error(err);
        }
    };

    if (loading) {
        return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-gray-500">Carregando clientes...</div>
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Meus Clientes</h1>
                <p className="text-gray-600 mt-2">Gerencie seus clientes cadastrados</p>
            </div>
            <Button onClick={() => navigate('/clientes/novo')}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Cliente
            </Button>
            </div>

            {/* Error Message */}
            {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
            </div>
            )}

            {/* Clientes List */}
            {clientes.length > 0 ? (
            <div className="grid gap-4">
                {clientes.map((cliente) => (
                <Card key={cliente.id}>
                    <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                        <CardTitle>{cliente.nome}</CardTitle>
                        {cliente.email && (
                            <p className="text-sm text-gray-600 mt-1">{cliente.email}</p>
                        )}
                        {cliente.telefone && (
                            <p className="text-sm text-gray-600">{cliente.telefone}</p>
                        )}
                        </div>
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
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                        </div>
                    </div>
                    </CardHeader>
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
