import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '@/lib/api';
import type { Cliente } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function ClienteForm() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditing = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        whatsapp: '',
        data_nascimento: '',
        observacoes: '',
    });

    useEffect(() => {
        if (isEditing) {
        fetchCliente();
        }
    }, [id]);

    const fetchCliente = async () => {
        try {
        setLoading(true);
        const { data } = await api.get(`/clientes/${id}`);
        setFormData({
            nome: data.nome || '',
            email: data.email || '',
            telefone: data.telefone || '',
            whatsapp: data.whatsapp || '',
            data_nascimento: data.data_nascimento || '',
            observacoes: data.observacoes || '',
        });
        setError(null);
        } catch (err) {
        setError('Erro ao carregar cliente');
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
        if (isEditing) {
            await api.put(`/clientes/${id}`, formData);
        } else {
            await api.post('/clientes', formData);
        }
        navigate('/clientes');
        } catch (err) {
        setError('Erro ao salvar cliente');
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    if (loading && isEditing) {
        return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-gray-500">Carregando cliente...</div>
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
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
            <h1 className="text-3xl font-bold text-gray-900">
                {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
            </h1>
            <p className="text-gray-600 mt-2">
                {isEditing
                ? 'Atualize as informações do cliente'
                : 'Preencha os dados do novo cliente'}
            </p>
            </div>

            {/* Error Message */}
            {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
            </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                <CardTitle>Dados do Cliente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                {/* Nome */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                    Nome Completo *
                    </label>
                    <Input
                    value={formData.nome}
                    onChange={(e) =>
                        setFormData({ ...formData, nome: e.target.value })
                    }
                    required
                    placeholder="Digite o nome completo"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="exemplo@email.com"
                    />
                </div>

                {/* Telefone e WhatsApp */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium mb-2">
                        Telefone
                    </label>
                    <Input
                        value={formData.telefone}
                        onChange={(e) =>
                        setFormData({ ...formData, telefone: e.target.value })
                        }
                        placeholder="(00) 00000-0000"
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium mb-2">
                        WhatsApp
                    </label>
                    <Input
                        value={formData.whatsapp}
                        onChange={(e) =>
                        setFormData({ ...formData, whatsapp: e.target.value })
                        }
                        placeholder="(00) 00000-0000"
                    />
                    </div>
                </div>

                {/* Data de Nascimento */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                    Data de Nascimento
                    </label>
                    <Input
                    type="date"
                    value={formData.data_nascimento}
                    onChange={(e) =>
                        setFormData({
                        ...formData,
                        data_nascimento: e.target.value,
                        })
                    }
                    />
                </div>

                {/* Observações */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                    Observações
                    </label>
                    <textarea
                    className="w-full border rounded-lg p-2 min-h-[100px]"
                    value={formData.observacoes}
                    onChange={(e) =>
                        setFormData({ ...formData, observacoes: e.target.value })
                    }
                    placeholder="Informações adicionais sobre o cliente..."
                    />
                </div>
                </CardContent>
            </Card>

            {/* Botões de Ação */}
            <div className="mt-6 flex gap-4">
                <Button type="submit" disabled={loading}>
                {loading
                    ? 'Salvando...'
                    : isEditing
                    ? 'Atualizar Cliente'
                    : 'Cadastrar Cliente'}
                </Button>
                <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/clientes')}
                >
                Cancelar
                </Button>
            </div>
            </form>
        </div>
        </div>
    );
}
