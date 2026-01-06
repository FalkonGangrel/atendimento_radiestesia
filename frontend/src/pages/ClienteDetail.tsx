import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '@/lib/api';
import type { Cliente } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, Edit, Trash2, Calendar, Mail, Phone, MessageCircle } from 'lucide-react';

export default function ClienteDetail() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCliente();
    }, [id]);

    const fetchCliente = async () => {
        try {
        setLoading(true);
        const { data } = await api.get(`/clientes/${id}`);
        setCliente(data);
        setError(null);
        } catch (err) {
        setError('Erro ao carregar cliente');
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja desativar este cliente?')) return;

        try {
        await api.delete(`/clientes/${id}`);
        navigate('/clientes');
        } catch (err) {
        setError('Erro ao desativar cliente');
        console.error(err);
        }
    };

    if (loading) {
        return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-gray-500">Carregando cliente...</div>
        </div>
        );
    }

    if (!cliente) {
        return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-red-500">Cliente não encontrado</div>
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
            <Button
                variant="ghost"
                onClick={() => navigate('/clientes')}
                className="mb-4"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
            </Button>
            <div className="flex justify-between items-start">
                <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    {cliente.nome}
                </h1>
                <p className="text-gray-600 mt-2">Detalhes do cliente</p>
                </div>
                <div className="flex gap-2">
                <Button
                    variant="outline"
                    onClick={() => navigate(`/clientes/${id}/editar`)}
                >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Desativar
                </Button>
                </div>
            </div>
            </div>

            {/* Error Message */}
            {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
            </div>
            )}

            {/* Informações do Cliente */}
            <div className="grid gap-6">
            <Card>
                <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                {cliente.email && (
                    <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{cliente.email}</p>
                    </div>
                    </div>
                )}

                {cliente.telefone && (
                    <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="text-sm text-gray-600">Telefone</p>
                        <p className="font-medium">{cliente.telefone}</p>
                    </div>
                    </div>
                )}

                {cliente.whatsapp && (
                    <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="text-sm text-gray-600">WhatsApp</p>
                        <p className="font-medium">{cliente.whatsapp}</p>
                    </div>
                    </div>
                )}

                {cliente.data_nascimento && (
                    <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="text-sm text-gray-600">Data de Nascimento</p>
                        <p className="font-medium">
                        {new Date(cliente.data_nascimento).toLocaleDateString(
                            'pt-BR'
                        )}
                        </p>
                    </div>
                    </div>
                )}
                </CardContent>
            </Card>

            {cliente.observacoes && (
                <Card>
                <CardHeader>
                    <CardTitle>Observações</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-700 whitespace-pre-wrap">
                    {cliente.observacoes}
                    </p>
                </CardContent>
                </Card>
            )}

            {/* TODO: Histórico de Atendimentos */}
            <Card>
                <CardHeader>
                <CardTitle>Histórico de Atendimentos</CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-gray-500 text-center py-8">
                    Em breve: histórico de atendimentos deste cliente
                </p>
                </CardContent>
            </Card>
            </div>
        </div>
        </div>
    );
}
