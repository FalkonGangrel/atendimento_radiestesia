import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '@/lib/api';
import type { Cliente, ClienteFormData } from '@/types'; // Importar ClienteFormData
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea'; // Importar Textarea
import { ArrowLeft } from 'lucide-react';
import { useClienteForm } from '@/hooks/useClientes'; // Usar o hook useClienteForm
import { AxiosError } from 'axios';

export default function ClienteForm() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditing = Boolean(id);

    // Usar useClienteForm para carregar dados na edição
    const { data: clienteData, isLoading: isLoadingCliente, isError: isErrorCliente, error: clienteError } = useClienteForm(id ? Number(id) : undefined);

    const [isSaving, setIsSaving] = useState(false); // Estado para o salvamento do formulário
    const [submitError, setSubmitError] = useState<string | null>(null); // Erro específico de submissão

    const [formData, setFormData] = useState<ClienteFormData>({
        name: '', // Alterado de 'nome' para 'name'
        email: null,
        telefone: null,
        whatsapp: null,
        data_nascimento: null,
        observacoes: null,
    });

    // Preencher formulário ao carregar dados do cliente para edição
    useEffect(() => {
        if (isEditing && clienteData) {
            setFormData({
                name: clienteData.name || '',
                email: clienteData.email || null,
                telefone: clienteData.telefone || null,
                whatsapp: clienteData.whatsapp || null,
                data_nascimento: clienteData.data_nascimento || null,
                observacoes: clienteData.observacoes || null,
            });
        }
    }, [isEditing, clienteData]);

    // Função genérica para lidar com mudanças nos inputs
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value === '' ? null : value, // Trata string vazia como null
        }));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);
        setIsSaving(true);

        // Validação básica
        if (!formData.name.trim()) {
            setSubmitError('O nome do cliente é obrigatório.');
            setIsSaving(false);
            return;
        }

        try {
            if (isEditing) {
                await api.put(`/clientes/${id}`, formData);
            } else {
                await api.post('/clientes', formData);
            }
            navigate('/clientes');
        } catch (err) {
            if (err instanceof AxiosError) {
                setSubmitError(err.response?.data?.message || 'Erro ao salvar cliente');
            } else {
                setSubmitError('Erro ao salvar cliente');
            }
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    // Exibir carregamento apenas se estiver editando e buscando dados do cliente
    if (isLoadingCliente && isEditing) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Carregando cliente para edição...</div>
            </div>
        );
    }

    // Exibir erro se houver problema ao carregar o cliente para edição
    if (isErrorCliente && isEditing) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">Erro ao carregar cliente: {clienteError?.message || 'Desconhecido'}</div>
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
                        {isEditing ? `Editar Cliente: ${clienteData?.name}` : 'Novo Cliente'}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {isEditing ? 'Atualize as informações do cliente.' : 'Preencha os dados para cadastrar um novo cliente.'}
                    </p>
                </div>

                {/* Mensagem de Erro de Submissão */}
                {submitError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {submitError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dados do Cliente</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Nome */}
                            <div>
                                <label className="block text-sm font-medium mb-2" htmlFor="name">
                                    Nome <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Nome completo do cliente"
                                    required // Campo obrigatório
                                />
                            </div>
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium mb-2" htmlFor="email">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={handleInputChange}
                                    placeholder="exemplo@email.com"
                                />
                            </div>
                            {/* Telefone e WhatsApp */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2" htmlFor="telefone">
                                        Telefone
                                    </label>
                                    <Input
                                        id="telefone"
                                        name="telefone"
                                        value={formData.telefone || ''}
                                        onChange={handleInputChange}
                                        placeholder="(00) 00000-0000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" htmlFor="whatsapp">
                                        WhatsApp
                                    </label>
                                    <Input
                                        id="whatsapp"
                                        name="whatsapp"
                                        value={formData.whatsapp || ''}
                                        onChange={handleInputChange}
                                        placeholder="(00) 00000-0000"
                                    />
                                </div>
                            </div>
                            {/* Data de Nascimento */}
                            <div>
                                <label className="block text-sm font-medium mb-2" htmlFor="data_nascimento">
                                    Data de Nascimento
                                </label>
                                <Input
                                    id="data_nascimento"
                                    name="data_nascimento"
                                    type="date"
                                    value={formData.data_nascimento || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                            {/* Observações */}
                            <div>
                                <label className="block text-sm font-medium mb-2" htmlFor="observacoes">
                                    Observações
                                </label>
                                <Textarea // Usando o componente Textarea
                                    id="observacoes"
                                    name="observacoes"
                                    className="w-full min-h-[100px]"
                                    value={formData.observacoes || ''}
                                    onChange={handleInputChange}
                                    placeholder="Informações adicionais sobre o cliente..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Botões de Ação */}
                    <div className="mt-6 flex gap-4">
                        <Button type="submit" disabled={isSaving}>
                            {isSaving
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
