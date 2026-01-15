import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAtendimento, useListModels } from '@/hooks/useAtendimentos'; // Atualizado para useListModels
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Importar componentes Select
import { Textarea } from '@/components/ui/textarea'; // Usar Textarea do shadcn/ui
import type { Atendimento, AtendimentoFormData, CustomField, TipoAtendimento, ListModel, ListItem, FieldSection } from '@/types'; // Importar todos os tipos necessários
import { AxiosError } from 'axios';

// Definir AtendimentoFormData com tipo_atendimento_id
export interface AtendimentoFormData {
    patient_name: string;
    birth_date: string;
    attendance_date: string;
    treatment_focus: string | null;
    observations: string | null;
    tables_needed: number | null;
    lines_to_clean: number | null;
    fractals_percent: number | null;
    treatment_duration_days: number | null;
    has_directives: boolean;
    has_ancestralidade: boolean;
    has_rco: boolean;
    tipo_atendimento_id: number | undefined; // Adicionado
    custom_data: Record<string, any>; // Pode ser mais específico se souber os tipos
    items: { list_item_id: number; quantity: number | undefined }[];
}

export default function AtendimentoForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const { data: atendimento, isLoading: isLoadingAtendimento } = useAtendimento(id ? Number(id) : undefined);
    const { data: allListModels } = useListModels(); // Renomeado para allListModels

    // Estados para dados do formulário e controle
    const [formData, setFormData] = useState<AtendimentoFormData>({
        patient_name: '',
        birth_date: '',
        attendance_date: new Date().toISOString().split('T')[0],
        treatment_focus: null, // Inicializado como null
        observations: null, // Inicializado como null
        tables_needed: null,
        lines_to_clean: null,
        fractals_percent: null,
        treatment_duration_days: null,
        has_directives: false,
        has_ancestralidade: false,
        has_rco: false,
        tipo_atendimento_id: undefined, // Inicializado como undefined
        custom_data: {},
        items: [],
    });

    const [selectedTipoId, setSelectedTipoId] = useState<number | undefined>(undefined);
    const [customFieldsBySection, setCustomFieldsBySection] = useState<Record<string, CustomField[]>>({});
    const [availableTipos, setAvailableTipos] = useState<TipoAtendimento[]>([]);
    const [availableListItems, setAvailableListItems] = useState<ListItem[]>([]); // Itens permitidos para o usuário
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);

    // Estado para itens selecionados no formulário (Map para gerenciar quantidade)
    const [selectedItemsMap, setSelectedItemsMap] = useState<Map<number, number | undefined>>(new Map());

    // Carregar permissões do usuário (tipos, campos, listas, itens)
    useEffect(() => {
        const fetchMyPermissions = async () => {
            try {
                setIsLoadingPermissions(true);
                const { data } = await api.get('/me/atendimento-permissions');

                setAvailableTipos(data.tipos);
                setAvailableListItems(data.items); // Armazenar itens disponíveis

                // Organizar campos por seção
                const fieldsBySection: Record<string, CustomField[]> = {};
                data.fields.forEach((field: CustomField) => {
                    const sectionName = field.section?.name || 'Outros Campos'; // Usar 'Outros Campos' para campos sem seção
                    if (!fieldsBySection[sectionName]) {
                        fieldsBySection[sectionName] = [];
                    }
                    fieldsBySection[sectionName].push(field);
                });
                setCustomFieldsBySection(fieldsBySection);

            } catch (err) {
                console.error('Erro ao carregar permissões:', err);
                setError('Não foi possível carregar as permissões do usuário.');
            } finally {
                setIsLoadingPermissions(false);
            }
        };
        fetchMyPermissions();
    }, []);

    // Preencher formulário ao editar ou quando o atendimento é carregado
    useEffect(() => {
        if (isEditing && atendimento && !isLoadingPermissions) { // Esperar permissões para garantir que tipos e campos estejam carregados
            setFormData({
                patient_name: atendimento.patient_name,
                birth_date: atendimento.birth_date,
                attendance_date: atendimento.attendance_date,
                treatment_focus: atendimento.treatment_focus,
                observations: atendimento.observations,
                tables_needed: atendimento.tables_needed,
                lines_to_clean: atendimento.lines_to_clean,
                fractals_percent: atendimento.fractals_percent,
                treatment_duration_days: atendimento.treatment_duration_days,
                has_directives: atendimento.has_directives,
                has_ancestralidade: atendimento.has_ancestralidade,
                has_rco: atendimento.has_rco,
                tipo_atendimento_id: atendimento.tipo_atendimento_id, // Preencher tipo de atendimento
                custom_data: atendimento.custom_data || {},
                items: [], // Será preenchido via selectedItemsMap
            });

            setSelectedTipoId(atendimento.tipo_atendimento_id); // Definir o tipo selecionado

            if (atendimento.items) {
                const itemsMap = new Map<number, number | undefined>();
                atendimento.items.forEach((item) => {
                    itemsMap.set(item.list_item_id, item.quantity || undefined);
                });
                setSelectedItemsMap(itemsMap);
            }
        }
    }, [atendimento, isEditing, isLoadingPermissions]); // Adicionar isLoadingPermissions como dependência

    // Filtrar ListModels e ListItems com base no tipo de atendimento selecionado
    const filteredListModels = useMemo(() => {
        if (!selectedTipoId || !allListModels) return [];
        const selectedTipo = availableTipos.find(t => t.id === selectedTipoId);
        if (!selectedTipo) return [];

        // Filtrar ListModels que estão vinculadas ao tipo de atendimento selecionado
        // E que contêm ListItems que o usuário tem permissão
        return allListModels.filter(listModel =>
            listModel.items?.some(item =>
                availableListItems.some(availableItem => availableItem.id === item.id)
            )
        ).map(listModel => ({
            ...listModel,
            items: listModel.items?.filter(item =>
                availableListItems.some(availableItem => availableItem.id === item.id)
            ) || []
        }));
    }, [selectedTipoId, allListModels, availableTipos, availableListItems]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let newValue: string | number | boolean | null = value;

        if (type === 'checkbox') {
            newValue = (e.target as HTMLInputElement).checked;
        } else if (type === 'number') {
            newValue = value === '' ? null : Number(value);
        } else if (value === '') {
            newValue = null; // Para campos de texto/textarea vazios, enviar null
        }

        setFormData(prev => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleTipoAtendimentoChange = (value: string) => {
        const tipoId = Number(value);
        setSelectedTipoId(tipoId);
        setFormData(prev => ({ ...prev, tipo_atendimento_id: tipoId }));
        // TODO: Se os campos customizados e listas dependem do tipo,
        // você precisaria recarregar as permissões ou filtrar os customFieldsBySection e availableListItems aqui.
        // Por enquanto, estamos carregando tudo de /me/atendimento-permissions e exibindo o que o usuário tem acesso.
        // A lógica atual do backend já filtra os campos e listas que o usuário tem permissão através dos tipos.
        // Então, se o usuário selecionar um tipo, ele só verá os campos/listas que estão vinculados a ESSE TIPO
        // E que ele tem permissão.
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSaving(true);

        // Validar se um tipo de atendimento foi selecionado
        if (!formData.tipo_atendimento_id) {
            setError('Por favor, selecione um Tipo de Atendimento.');
            setIsSaving(false);
            return;
        }

        const itemsPayload = Array.from(selectedItemsMap.entries()).map(([list_item_id, quantity]) => ({
            list_item_id,
            quantity: quantity === undefined ? null : quantity, // Enviar null se não houver quantidade
        }));

        const payload = { ...formData, items: itemsPayload };

        try {
            if (isEditing) {
                await api.put(`/atendimentos/${id}`, payload);
            } else {
                await api.post('/atendimentos', payload);
            }
            navigate('/atendimentos');
        } catch (err) {
            if (err instanceof AxiosError) {
                // Melhorar a exibição de erros de validação do Laravel
                const backendErrors = err.response?.data?.errors;
                if (backendErrors) {
                    const errorMessages = Object.values(backendErrors).flat().join(' ');
                    setError(`Erro de validação: ${errorMessages}`);
                } else {
                    setError(err.response?.data?.message || 'Erro ao salvar atendimento');
                }
            } else {
                setError('Erro ao salvar atendimento');
            }
        } finally {
            setIsSaving(false);
        }
    };

    const toggleItem = (itemId: number, hasQuantity: boolean) => {
        const newMap = new Map(selectedItemsMap);
        if (newMap.has(itemId)) {
            newMap.delete(itemId);
        } else {
            newMap.set(itemId, hasQuantity ? 1 : undefined); // Se tem quantidade, inicia com 1
        }
        setSelectedItemsMap(newMap);
    };

    const updateQuantity = (itemId: number, quantity: number) => {
        const newMap = new Map(selectedItemsMap);
        newMap.set(itemId, quantity);
        setSelectedItemsMap(newMap);
    };

    // Atualizar campo dinâmico
    const updateCustomField = (slug: string, value: any) => { // 'any' aqui é aceitável para flexibilidade
        setFormData({
            ...formData,
            custom_data: {
                ...formData.custom_data,
                [slug]: value,
            },
        });
    };

    // Renderizar campo dinâmico baseado no tipo
    const renderCustomField = (field: CustomField) => {
        const value = formData.custom_data?.[field.slug];
        const commonProps = {
            name: field.slug,
            onChange: (e: any) => updateCustomField(field.slug, e.target.value),
            required: field.is_required,
            className: "w-full",
        };

        switch (field.type) {
            case 'text':
                return <Input {...commonProps} value={value || ''} />;
            case 'number':
                return (
                    <Input
                        {...commonProps}
                        type="number"
                        value={value ?? ''} // Exibe 0 se for 0, '' se null/undefined
                        onChange={(e) => updateCustomField(field.slug, e.target.value === '' ? null : Number(e.target.value))}
                    />
                );
            case 'checkbox':
                return (
                    <input
                        type="checkbox"
                        checked={value || false}
                        onChange={(e) => updateCustomField(field.slug, e.target.checked)}
                        className="w-4 h-4"
                        {...(field.is_required && { required: true })} // Adiciona required apenas se for true
                    />
                );
            case 'select':
                return (
                    <Select
                        value={value || ''}
                        onValueChange={(val) => updateCustomField(field.slug, val)}
                        required={field.is_required}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">Selecione...</SelectItem>
                            {field.options?.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            case 'textarea':
                return (
                    <Textarea
                        {...commonProps}
                        value={value || ''}
                        onChange={(e) => updateCustomField(field.slug, e.target.value)}
                        className="w-full border rounded-lg p-2 min-h-[100px]"
                    />
                );
            case 'date':
                return (
                    <Input
                        {...commonProps}
                        type="date"
                        value={value || ''}
                        onChange={(e) => updateCustomField(field.slug, e.target.value === '' ? null : e.target.value)}
                    />
                );
            default:
                return null;
        }
    };

    if (isLoadingPermissions || (isEditing && isLoadingAtendimento)) {
        return <div className="text-center py-10">Carregando formulário...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">
                {isEditing ? 'Editar Atendimento' : 'Novo Atendimento'}
            </h1>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* SELEÇÃO DE TIPO DE ATENDIMENTO */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tipo de Atendimento *</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Select
                            value={selectedTipoId?.toString() || ''}
                            onValueChange={handleTipoAtendimentoChange}
                            required
                            disabled={isEditing} // Desabilitar edição do tipo de atendimento
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione o Tipo de Atendimento" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableTipos.map((tipo) => (
                                    <SelectItem key={tipo.id} value={tipo.id.toString()}>
                                        {tipo.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {isEditing && <p className="text-sm text-gray-500 mt-2">O tipo de atendimento não pode ser alterado após a criação.</p>}
                    </CardContent>
                </Card>

                {/* CAMPOS OBRIGATÓRIOS */}
                <Card>
                    <CardHeader>
                        <CardTitle>Dados do Paciente</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Nome do Paciente *</label>
                            <Input
                                name="patient_name"
                                value={formData.patient_name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Data de Nascimento *</label>
                                <Input
                                    name="birth_date"
                                    type="date"
                                    value={formData.birth_date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Data do Atendimento *</label>
                                <Input
                                    name="attendance_date"
                                    type="date"
                                    value={formData.attendance_date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Foco do Tratamento</label>
                            <Input
                                name="treatment_focus"
                                value={formData.treatment_focus || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Observações</label>
                            <Textarea
                                name="observations"
                                value={formData.observations || ''}
                                onChange={handleInputChange}
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Mesas Necessárias</label>
                                <Input
                                    name="tables_needed"
                                    type="number"
                                    value={formData.tables_needed ?? ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Linhas para Limpar</label>
                                <Input
                                    name="lines_to_clean"
                                    type="number"
                                    value={formData.lines_to_clean ?? ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Fractais (%)</label>
                                <Input
                                    name="fractals_percent"
                                    type="number"
                                    value={formData.fractals_percent ?? ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Duração do Tratamento (dias)</label>
                                <Input
                                    name="treatment_duration_days"
                                    type="number"
                                    value={formData.treatment_duration_days ?? ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex items-center gap-2 mt-7">
                                <input
                                    name="has_directives"
                                    type="checkbox"
                                    checked={formData.has_directives}
                                    onChange={handleInputChange}
                                    className="w-4 h-4"
                                />
                                <label className="text-sm font-medium">Tem Diretivas</label>
                            </div>
                            <div className="flex items-center gap-2 mt-7">
                                <input
                                    name="has_ancestralidade"
                                    type="checkbox"
                                    checked={formData.has_ancestralidade}
                                    onChange={handleInputChange}
                                    className="w-4 h-4"
                                />
                                <label className="text-sm font-medium">Tem Ancestralidade</label>
                            </div>
                            <div className="flex items-center gap-2 mt-7">
                                <input
                                    name="has_rco"
                                    type="checkbox"
                                    checked={formData.has_rco}
                                    onChange={handleInputChange}
                                    className="w-4 h-4"
                                />
                                <label className="text-sm font-medium">Tem RCO</label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* CAMPOS DINÂMICOS POR SEÇÃO */}
                {selectedTipoId && Object.entries(customFieldsBySection).map(([sectionName, fields]) => (
                    <Card key={sectionName}>
                        <CardHeader>
                            <CardTitle>{sectionName}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Array.isArray(fields) && fields.length > 0 ? (
                                fields
                                    .filter(field => field.active) // Apenas campos ativos
                                    .map((field) => (
                                        <div key={field.id}>
                                            <label className="block text-sm font-medium mb-2">
                                                {field.name} {field.is_required && '*'}
                                            </label>
                                            {renderCustomField(field)}
                                        </div>
                                    ))
                            ) : (
                                <p className="text-gray-500 text-sm">Nenhum campo nesta seção</p>
                            )}
                        </CardContent>
                    </Card>
                ))}

                {/* SELEÇÃO DE ITENS DAS LISTAS */}
                {selectedTipoId && filteredListModels && filteredListModels.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Selecionar Itens</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {filteredListModels.map((listModel) => (
                                <div key={listModel.id}>
                                    <h3 className="font-semibold text-lg mb-3">{listModel.name}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {listModel.items?.map((item) => (
                                            <div
                                                key={item.id}
                                                className={`border rounded-lg p-3 cursor-pointer transition flex items-center justify-between ${
                                                    selectedItemsMap.has(item.id)
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-blue-300'
                                                }`}
                                                onClick={() => toggleItem(item.id, item.has_quantity)}
                                            >
                                                <span>{item.name}</span>
                                                {item.has_quantity && selectedItemsMap.has(item.id) && (
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={selectedItemsMap.get(item.id) || 1}
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            updateQuantity(item.id, Number(e.target.value));
                                                        }}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="w-20"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* BOTÕES DE AÇÃO */}
                <div className="flex gap-4">
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => navigate('/atendimentos')}>
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    );
}
