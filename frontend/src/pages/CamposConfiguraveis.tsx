// src/pages/CamposConfiguraveis.tsx
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Textarea, // Adicionado para campos de texto longo
} from '@/components/ui'; // Ajuste o caminho conforme sua estrutura de UI
import {
    useCreateCustomField,
    useCreateFieldSection,
    useDeleteCustomField,
    useDeleteFieldSection,
    useFieldSections,
} from '@/hooks/useCamposConfiguraveis';
import type { CustomFieldFormData, FieldSectionFormData } from '@/types';
import { AxiosError } from 'axios'; // Importar AxiosError
import { Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

// Definir os tipos de campo para o select (mantido para o estado do formulário)
type CustomFieldType = 'text' | 'number' | 'checkbox' | 'select' | 'textarea' | 'date';

export default function CamposConfiguraveis() {
    const { data: sections, isLoading, isError, error } = useFieldSections();
    const axiosError = error as AxiosError<{ message?: string }> | null;
    const createSectionMutation = useCreateFieldSection();
    const deleteSectionMutation = useDeleteFieldSection();
    const createFieldMutation = useCreateCustomField();
    const deleteFieldMutation = useDeleteCustomField();

    const [activeTab, setActiveTab] = useState<'sections' | 'fields'>('sections');
    const [newSectionFormData, setNewSectionFormData] = useState<FieldSectionFormData>({
        name: '',
        slug: '',
        active: true,
    });
    const [newFieldFormData, setNewFieldFormData] = useState<CustomFieldFormData>({
        section_id: null,
        name: '',
        slug: '',
        type: 'text',
        options: '',
        is_required: false,
        active: true,
    });
    const [formError, setFormError] = useState<string | null>(null);

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    };

    const handleSectionNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setNewSectionFormData({
            ...newSectionFormData,
            name,
            slug: generateSlug(name),
        });
    };

    const handleFieldNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setNewFieldFormData({
            ...newFieldFormData,
            name,
            slug: generateSlug(name),
        });
    };

    const handleAddSection = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!newSectionFormData.name.trim() || !newSectionFormData.slug.trim()) {
            setFormError('Nome e Slug da seção são obrigatórios.');
            return;
        }

        try {
            await createSectionMutation.mutateAsync({
                ...newSectionFormData,
                order: sections ? sections.length : 0, // Define a ordem como o último
            });
            setNewSectionFormData({ name: '', slug: '', active: true });
        } catch (err) {
            const axiosErr = err as AxiosError<{ message?: string }>;
            setFormError(axiosErr.response?.data?.message || 'Erro ao criar seção. Verifique se o slug já existe.');
        }
    };

    const handleAddField = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!newFieldFormData.name.trim() || !newFieldFormData.slug.trim() || newFieldFormData.section_id === null) {
            setFormError('Nome, Slug e Seção do campo são obrigatórios.');
            return;
        }
        if (newFieldFormData.type === 'select' && !newFieldFormData.options.trim()) {
            setFormError('Opções são obrigatórias para campos do tipo "Select".');
            return;
        }

        try {
            const fieldPayload = {
                ...newFieldFormData,
                section_id: newFieldFormData.section_id!, // Garantido por validação
                options:
                    newFieldFormData.type === 'select'
                        ? newFieldFormData.options
                            .split(',')
                            .map(o => o.trim())
                            .filter(o => o !== '')
                        : undefined,
                order: sections?.find(s => s.id === newFieldFormData.section_id)?.fields?.length || 0,
            };
            await createFieldMutation.mutateAsync(fieldPayload);
            setNewFieldFormData({
                section_id: null,
                name: '',
                slug: '',
                type: 'text',
                options: '',
                is_required: false,
                active: true,
            });
        } catch (err) {
            const axiosErr = err as AxiosError<{ message?: string }>;
            setFormError(axiosErr.response?.data?.message || 'Erro ao criar campo. Verifique se o slug já existe na seção.');
        }
    };

    const handleDeleteSection = async (sectionId: number) => {
        if (!confirm('Tem certeza que deseja deletar esta seção e todos os seus campos?')) return;
        setFormError(null);
        try {
            await deleteSectionMutation.mutateAsync(sectionId);
        } catch (err) {
            const axiosErr = err as AxiosError<{ message?: string }>;
            setFormError(axiosErr.response?.data?.message || 'Erro ao deletar seção. Verifique se não há atendimentos vinculados.');
        }
    };

    const handleDeleteField = async (fieldId: number) => {
        if (!confirm('Tem certeza que deseja deletar este campo?')) return;
        setFormError(null);

        try {
            await deleteFieldMutation.mutateAsync(fieldId);
        } catch (err) {
            const axiosErr = err as AxiosError<{ message?: string }>;
            setFormError(
                axiosErr.response?.data?.message ||
                'Erro ao deletar campo. Verifique se não há atendimentos vinculados.'
            );
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Carregando campos configuráveis...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">
                    Erro ao carregar dados:{' '}
                    {axiosError?.response?.data?.message || axiosError?.message || 'Erro desconhecido'}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Campos Configuráveis</h1>
                    <p className="text-gray-600 mt-2">Crie e gerencie os campos que serão utilizados nos atendimentos</p>
                </div>

                {/* Error Message */}
                {formError || axiosError?.response?.data?.message || axiosError?.message || 'Ocorreu um erro.'}

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <Button
                        variant={activeTab === 'sections' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('sections')}
                    >
                        Seções
                    </Button>
                    <Button
                        variant={activeTab === 'fields' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('fields')}
                    >
                        Campos
                    </Button>
                </div>

                {/* Sections Tab */}
                {activeTab === 'sections' && (
                    <div className="space-y-6">
                        {/* Add Section Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Nova Seção</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleAddSection} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            type="text"
                                            placeholder="Nome da seção"
                                            value={newSectionFormData.name}
                                            onChange={handleSectionNameChange}
                                            required
                                        />
                                        <Input
                                            type="text"
                                            placeholder="Slug (ex: informacoes-tratamento)"
                                            value={newSectionFormData.slug}
                                            onChange={(e) => setNewSectionFormData({ ...newSectionFormData, slug: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" disabled={createSectionMutation.isPending}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        {createSectionMutation.isPending ? 'Criando...' : 'Criar Seção'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Sections List */}
                        <div className="space-y-4">
                            {sections && sections.length > 0 ? (
                                sections.map((section) => (
                                    <Card key={section.id}>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-lg font-bold text-gray-900">
                                                {section.name}
                                                <span className="text-sm text-gray-600 ml-2 font-normal">(Slug: {section.slug})</span>
                                            </CardTitle>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDeleteSection(section.id)}
                                                disabled={deleteSectionMutation.isPending}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </CardHeader>
                                        <CardContent>
                                            {section.fields && section.fields.length > 0 ? (
                                                <div className="mt-4 pt-4 border-t border-gray-200">
                                                    <p className="text-sm font-medium text-gray-700 mb-3">Campos nesta seção:</p>
                                                    <ul className="space-y-2">
                                                        {section.fields.map((field) => (
                                                            <li key={field.id} className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded">
                                                                <div>
                                                                    <span className="font-medium">{field.name}</span>
                                                                    <span className="text-gray-600 ml-2">({field.type})</span>
                                                                    {field.is_required && <span className="ml-2 text-red-500 text-xs">(Obrigatório)</span>}
                                                                    {!field.active && <span className="ml-2 text-yellow-600 text-xs">(Inativo)</span>}
                                                                </div>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteField(field.id)}
                                                                    disabled={deleteFieldMutation.isPending}
                                                                >
                                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                                </Button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 text-sm mt-2">Nenhum campo nesta seção.</p>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">Nenhuma seção cadastrada ainda.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Fields Tab */}
                {activeTab === 'fields' && (
                    <div className="space-y-6">
                        {/* Add Field Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Novo Campo</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleAddField} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Select
                                            value={newFieldFormData.section_id?.toString() || ''}
                                            onValueChange={(value) => setNewFieldFormData({ ...newFieldFormData, section_id: value ? Number(value) : null })}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione uma seção" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">Selecione uma seção</SelectItem>
                                                {sections?.map((section) => (
                                                    <SelectItem key={section.id} value={section.id.toString()}>
                                                        {section.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Select
                                            value={newFieldFormData.type}
                                            onValueChange={(value) => setNewFieldFormData({ ...newFieldFormData, type: value as CustomFieldType })}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Tipo de campo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="text">Texto</SelectItem>
                                                <SelectItem value="number">Número</SelectItem>
                                                <SelectItem value="checkbox">Checkbox</SelectItem>
                                                <SelectItem value="select">Select</SelectItem>
                                                <SelectItem value="textarea">Textarea</SelectItem>
                                                <SelectItem value="date">Data</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            type="text"
                                            placeholder="Nome do campo"
                                            value={newFieldFormData.name}
                                            onChange={handleFieldNameChange}
                                            required
                                        />
                                        <Input
                                            type="text"
                                            placeholder="Slug (ex: duracao-tratamento)"
                                            value={newFieldFormData.slug}
                                            onChange={(e) => setNewFieldFormData({ ...newFieldFormData, slug: e.target.value })}
                                            required
                                        />
                                    </div>

                                    {newFieldFormData.type === 'select' && (
                                        <Textarea // Usando Textarea para opções
                                            placeholder="Opções (separadas por vírgula)"
                                            value={newFieldFormData.options}
                                            onChange={(e) => setNewFieldFormData({ ...newFieldFormData, options: e.target.value })}
                                            required={newFieldFormData.type === 'select'}
                                        />
                                    )}

                                    <label className="flex items-center gap-2">
                                        <Input
                                            type="checkbox"
                                            checked={newFieldFormData.is_required}
                                            onChange={(e) => setNewFieldFormData({ ...newFieldFormData, is_required: e.target.checked })}
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                                        />
                                        <span className="text-gray-700">Campo obrigatório</span>
                                    </label>

                                    <Button type="submit" disabled={createFieldMutation.isPending}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        {createFieldMutation.isPending ? 'Criando...' : 'Criar Campo'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Fields List (Global, agrupado por seção) */}
                        <div className="space-y-4">
                            {sections && sections.length > 0 ? (
                                sections.map((section) =>
                                    section.fields && section.fields.length > 0 ? (
                                        <Card key={section.id}>
                                            <CardHeader>
                                                <CardTitle className="text-lg font-bold text-gray-900">
                                                    Campos da Seção: {section.name}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-2">
                                                    {section.fields.map((field) => (
                                                        <div key={field.id} className="flex justify-between items-center bg-gray-50 p-4 rounded">
                                                            <div>
                                                                <p className="font-medium text-gray-900">{field.name}</p>
                                                                <p className="text-sm text-gray-600">
                                                                    Tipo: {field.type} | Obrigatório: {field.is_required ? 'Sim' : 'Não'} | Ativo: {field.active ? 'Sim' : 'Não'}
                                                                </p>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteField(field.id)}
                                                                disabled={deleteFieldMutation.isPending}
                                                            >
                                                                <Trash2 className="w-4 h-4 text-red-600" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ) : null // Não renderiza se a seção não tiver campos
                                )
                            ) : (
                                <p className="text-gray-500 text-center py-4">Nenhum campo cadastrado ainda.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
