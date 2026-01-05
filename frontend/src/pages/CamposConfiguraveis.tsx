import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { FieldSection, CustomField } from '@/types';

export function CamposConfiguraveis() {
    const [sections, setSections] = useState<FieldSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'sections' | 'fields'>('sections');

    // Form states
    const [newSection, setNewSection] = useState({ name: '', slug: '' });
    const [newField, setNewField] = useState({
        section_id: 0,
        name: '',
        slug: '',
        type: 'text' as const,
        options: '',
        is_required: false,
    });

    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        try {
        setLoading(true);
        const { data } = await api.get('/field-sections');
        setSections(data);
        setError(null);
        } catch (err) {
        setError('Erro ao carregar seções');
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    const handleAddSection = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSection.name || !newSection.slug) return;

        try {
        const { data } = await api.post('/field-sections', {
            ...newSection,
            order: sections.length,
            active: true,
        });
        setSections([...sections, data]);
        setNewSection({ name: '', slug: '' });
        } catch (err) {
        setError('Erro ao criar seção');
        console.error(err);
        }
    };

    const handleAddField = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newField.name || !newField.slug || newField.section_id === 0) return;

        try {
        const fieldData = {
            ...newField,
            options: newField.type === 'select' ? newField.options.split(',').map(o => o.trim()) : null,
        };

        const { data } = await api.post('/custom-fields', fieldData);

        setSections(sections.map(section =>
            section.id === newField.section_id
            ? { ...section, fields: [...(section.fields || []), data] }
            : section
        ));

        setNewField({
            section_id: 0,
            name: '',
            slug: '',
            type: 'text',
            options: '',
            is_required: false,
        });
        } catch (err) {
        setError('Erro ao criar campo');
        console.error(err);
        }
    };

    const handleDeleteSection = async (sectionId: number) => {
        if (!confirm('Tem certeza que deseja deletar esta seção e todos seus campos?')) return;

        try {
        await api.delete(`/field-sections/${sectionId}`);
        setSections(sections.filter(s => s.id !== sectionId));
        } catch (err) {
        setError('Erro ao deletar seção');
        console.error(err);
        }
    };

    const handleDeleteField = async (fieldId: number, sectionId: number) => {
        if (!confirm('Tem certeza que deseja deletar este campo?')) return;

        try {
        await api.delete(`/custom-fields/${fieldId}`);
        setSections(sections.map(section =>
            section.id === sectionId
            ? { ...section, fields: section.fields?.filter(f => f.id !== fieldId) }
            : section
        ));
        } catch (err) {
        setError('Erro ao deletar campo');
        console.error(err);
        }
    };

    if (loading) {
        return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-gray-500">Carregando campos...</div>
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
            {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
            </div>
            )}

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
            <button
                onClick={() => setActiveTab('sections')}
                className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'sections'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
            >
                Seções
            </button>
            <button
                onClick={() => setActiveTab('fields')}
                className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'fields'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
            >
                Campos
            </button>
            </div>

            {/* Sections Tab */}
            {activeTab === 'sections' && (
            <div className="space-y-6">
                {/* Add Section Form */}
                <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Nova Seção</h2>
                <form onSubmit={handleAddSection} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Nome da seção"
                        value={newSection.name}
                        onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                        type="text"
                        placeholder="Slug (ex: informacoes-tratamento)"
                        value={newSection.slug}
                        onChange={(e) => setNewSection({ ...newSection, slug: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    </div>
                    <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                    Criar Seção
                    </button>
                </form>
                </div>

                {/* Sections List */}
                <div className="space-y-4">
                {sections.map((section) => (
                    <div key={section.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                        <h3 className="text-lg font-bold text-gray-900">{section.name}</h3>
                        <p className="text-sm text-gray-600">{section.slug}</p>
                        </div>
                        <button
                        onClick={() => handleDeleteSection(section.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                        >
                        Deletar
                        </button>
                    </div>

                    {/* Fields in Section */}
                    {section.fields && section.fields.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium text-gray-700 mb-3">Campos nesta seção:</p>
                        <ul className="space-y-2">
                            {section.fields.map((field) => (
                            <li key={field.id} className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded">
                                <div>
                                <span className="font-medium">{field.name}</span>
                                <span className="text-gray-600 ml-2">({field.type})</span>
                                </div>
                                <button
                                onClick={() => handleDeleteField(field.id, section.id)}
                                className="text-red-600 hover:text-red-700 text-xs"
                                >
                                Remover
                                </button>
                            </li>
                            ))}
                        </ul>
                        </div>
                    )}
                    </div>
                ))}
                </div>
            </div>
            )}

            {/* Fields Tab */}
            {activeTab === 'fields' && (
            <div className="space-y-6">
                {/* Add Field Form */}
                <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Novo Campo</h2>
                <form onSubmit={handleAddField} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                    <select
                        value={newField.section_id}
                        onChange={(e) => setNewField({ ...newField, section_id: Number(e.target.value) })}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value={0}>Selecione uma seção</option>
                        {sections.map((section) => (
                        <option key={section.id} value={section.id}>
                            {section.name}
                        </option>
                        ))}
                    </select>

                    <select
                        value={newField.type}
                        onChange={(e) => setNewField({ ...newField, type: e.target.value as any })}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="text">Texto</option>
                        <option value="number">Número</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="select">Select</option>
                        <option value="textarea">Textarea</option>
                        <option value="date">Data</option>
                    </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Nome do campo"
                        value={newField.name}
                        onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                        type="text"
                        placeholder="Slug (ex: duracao-tratamento)"
                        value={newField.slug}
                        onChange={(e) => setNewField({ ...newField, slug: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    </div>

                    {newField.type === 'select' && (
                    <input
                        type="text"
                        placeholder="Opções (separadas por vírgula)"
                        value={newField.options}
                        onChange={(e) => setNewField({ ...newField, options: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg w-full"
                    />
                    )}

                    <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={newField.is_required}
                        onChange={(e) => setNewField({ ...newField, is_required: e.target.checked })}
                        className="w-4 h-4"
                    />
                    <span className="text-gray-700">Campo obrigatório</span>
                    </label>

                    <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                    Criar Campo
                    </button>
                </form>
                </div>

                {/* Fields List */}
                <div className="space-y-4">
                {sections.map((section) =>
                    section.fields && section.fields.length > 0 ? (
                    <div key={section.id} className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">{section.name}</h3>
                        <div className="space-y-2">
                        {section.fields.map((field) => (
                            <div key={field.id} className="flex justify-between items-center bg-gray-50 p-4 rounded">
                            <div>
                                <p className="font-medium text-gray-900">{field.name}</p>
                                <p className="text-sm text-gray-600">
                                Tipo: {field.type} | Obrigatório: {field.is_required ? 'Sim' : 'Não'}
                                </p>
                            </div>
                            <button
                                onClick={() => handleDeleteField(field.id, section.id)}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                            >
                                Deletar
                            </button>
                            </div>
                        ))}
                        </div>
                    </div>
                    ) : null
                )}
                </div>
            </div>
            )}
        </div>
        </div>
    );
}
