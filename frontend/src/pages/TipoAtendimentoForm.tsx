import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '@/lib/api';
import type { TipoAtendimento } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function TipoAtendimentoForm() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditing = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        nome: '',
        slug: '',
        descricao: '',
        valor: '',
        duracao_minutos: '',
        ativo: true,
        ordem: '0',
    });

    useEffect(() => {
        if (isEditing) {
        fetchTipo();
        }
    }, [id]);

    const fetchTipo = async () => {
        try {
        setLoading(true);
        const { data } = await api.get(`/tipos-atendimento/${id}`);
        setFormData({
            nome: data.nome || '',
            slug: data.slug || '',
            descricao: data.descricao || '',
            valor: data.valor?.toString() || '',
            duracao_minutos: data.duracao_minutos?.toString() || '',
            ativo: data.ativo ?? true,
            ordem: data.ordem?.toString() || '0',
        });
        setError(null);
        } catch (err) {
        setError('Erro ao carregar tipo de atendimento');
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    const generateSlug = (nome: string) => {
        return nome
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    };

    const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nome = e.target.value;
        setFormData({
        ...formData,
        nome,
        slug: !isEditing ? generateSlug(nome) : formData.slug,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
        const submitData = {
            ...formData,
            valor: parseFloat(formData.valor),
            duracao_minutos: formData.duracao_minutos ? parseInt(formData.duracao_minutos) : null,
            ordem: parseInt(formData.ordem),
        };

        if (isEditing) {
            await api.put(`/tipos-atendimento/${id}`, submitData);
        } else {
            await api.post('/tipos-atendimento', submitData);
        }
        navigate('/master/tipos-atendimento');
        } catch (err) {
        setError('Erro ao salvar tipo de atendimento');
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    if (loading && isEditing) {
        return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-gray-500">Carregando tipo de atendimento...</div>
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
                onClick={() => navigate('/master/tipos-atendimento')}
                className="mb-4"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
                {isEditing ? 'Editar Tipo de Atendimento' : 'Novo Tipo de Atendimento'}
            </h1>
            <p className="text-gray-600 mt-2">
                {isEditing
                ? 'Atualize as informações do tipo de atendimento'
                : 'Preencha os dados do novo tipo de atendimento'}
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
                <CardTitle>Informações do Tipo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                {/* Nome */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                    Nome do Tipo *
                    </label>
                    <Input
                    value={formData.nome}
                    onChange={handleNomeChange}
                    required
                    placeholder="Ex: Mesa radiônica de vidas passadas"
                    />
                </div>

                {/* Slug */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                    Slug (URL) *
                    </label>
                    <Input
                    value={formData.slug}
                    onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                    }
                    required
                    placeholder="mesa-radionica-vidas-passadas"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                    Identificador único para a URL
                    </p>
                </div>

                {/* Descrição */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                    Descrição
                    </label>
                    <textarea
                    className="w-full border rounded-lg p-2 min-h-[100px]"
                    value={formData.descricao}
                    onChange={(e) =>
                        setFormData({ ...formData, descricao: e.target.value })
                    }
                    placeholder="Descreva o tipo de atendimento..."
                    />
                </div>

                {/* Valor e Duração */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium mb-2">
                        Valor (R$) *
                    </label>
                    <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.valor}
                        onChange={(e) =>
                        setFormData({ ...formData, valor: e.target.value })
                        }
                        required
                        placeholder="200.00"
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium mb-2">
                        Duração (minutos)
                    </label>
                    <Input
                        type="number"
                        min="0"
                        value={formData.duracao_minutos}
                        onChange={(e) =>
                        setFormData({
                            ...formData,
                            duracao_minutos: e.target.value,
                        })
                        }
                        placeholder="60"
                    />
                    </div>
                </div>

                {/* Ordem */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                    Ordem de Exibição
                    </label>
                    <Input
                    type="number"
                    min="0"
                    value={formData.ordem}
                    onChange={(e) =>
                        setFormData({ ...formData, ordem: e.target.value })
                    }
                    />
                </div>

                {/* Ativo */}
                <div className="flex items-center gap-2">
                    <input
                    type="checkbox"
                    id="ativo"
                    checked={formData.ativo}
                    onChange={(e) =>
                        setFormData({ ...formData, ativo: e.target.checked })
                    }
                    className="rounded"
                    />
                    <label htmlFor="ativo" className="text-sm font-medium">
                    Ativo
                    </label>
                </div>
                </CardContent>
            </Card>

            {/* Botões de Ação */}
            <div className="mt-6 flex gap-4">
                <Button type="submit" disabled={loading}>
                {loading
                    ? 'Salvando...'
                    : isEditing
                    ? 'Atualizar Tipo'
                    : 'Cadastrar Tipo'}
                </Button>
                <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/master/tipos-atendimento')}
                >
                Cancelar
                </Button>
            </div>
            </form>
        </div>
        </div>
    );
}
