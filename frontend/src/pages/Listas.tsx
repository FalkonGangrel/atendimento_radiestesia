import { useState } from 'react';
import { useListModels } from '@/hooks/useAtendimentos'; // CORRIGIDO: useLists para useListModels
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Edit, Trash2, Plus, Save } from 'lucide-react';
import type { ListModel, ListItem } from '@/types'; // CORRIGIDO: List para ListModel
import { AxiosError } from 'axios';

export default function Listas() {
    const { data: listModels, refetch, isLoading } = useListModels(); // CORRIGIDO: lists para listModels, adicionado isLoading

    // Estados para edição
    const [editingList, setEditingList] = useState<ListModel | null>(null); // CORRIGIDO: List para ListModel
    const [editingItem, setEditingItem] = useState<ListItem | null>(null);
    const [newListName, setNewListName] = useState('');
    const [newItemName, setNewItemName] = useState('');
    const [newItemHasQuantity, setNewItemHasQuantity] = useState(false); // Renomeado para clareza
    const [error, setError] = useState('');

    // Criar novo modelo de lista
    const createList = async () => {
        if (!newListName.trim()) {
            setError('O nome do modelo de lista não pode ser vazio.');
            return;
        }
        setError('');
        try {
            await api.post('/lists', { name: newListName });
            setNewListName('');
            refetch();
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || 'Erro ao criar modelo de lista');
            } else {
                setError('Erro desconhecido ao criar modelo de lista');
            }
            console.error(err);
        }
    };

    // Criar novo item
    const createItem = async (listId: number) => {
        if (!newItemName.trim()) {
            setError('O nome do item não pode ser vazio.');
            return;
        }
        setError('');
        try {
            await api.post('/list-items', {
                list_id: listId,
                name: newItemName,
                has_quantity: newItemHasQuantity,
            });
            setNewItemName('');
            setNewItemHasQuantity(false);
            refetch();
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || 'Erro ao criar item');
            } else {
                setError('Erro desconhecido ao criar item');
            }
            console.error(err);
        }
    };

    // Atualizar modelo de lista
    const saveList = async () => {
        if (!editingList) return;
        if (!editingList.name.trim()) {
            setError('O nome do modelo de lista não pode ser vazio.');
            return;
        }
        setError('');
        try {
            await api.put(`/lists/${editingList.id}`, { name: editingList.name });
            setEditingList(null);
            refetch();
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || 'Erro ao atualizar modelo de lista');
            } else {
                setError('Erro desconhecido ao atualizar modelo de lista');
            }
            console.error(err);
        }
    };

    // Atualizar item
    const saveItem = async () => {
        if (!editingItem) return;
        if (!editingItem.name.trim()) {
            setError('O nome do item não pode ser vazio.');
            return;
        }
        setError('');
        try {
            await api.put(`/list-items/${editingItem.id}`, {
                name: editingItem.name,
                has_quantity: editingItem.has_quantity,
            });
            setEditingItem(null);
            refetch();
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || 'Erro ao atualizar item');
            } else {
                setError('Erro desconhecido ao atualizar item');
            }
            console.error(err);
        }
    };

    // Deletar modelo de lista
    const deleteList = async (id: number) => {
        if (confirm('Tem certeza? Isso apagará este modelo de lista e todos os seus itens.')) {
            setError('');
            try {
                await api.delete(`/lists/${id}`);
                refetch();
            } catch (err) {
                if (err instanceof AxiosError) {
                    setError(err.response?.data?.message || 'Erro ao deletar modelo de lista');
                } else {
                    setError('Erro desconhecido ao deletar modelo de lista');
                }
                console.error(err);
            }
        }
    };

    // Deletar item
    const deleteItem = async (id: number) => {
        if (confirm('Tem certeza que deseja deletar este item?')) {
            setError('');
            try {
                await api.delete(`/list-items/${id}`);
                refetch();
            } catch (err) {
                if (err instanceof AxiosError) {
                    setError(err.response?.data?.message || 'Erro ao deletar item');
                } else {
                    setError('Erro desconhecido ao deletar item');
                }
                console.error(err);
            }
        }
    };

    if (isLoading) { // CORRIGIDO: Adicionado estado de carregamento
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Carregando modelos de listas...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Gerenciar Modelos de Listas</h1> {/* CORRIGIDO: Título */}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {/* Criar Novo Modelo de Lista */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Criar Novo Modelo de Lista</CardTitle> {/* CORRIGIDO: Título */}
                    </CardHeader>
                    <CardContent className="flex gap-4">
                        <Input
                            placeholder="Nome do novo modelo de lista" // CORRIGIDO: Placeholder
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            className="flex-1"
                        />
                        <Button onClick={createList}>
                            <Plus className="w-4 h-4 mr-2" />
                            Criar Modelo
                        </Button>
                    </CardContent>
                </Card>

                {/* Modelos de Listas Existentes */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Modelos de Listas Existentes</h2> {/* CORRIGIDO: Título */}

                {listModels && listModels.length > 0 ? (
                    <div className="space-y-6">
                        {listModels.map((listModel) => ( // CORRIGIDO: list para listModel
                            <Card key={listModel.id}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    {editingList?.id === listModel.id ? (
                                        <Input
                                            value={editingList.name}
                                            onChange={(e) => setEditingList({ ...editingList, name: e.target.value })}
                                            className="text-xl font-semibold"
                                        />
                                    ) : (
                                        <CardTitle className="text-xl font-semibold">{listModel.name}</CardTitle>
                                    )}
                                    <div className="flex gap-2">
                                        {editingList?.id === listModel.id ? (
                                            <Button size="sm" onClick={saveList}>
                                                <Save className="w-4 h-4" />
                                            </Button>
                                        ) : (
                                            <Button size="sm" variant="outline" onClick={() => setEditingList(listModel)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        )}
                                        <Button size="sm" variant="destructive" onClick={() => deleteList(listModel.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Formulário para adicionar novo item */}
                                    <div className="flex gap-2 items-center border-t pt-4 mt-4">
                                        <Input
                                            placeholder="Nome do novo item"
                                            value={newItemName}
                                            onChange={(e) => setNewItemName(e.target.value)}
                                            className="flex-1"
                                        />
                                        <label className="flex items-center gap-1 text-sm text-gray-700">
                                            <input
                                                type="checkbox"
                                                checked={newItemHasQuantity}
                                                onChange={(e) => setNewItemHasQuantity(e.target.checked)}
                                                className="w-4 h-4"
                                            />
                                            Permitir Quantidade (#)
                                        </label>
                                        <Button onClick={() => createItem(listModel.id)}>Adicionar</Button>
                                    </div>

                                    {/* Listagem dos itens */}
                                    {listModel.items && listModel.items.length > 0 ? (
                                        <div className="space-y-2">
                                            {listModel.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex justify-between items-center border p-2 rounded bg-gray-50"
                                                >
                                                    {editingItem?.id === item.id ? (
                                                        <div className="flex gap-2 flex-1 items-center">
                                                            <Input
                                                                value={editingItem.name}
                                                                onChange={(e) =>
                                                                    setEditingItem({ ...editingItem, name: e.target.value })
                                                                }
                                                                className="flex-1"
                                                            />
                                                            <label className="flex items-center gap-2 text-sm">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={editingItem.has_quantity}
                                                                    onChange={(e) =>
                                                                        setEditingItem({
                                                                            ...editingItem,
                                                                            has_quantity: e.target.checked,
                                                                        })
                                                                    }
                                                                    className="w-4 h-4"
                                                                />
                                                                Quantidade
                                                            </label>
                                                            <Button size="sm" onClick={saveItem}>
                                                                <Save className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="flex-1">
                                                                <p className="font-medium">{item.name}</p>
                                                                {item.has_quantity && (
                                                                    <p className="text-xs text-blue-600">Aceita Quantidade (#)</p>
                                                                )}
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => setEditingItem(item)}
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    onClick={() => deleteItem(item.id)}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">Nenhum item neste modelo de lista.</p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="text-center py-10">
                            <p className="text-gray-500">Nenhum modelo de lista cadastrado ainda.</p> {/* CORRIGIDO: Nomenclatura */}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
