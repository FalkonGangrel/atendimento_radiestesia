import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAtendimento, useLists } from '@/hooks/useAtendimentos';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { AtendimentoFormData, CustomField } from '@/types';
import { AxiosError } from 'axios';

export default function AtendimentoForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const { data: atendimento } = useAtendimento(id ? Number(id) : undefined);
    const { data: lists } = useLists();

    // Estado para campos dinâmicos permitidos
    const [customFields, setCustomFields] = useState<Record<string, CustomField[]>>({});
    const [loadingFields, setLoadingFields] = useState(true);

    const [formData, setFormData] = useState<AtendimentoFormData>({
        patient_name: '',
        birth_date: '',
        attendance_date: new Date().toISOString().split('T')[0], // Data atual por padrão
        treatment_focus: '',
        observations: '',
        tables_needed: undefined,
        lines_to_clean: undefined,
        fractals_percent: undefined,
        treatment_duration_days: undefined,
        has_directives: false,
        has_ancestralidade: false,
        has_rco: false,
        custom_data: {},
        items: [],
    });

    const [selectedItems, setSelectedItems] = useState<Map<number, number | undefined>>(new Map());
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Carregar campos dinâmicos permitidos para o usuário
    useEffect(() => {
        const fetchCustomFields = async () => {
        try {
            setLoadingFields(true);
            const { data } = await api.get('/custom-fields/my-fields');
            setCustomFields(data);
        } catch (err) {
            console.error('Erro ao carregar campos customizados:', err);
        } finally {
            setLoadingFields(false);
        }
        };

        fetchCustomFields();
    }, []);

    // Preencher formulário ao editar
    useEffect(() => {
        if (atendimento) {
        setFormData({
            patient_name: atendimento.patient_name,
            birth_date: atendimento.birth_date,
            attendance_date: atendimento.attendance_date,
            treatment_focus: atendimento.treatment_focus || '',
            observations: atendimento.observations || '',
            tables_needed: atendimento.tables_needed,
            lines_to_clean: atendimento.lines_to_clean,
            fractals_percent: atendimento.fractals_percent,
            treatment_duration_days: atendimento.treatment_duration_days,
            has_directives: atendimento.has_directives,
            has_ancestralidade: atendimento.has_ancestralidade,
            has_rco: atendimento.has_rco,
            custom_data: atendimento.custom_data || {},
            items: [],
        });

        if (atendimento.items) {
            const itemsMap = new Map();
            atendimento.items.forEach((item) => {
            itemsMap.set(item.list_item_id, item.quantity);
            });
            setSelectedItems(itemsMap);
        }
        }
    }, [atendimento]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const items = Array.from(selectedItems.entries()).map(([list_item_id, quantity]) => ({
        list_item_id,
        quantity,
        }));

        const payload = { ...formData, items };

        try {
        if (isEditing) {
            await api.put(`/atendimentos/${id}`, payload);
        } else {
            await api.post('/atendimentos', payload);
        }
        navigate('/atendimentos');
        } catch (err) {
        if (err instanceof AxiosError) {
            setError(err.response?.data?.message || 'Erro ao salvar atendimento');
        } else {
            setError('Erro ao salvar atendimento');
        }
        } finally {
        setIsLoading(false);
        }
    };

    const toggleItem = (itemId: number, hasQuantity: boolean) => {
        const newMap = new Map(selectedItems);
        if (newMap.has(itemId)) {
        newMap.delete(itemId);
        } else {
        newMap.set(itemId, hasQuantity ? 1 : undefined);
        }
        setSelectedItems(newMap);
    };

    const updateQuantity = (itemId: number, quantity: number) => {
        const newMap = new Map(selectedItems);
        newMap.set(itemId, quantity);
        setSelectedItems(newMap);
    };

    // Atualizar campo dinâmico
    const updateCustomField = (slug: string, value: unknown) => {
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

        switch (field.type) {
        case 'text':
            return (
            <Input
                value={(value as string) || ''}
                onChange={(e) => updateCustomField(field.slug, e.target.value)}
                required={field.is_required}
            />
            );

        case 'number':
            return (
            <Input
                type="number"
                value={(value as number) || ''}
                onChange={(e) => updateCustomField(field.slug, Number(e.target.value))}
                required={field.is_required}
            />
            );

        case 'checkbox':
            return (
            <input
                type="checkbox"
                checked={(value as boolean) || false}
                onChange={(e) => updateCustomField(field.slug, e.target.checked)}
                className="w-4 h-4"
            />
            );

        case 'select':
            return (
            <select
                value={(value as string) || ''}
                onChange={(e) => updateCustomField(field.slug, e.target.value)}
                required={field.is_required}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
                <option value="">Selecione...</option>
                {field.options?.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
                ))}
            </select>
            );

        case 'textarea':
            return (
            <textarea
                value={(value as string) || ''}
                onChange={(e) => updateCustomField(field.slug, e.target.value)}
                required={field.is_required}
                className="w-full border rounded-lg p-2 min-h-[100px]"
            />
            );

        case 'date':
            return (
            <Input
                type="date"
                value={(value as string) || ''}
                onChange={(e) => updateCustomField(field.slug, e.target.value)}
                required={field.is_required}
            />
            );

        default:
            return null;
        }
    };

    if (loadingFields) {
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
            {/* CAMPOS OBRIGATÓRIOS */}
            <Card>
            <CardHeader>
                <CardTitle>Dados do Paciente (Obrigatórios)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                <label className="block text-sm font-medium mb-2">Nome do Paciente *</label>
                <Input
                    value={formData.patient_name}
                    onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                    required
                />
                </div>

                <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Data de Nascimento *</label>
                    <Input
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                    required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Data do Atendimento *</label>
                    <Input
                    type="date"
                    value={formData.attendance_date}
                    onChange={(e) => setFormData({ ...formData, attendance_date: e.target.value })}
                    required
                    />
                </div>
                </div>

                <div>
                <label className="block text-sm font-medium mb-2">Foco do Tratamento *</label>
                <Input
                    value={formData.treatment_focus}
                    onChange={(e) => setFormData({ ...formData, treatment_focus: e.target.value })}
                    required
                />
                </div>

                <div>
                <label className="block text-sm font-medium mb-2">Observações *</label>
                <textarea
                    className="w-full border rounded-lg p-2 min-h-[100px]"
                    value={formData.observations}
                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                    required
                />
                </div>
            </CardContent>
            </Card>

            {/* CAMPOS DINÂMICOS POR SEÇÃO */}
            {Object.entries(customFields).map(([sectionName, fields]) => (
            <Card key={sectionName}>
                <CardHeader>
                <CardTitle>{sectionName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                {Array.isArray(fields) && fields.length > 0 ? (
                    fields.map((field) => (
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
            {lists && lists.length > 0 && (
            <Card>
                <CardHeader>
                <CardTitle>Selecionar Itens</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                {lists.map((list) => (
                    <div key={list.id}>
                    <h3 className="font-semibold text-lg mb-3">{list.name}</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {list.items.map((item) => (
                        <div
                            key={item.id}
                            className={`border rounded-lg p-3 cursor-pointer transition ${
                            selectedItems.has(item.id)
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                            onClick={() => toggleItem(item.id, item.has_quantity)}
                        >
                            <div className="flex items-center justify-between">
                            <span>{item.name}</span>
                            {item.has_quantity && selectedItems.has(item.id) && (
                                <Input
                                type="number"
                                min="1"
                                value={selectedItems.get(item.id) || 1}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    updateQuantity(item.id, Number(e.target.value));
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-20"
                                />
                            )}
                            </div>
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
            <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/atendimentos')}>
                Cancelar
            </Button>
            </div>
        </form>
        </div>
    );
}
