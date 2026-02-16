import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Importar Textarea
import { Permissions } from '@/constants/permissions';
import { useAuth } from '@/contexts/';
import { useClienteForm, useSaveCliente } from '@/hooks/useClientes'; // Usar o hook useClienteForm
import type { ClienteFormData } from '@/types'; // Importar ClienteFormData
import { AxiosError } from 'axios';
import { ArrowLeft } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function ClienteForm() {
    const navigate = useNavigate();
    const { hasPermission } = useAuth()
    const { id } = useParams<{ id: string }>();
    const isEditing = Boolean(id);

    // Usar useClienteForm para carregar dados na edição
    const { data: clienteData, isLoading: isLoadingCliente, isError: isErrorCliente, error: clienteError } = useClienteForm(id ? Number(id) : undefined);
    const saveCliente = useSaveCliente();


    const [isSaving, setIsSaving] = useState(false); // Estado para o salvamento do formulário
    const [submitError, setSubmitError] = useState<string | null>(null); // Erro específico de submissão

    const [formData, setFormData] = useState<ClienteFormData>({
        name: '',
        email: null,
        phone: null,
        whatsapp: null,
        birth_date: null,
        observation: null,
    });


    // Preencher formulário ao carregar dados do cliente para edição
    useEffect(() => {
        if (isEditing && clienteData) {
            setFormData({
                name: clienteData.name,
                email: clienteData.email ?? null,
                phone: clienteData.phone ?? null,
                whatsapp: clienteData.whatsapp ?? null,
                birth_date: clienteData.birth_date ?? null,
                observation: clienteData.observation ?? null,
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

        if (!formData.name.trim()) {
            setSubmitError('O nome do cliente é obrigatório.');
            return;
        }

        try {
            setIsSaving(true);

            await saveCliente.mutateAsync({
                id: isEditing ? Number(id) : undefined,
                data: formData,
            });

            navigate('/clientes', { replace:true });
        } catch (err) {
            if (err instanceof AxiosError) {
                setSubmitError(err.response?.data?.message || 'Erro ao salvar cliente');
            } else {
                setSubmitError('Erro ao salvar cliente');
            }
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

    if (
        (!isEditing && !hasPermission(Permissions.CLIENTES_CREATE)) ||
        (isEditing && !hasPermission(Permissions.CLIENTES_UPDATE))
        ) {
        return (
            <div className="flex items-center justify-center min-h-screen">
            <div className="text-red-500">
                Você não tem permissão para acessar esta página.
            </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    {hasPermission(Permissions.CLIENTES_VIEW) && (
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/clientes')}
                        className="mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar
                    </Button>
                    )}
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
                                    <label className="block text-sm font-medium mb-2" htmlFor="phone">
                                        Telefone
                                    </label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formData.phone || ''}
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
                                <label className="block text-sm font-medium mb-2" htmlFor="birth_date">
                                    Data de Nascimento
                                </label>
                                <Input
                                    id="birth_date"
                                    name="birth_date"
                                    type="date"
                                    value={formData.birth_date || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                            {/* Observações */}
                            <div>
                                <label className="block text-sm font-medium mb-2" htmlFor="observation">
                                    Observações
                                </label>
                                <Textarea // Usando o componente Textarea
                                    id="observation"
                                    name="observation"
                                    className="w-full min-h-[100px]"
                                    value={formData.observation || ''}
                                    onChange={handleInputChange}
                                    placeholder="Informações adicionais sobre o cliente..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Botões de Ação */}
                    <div className="mt-6 flex gap-4">
                        {((!isEditing && hasPermission(Permissions.CLIENTES_CREATE)) ||
                        (isEditing && hasPermission(Permissions.CLIENTES_UPDATE))) && (
                            <Button type="submit" disabled={isSaving}>
                                {isSaving
                                ? 'Salvando...'
                                : isEditing
                                    ? 'Atualizar Cliente'
                                    : 'Cadastrar Cliente'}
                            </Button>
                        )}
                        {(hasPermission(Permissions.CLIENTES_VIEW)) && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/clientes')}
                            >
                                Cancelar
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
