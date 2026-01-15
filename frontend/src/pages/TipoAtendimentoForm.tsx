// src/pages/TipoAtendimentoForm.tsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '@/lib/api';
import type { TipoAtendimento, TipoAtendimentoFormData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea'; // Importar Textarea
import { ArrowLeft } from 'lucide-react';
import { useTipoAtendimentoForm, useSaveTipoAtendimento } from '@/hooks/useTiposAtendimento'; // Importar hooks de react-query
import { AxiosError } from 'axios';

export default function TipoAtendimentoForm() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditing = Boolean(id);

    // Usar useTipoAtendimentoForm para carregar dados para edição
    const { data: tipoAtendimentoData, isLoading: isLoadingTipo, isError: isErrorTipo, error: errorTipo } = useTipoAtendimentoForm(isEditing ? Number(id) : undefined);

    const saveTipoMutation = useSaveTipoAtendimento();

    const [formData, setFormData] = useState<TipoAtendimentoFormData>({
        nome: '',
        slug: '',
        descricao: '',
        valor: '',
        duracao_minutos: '',
        ativo: true,
        ordem: '0',
    });
    const [error, setError] = useState<string | null>(null);

    // Preencher o formulário quando os dados do tipo de atendimento forem carregados para edição
    useEffect(() => {
        if (isEditing && tipoAtendimentoData) {
            setFormData({
                nome: tipoAtendimentoData.nome || '',
                slug: tipoAtendimentoData.slug || '',
                descricao: tipoAtendimentoData.descricao || '',
                valor: tipoAtendimentoData.valor?.toString() || '',
                duracao_minutos: tipoAtendimentoData.duracao_minutos?.toString() || '',
                ativo: tipoAtendimentoData.ativo ?? true,
                ordem: tipoAtendimentoData.ordem?.toString() || '0',
            });
        }
    }, [isEditing, tipoAtendimentoData]);

    // Função para gerar slug (mantida, pois é útil)
    const generateSlug = useCallback((nome: string) => {
        return nome
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setFormData((prev) => {
            const newFormData = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            };

            // Gerar slug automaticamente apenas se não estiver editando e o campo for 'nome'
            if (name === 'nome' && !isEditing) {
                newFormData.slug = generateSlug(value);
            }
            return newFormData;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await saveTipoMutation.mutateAsync({
                id: isEditing ? Number(id) : undefined,
                payload: formData,
            });
            navigate('/master/tipos-atendimento');
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || 'Erro ao salvar tipo de atendimento');
            } else {
                setError('Erro desconhecido ao salvar tipo de atendimento');
            }
            console.error(err);
        }
    };

    const isSaving = saveTipoMutation.isPending;
    const isLoading = isLoadingTipo || isSaving;

    if (isLoadingTipo) {
        return <div className="text-center py-10">Carregando tipo de atendimento...</div>;
    }

    if (isErrorTipo) {
        return <div className="text-center py-10 text-red-600">Erro ao carregar tipo de atendimento: {errorTipo?.message}</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">
                    {isEditing ? 'Editar Tipo de Atendimento' : 'Novo Tipo de Atendimento'}
                </h1>
                <Button variant="outline" onClick={() => navigate('/master/tipos-atendimento')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                </Button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Erro:</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}

            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações Básicas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Nome */}
                            <div>
                                <label htmlFor="nome" className="block text-sm font-medium mb-2">
                                    Nome do Tipo de Atendimento
                                </label>
                                <Input
                                    id="nome"
                                    name="nome"
                                    type="text"
                                    value={formData.nome}
                                    onChange={handleInputChange}
                                    placeholder="Ex: Terapia Holística"
                                    required
                                />
                            </div>
                            {/* Slug */}
                            <div>
                                <label htmlFor="slug" className="block text-sm font-medium mb-2">
                                    Slug (URL amigável)
                                </label>
                                <Input
                                    id="slug"
                                    name="slug"
                                    type="text"
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                    placeholder="terapia-holistica"
                                    required
                                    disabled={isEditing} // Slug não deve ser editável após a criação
                                />
                            </div>
                            {/* Descrição */}
                            <div>
                                <label htmlFor="descricao" className="block text-sm font-medium mb-2">
                                    Descrição
                                </label>
                                <Textarea // CORRIGIDO: Usando Textarea
                                    id="descricao"
                                    name="descricao"
                                    value={formData.descricao}
                                    onChange={handleInputChange}
                                    placeholder="Descreva brevemente este tipo de atendimento..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Detalhes do Atendimento</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Valor e Duração */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="valor" className="block text-sm font-medium mb-2">
                                        Valor (R$)
                                    </label>
                                    <Input
                                        id="valor"
                                        name="valor"
                                        type="number"
                                        step="0.01" // Permite valores decimais
                                        min="0"
                                        value={formData.valor}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="200.00"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="duracao_minutos" className="block text-sm font-medium mb-2">
                                        Duração (minutos)
                                    </label>
                                    <Input
                                        id="duracao_minutos"
                                        name="duracao_minutos"
                                        type="number"
                                        min="0"
                                        value={formData.duracao_minutos}
                                        onChange={handleInputChange}
                                        placeholder="60"
                                    />
                                </div>
                            </div>
                            {/* Ordem */}
                            <div>
                                <label htmlFor="ordem" className="block text-sm font-medium mb-2">
                                    Ordem de Exibição
                                </label>
                                <Input
                                    id="ordem"
                                    name="ordem"
                                    type="number"
                                    min="0"
                                    value={formData.ordem}
                                    onChange={handleInputChange}
                                    placeholder="0"
                                />
                            </div>
                            {/* Ativo */}
                            <div className="flex items-center gap-2">
                                <input
                                    id="ativo"
                                    name="ativo"
                                    type="checkbox"
                                    checked={formData.ativo}
                                    onChange={handleInputChange}
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
                        <Button type="submit" disabled={isLoading}>
                            {isSaving
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
