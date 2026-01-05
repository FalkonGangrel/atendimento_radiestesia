import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import type { FieldSection, CustomField, User } from '@/types';

export function PermissoesUsuario() {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [sections, setSections] = useState<FieldSection[]>([]);
    const [selectedFields, setSelectedFields] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (userId) {
        fetchData();
        }
    }, [userId]);

    const fetchData = async () => {
        try {
        setLoading(true);

        // Fetch user
        const userRes = await api.get(`/users/${userId}`);
        setUser(userRes.data);

        // Fetch sections with fields
        const sectionsRes = await api.get('/field-sections');
        setSections(sectionsRes.data);

        // Fetch user permissions
        const permRes = await api.get(`/users/${userId}/permissions`);
        const fieldIds = permRes.data.map((p: any) => p.custom_field_id);
        setSelectedFields(fieldIds);

        setError(null);
        } catch (err) {
        setError('Erro ao carregar dados');
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    const handleToggleField = (fieldId: number) => {
        setSelectedFields((prev) =>
        prev.includes(fieldId) ? prev.filter((id) => id !== fieldId) : [...prev, fieldId]
        );
    };

    const handleSavePermissions = async () => {
        if (!userId) return;

        try {
        setSaving(true);
        await api.post(`/users/${userId}/permissions/sync`, {
            field_ids: selectedFields,
        });
        setError(null);
        alert('Permissões salvas com sucesso!');
        } catch (err) {
        setError('Erro ao salvar permissões');
        console.error(err);
        } finally {
        setSaving(false);
        }
    };

    if (loading) {
        return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-gray-500">Carregando...</div>
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
            <button
                onClick={() => navigate('/master/usuarios')}
                className="text-blue-600 hover:text-blue-700 mb-4 text-sm"
            >
                ← Voltar
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Permissões de Campos</h1>
            {user && (
                <p className="text-gray-600 mt-2">
                Usuário: <span className="font-medium">{user.name}</span> ({user.email})
                </p>
            )}
            </div>

            {/* Error Message */}
            {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
            </div>
            )}

            {/* Info Box */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
            <p>
                <strong>Nota:</strong> Os campos obrigatórios (Nome do Paciente, Data de Nascimento, Data do Atendimento,
                Foco do Tratamento e Observações) são automaticamente permitidos para todos os usuários.
            </p>
            </div>

            {/* Permissions */}
            <div className="space-y-6">
            {sections.map((section) => (
                <div key={section.id} className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{section.name}</h2>

                {section.fields && section.fields.length > 0 ? (
                    <div className="space-y-3">
                    {section.fields.map((field) => (
                        <label
                        key={field.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                        >
                        <input
                            type="checkbox"
                            checked={selectedFields.includes(field.id)}
                            onChange={() => handleToggleField(field.id)}
                            className="w-4 h-4"
                        />
                        <div>
                            <p className="font-medium text-gray-900">{field.name}</p>
                            <p className="text-xs text-gray-600">Tipo: {field.type}</p>
                        </div>
                        </label>
                    ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">Nenhum campo nesta seção</p>
                )}
                </div>
            ))}
            </div>

            {/* Save Button */}
            <div className="mt-8 flex gap-4">
            <button
                onClick={handleSavePermissions}
                disabled={saving}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
                {saving ? 'Salvando...' : 'Salvar Permissões'}
            </button>
            <button
                onClick={() => navigate('/master/usuarios')}
                className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            >
                Cancelar
            </button>
            </div>
        </div>
        </div>
    );
}
