import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import type { TipoAtendimento } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function TiposAtendimento() {
    const navigate = useNavigate();
    const [tipos, setTipos] = useState<TipoAtendimento[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTipos();
    }, []);

    const fetchTipos = async () => {
        try {
        setLoading(true);
        const { data } = await api.get('/tipos-atendimento');
        setTipos(data);
        setError(null);
        } catch (err) {
        setError('Erro ao carregar tipos de atendimento');
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja deletar este tipo de atendimento?')) return;

        try {
        await api.delete(`/tipos-atendimento/${id}`);
        fetchTipos();
        } catch (err) {
        setError('Erro ao deletar tipo de atendimento');
        console.error(err);
        }
    };

    if (loading) {
        return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-gray-500">Carregando tipos de atendimento...</div>
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Tipos de Atendimento</h1>
                <p className="text-gray-600 mt-2">Gerencie os tipos de atendimento e seus valores</p>
            </div>
            <Button onClick={() => navigate('/master/tipos-atendimento/novo')}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Tipo
            </Button>
            </div>

            {/* Error Message */}
            {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
            </div>
            )}

            {/* Tipos List */}
            {tipos.length > 0 ? (
            <div className="grid gap-4">
                {tipos.map((tipo) => (
                <Card key={tipo.id}>
                    <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                        <CardTitle>{tipo.nome}</CardTitle>
                        {tipo.descricao && (
                            <p className="text-sm text-gray-600 mt-2">{tipo.descricao}</p>
                        )}
                        <div className="flex gap-4 mt-3">
                            <div>
                            <p className="text-xs text-gray-500">Valor</p>
                            <p className="font-bold text-lg">
                                R$ {formatCurrency(tipo.valor)}
                            </p>
                            </div>
                            {tipo.duracao_minutos && (
                            <div>
                                <p className="text-xs text-gray-500">Duração</p>
                                <p className="font-bold">{tipo.duracao_minutos} min</p>
                            </div>
                            )}
                        </div>
                        </div>
                        <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/master/tipos-atendimento/${tipo.id}`)}
                        >
                            <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/master/tipos-atendimento/${tipo.id}/editar`)}
                        >
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(tipo.id)}
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
                <p className="text-gray-500 mb-4">Nenhum tipo de atendimento cadastrado ainda.</p>
                <Button onClick={() => navigate('/master/tipos-atendimento/novo')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Cadastrar Primeiro Tipo
                </Button>
                </CardContent>
            </Card>
            )}
        </div>
        </div>
    );
}
