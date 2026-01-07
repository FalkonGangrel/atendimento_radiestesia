import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import type { User, TipoAtendimento, CustomField, List } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';

export function PermissoesUsuario() {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);
    const [tipos, setTipos] = useState<TipoAtendimento[]>([]);
    const [selectedTipo, setSelectedTipo] = useState<number | null>(null);

    const [hasPermission, setHasPermission] = useState(false);
    const [availableFields, setAvailableFields] = useState<CustomField[]>([]);
    const [availableLists, setAvailableLists] = useState<List[]>([]);

    const [selectedFieldIds, setSelectedFieldIds] = useState<number[]>([]);
    const [selectedListIds, setSelectedListIds] = useState<number[]>([]);
    const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUser();
        fetchTipos();
    }, [userId]);

    useEffect(() => {
        if (selectedTipo) {
        fetchPermissions();
        }
    }, [selectedTipo]);

    const fetchUser = async () => {
        try {
        const { data } = await api.get(`/users/${userId}`);
        setUser(data);
        } catch (err) {
        setError('Erro ao carregar usuário');
        console.error(err);
        }
    };

    const fetchTipos = async () => {
        try {
        const { data } = await api.get('/tipos-atendimento');
        setTipos(data);
        } catch (err) {
        setError('Erro ao carregar tipos de atendimento');
        console.error(err);
        }
    };

    const fetchPermissions = async () => {
        if (!selectedTipo) return;

        try {
        setLoading(true);
        const { data } = await api.get(
            `/master/tipos-atendimento/${selectedTipo}/users/${userId}/permissions`
        );

        setHasPermission(data.has_permission);
        setAvailableFields(data.fields);
        setAvailableLists(data.lists);

        // Pré-selecionar campos/listas/itens já vinculados
        setSelectedFieldIds(data.fields.map((f: CustomField) => f.id));
        setSelectedListIds(data.lists.map((l: List) => l.id));

        const itemIds: number[] = [];
        data.lists.forEach((list: List) => {
            if (list.items) {
            list.items.forEach((item) => itemIds.push(item.id));
            }
        });
        setSelectedItemIds(itemIds);

        setError(null);
        } catch (err) {
        setError('Erro ao carregar permissões');
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!selectedTipo) return;

        try {
        setLoading(true);
        await api.post(
            `/master/tipos-atendimento/${selectedTipo}/users/${userId}/permissions/sync`,
            {
            has_permission: hasPermission,
            field_ids: selectedFieldIds,
            list_ids: selectedListIds,
            item_ids: selectedItemIds,
            }
        );

        alert('Permissões atualizadas com sucesso!');
        setError(null);
        } catch (err) {
        setError('Erro ao salvar permissões');
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    const toggleField = (fieldId: number) => {
        setSelectedFieldIds((prev) =>
        prev.includes(fieldId)
            ? prev.filter((id) => id !== fieldId)
            : [...prev, fieldId]
        );
    };

    const toggleList = (listId: number) => {
        setSelectedListIds((prev) =>
        prev.includes(listId)
            ? prev.filter((id) => id !== listId)
            : [...prev, listId]
        );
    };

    const toggleItem = (itemId: number) => {
        setSelectedItemIds((prev) =>
        prev.includes(itemId)
            ? prev.filter((id) => id !== itemId)
            : [...prev, itemId]
        );
    };

    if (!user) {
        return <div className="text-center py-10">Carregando usuário...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
            <Button
                variant="ghost"
                onClick={() => navigate('/master/usuarios')}
                className="mb-4"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
                Permissões de {user.name}
            </h1>
            <p className="text-gray-600 mt-2">
                Configure quais tipos de atendimento, campos e listas este atendente pode acessar
            </p>
            </div>

            {/* Error Message */}
            {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
            </div>
            )}

            {/* Seletor de Tipo */}
            <Card className="mb-6">
            <CardHeader>
                <CardTitle>Selecione o Tipo de Atendimento</CardTitle>
            </CardHeader>
            <CardContent>
                <select
                value={selectedTipo || ''}
                onChange={(e) => setSelectedTipo(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                <option value="">-- Selecione um tipo --</option>
                {tipos.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                    {tipo.nome}
                    </option>
                ))}
                </select>
            </CardContent>
            </Card>

            {selectedTipo && (
            <>
                {/* Permissão Geral */}
                <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Permissão Geral</CardTitle>
                </CardHeader>
                <CardContent>
                    <label className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={hasPermission}
                        onChange={(e) => setHasPermission(e.target.checked)}
                        className="w-5 h-5 rounded"
                    />
                    <span className="text-gray-700">
                        Permitir que {user.name} crie atendimentos deste tipo
                    </span>
                    </label>
                </CardContent>
                </Card>

                {/* Campos Customizados */}
                {availableFields.length > 0 && (
                <Card className="mb-6">
                    <CardHeader>
                    <CardTitle>Campos Customizados</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <div className="space-y-2">
                        {availableFields.map((field) => (
                        <label key={field.id} className="flex items-center gap-3">
                            <input
                            type="checkbox"
                            checked={selectedFieldIds.includes(field.id)}
                            onChange={() => toggleField(field.id)}
                            className="w-5 h-5 rounded"
                            />
                            <span className="text-gray-700">{field.name}</span>
                        </label>
                        ))}
                    </div>
                    </CardContent>
                </Card>
                )}

                {/* Listas */}
                {availableLists.length > 0 && (
                <Card className="mb-6">
                    <CardHeader>
                    <CardTitle>Listas e Itens</CardTitle>
                    </CardHeader>
                    <CardContent>
                    {availableLists.map((list) => (
                        <div key={list.id} className="mb-6">
                        <label className="flex items-center gap-3 mb-3">
                            <input
                            type="checkbox"
                            checked={selectedListIds.includes(list.id)}
                            onChange={() => toggleList(list.id)}
                            className="w-5 h-5 rounded"
                            />
                            <span className="font-bold text-gray-900">{list.name}</span>
                        </label>

                        {list.items && list.items.length > 0 && (
                            <div className="ml-8 space-y-2">
                            {list.items.map((item) => (
                                <label key={item.id} className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={selectedItemIds.includes(item.id)}
                                    onChange={() => toggleItem(item.id)}
                                    className="w-4 h-4 rounded"
                                />
                                <span className="text-gray-700">{item.name}</span>
                                </label>
                            ))}
                            </div>
                        )}
                        </div>
                    ))}
                    </CardContent>
                </Card>
                )}

                {/* Botão Salvar */}
                <div className="flex justify-end">
                <Button onClick={handleSave} disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Salvando...' : 'Salvar Permissões'}
                </Button>
                </div>
            </>
            )}
        </div>
        </div>
    );
}
