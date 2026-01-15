import { useAtendimentos } from '@/hooks/useAtendimentos';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/lib/utils';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { AxiosError } from 'axios';
import { useState } from 'react';
import type { Atendimento } from '@/types'; // Importar o tipo Atendimento

export default function AtendimentosList() {
    const { data: atendimentos, isLoading, refetch } = useAtendimentos(); // Desestruturar isLoading
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este atendimento?')) return;
        try {
            await api.delete(`/atendimentos/${id}`);
            refetch(); // Recarrega a lista após a exclusão
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || 'Erro ao excluir atendimento');
            } else {
                setError('Erro ao excluir atendimento');
            }
        }
    };

    const getStatusColor = (status: Atendimento['status']) => { // Tipar o parâmetro status
        switch (status) {
            case 'em_andamento':
                return 'bg-blue-100 text-blue-800';
            case 'concluido':
                return 'bg-green-100 text-green-800';
            case 'cancelado':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: Atendimento['status']) => { // Tipar o parâmetro status
        switch (status) {
            case 'em_andamento':
                return 'Em Andamento';
            case 'concluido':
                return 'Concluído';
            case 'cancelado':
                return 'Cancelado';
            default:
                return status;
        }
    };

    if (isLoading) {
        return <div className="text-center py-10">Carregando atendimentos...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Meus Atendimentos</h1>
                <Button onClick={() => navigate('/novo-atendimento')}>
                    Novo Atendimento
                </Button>
            </div>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}
            {atendimentos && atendimentos.length > 0 ? (
                <div className="grid gap-4">
                    {atendimentos.map((atendimento) => (
                        <Card key={atendimento.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{atendimento.patient_name}</CardTitle>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Data: {formatDate(atendimento.attendance_date)}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                                            atendimento.status
                                        )}`}
                                    >
                                        {getStatusLabel(atendimento.status)}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => navigate(`/atendimentos/${atendimento.id}`)}
                                    >
                                        <Eye className="w-4 h-4 mr-1" />
                                        Ver
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => navigate(`/atendimentos/${atendimento.id}/editar`)}
                                    >
                                        <Edit className="w-4 h-4 mr-1" />
                                        Editar
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleDelete(atendimento.id)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Excluir
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="text-center py-10">
                        <p className="text-gray-500 mb-4">Nenhum atendimento cadastrado ainda.</p>
                        <Button onClick={() => navigate('/novo-atendimento')}>
                            Criar Primeiro Atendimento
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
