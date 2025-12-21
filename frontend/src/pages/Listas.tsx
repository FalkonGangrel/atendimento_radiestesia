import { useLists } from '@/hooks/useAtendimentos';
import { api } from '@/lib/api';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Edit, Trash2, Plus, Save } from 'lucide-react';
import type { List, ListItem } from '@/types';
import { AxiosError } from 'axios';

export default function Listas() {
    const { data: lists, refetch } = useLists();

    // Estados para edição
    const [editingList, setEditingList] = useState<List | null>(null);
    const [editingItem, setEditingItem] = useState<ListItem | null>(null);

    const [newListName, setNewListName] = useState('');
    const [newItemName, setNewItemName] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState(false);
    const [error, setError] = useState('');

    // Criar nova lista
    const createList = async () => {
        if (!newListName.trim()) return;
        try {
            await api.post('/lists', { name: newListName });
            setNewListName('');
            refetch();
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || 'Erro ao criar lista');
            }
        }
    };

    // Criar novo item
    const createItem = async (listId: number) => {
        if (!newItemName.trim()) return;

        try {
            await api.post('/list-items', {
                list_id: listId,
                name: newItemName,
                has_quantity: newItemQuantity,
            });

            setNewItemName('');
            setNewItemQuantity(false);
            refetch();
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || 'Erro ao criar item');
            }
        }
    };

    // Atualizar lista
    const saveList = async () => {
        if (!editingList) return;
            try {
            await api.put(`/lists/${editingList.id}`, { name: editingList.name });
            setEditingList(null);
            refetch();
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || 'Erro ao atualizar lista');
            }
        }
    };

    // Atualizar item
    const saveItem = async () => {
        if (!editingItem) return;

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
            }
        }
    };

    // Deletar lista
    const deleteList = async (id: number) => {
        if (confirm('Tem certeza? Isso apagará todos os itens da lista.')) {
            try {
                await api.delete(`/lists/${id}`);
                refetch();
            } catch (err) {
                if (err instanceof AxiosError) {
                    setError(err.response?.data?.message || 'Erro ao deletar lista');
                }
            }
        }
    };

    // Deletar item
    const deleteItem = async (id: number) => {
        if (confirm('Deseja deletar este item?')) {
            try {
                await api.delete(`/list-items/${id}`);
                refetch();
            } catch (err) {
                if (err instanceof AxiosError) {
                setError(err.response?.data?.message || 'Erro ao deletar item');
                }
            }
        }
    };

    return (
        <div className="space-y-8">
        <h1 className="text-3xl font-bold">Listas e Subitens</h1>

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
            </div>
        )}

        {/* Criar nova lista */}
        <Card>
            <CardHeader>
            <CardTitle>Criar Nova Lista</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
            <Input
                placeholder="Nome da lista"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
            />
            <Button onClick={createList}>
                <Plus className="w-4 h-4 mr-2" /> Criar
            </Button>
            </CardContent>
        </Card>

        {/* Listagem das listas */}
        {lists?.map((list) => (
            <Card key={list.id}>
            <CardHeader className="flex justify-between items-center">
                {editingList?.id === list.id ? (
                <div className="flex gap-2 w-full">
                    <Input
                    value={editingList.name}
                    onChange={(e) =>
                        setEditingList({ ...editingList, name: e.target.value })
                    }
                    />
                    <Button onClick={saveList}>
                    <Save className="w-4 h-4 mr-1" />
                    Salvar
                    </Button>
                </div>
                ) : (
                <div className="flex items-center justify-between w-full">
                    <CardTitle>{list.name}</CardTitle>
                    <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingList(list)}
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteList(list.id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                    </div>
                </div>
                )}
            </CardHeader>

            <CardContent>
                {/* Criar item dentro da lista */}
                <div className="flex gap-2 mb-4">
                <Input
                    placeholder="Novo subitem..."
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                />
                <label className="flex items-center gap-2 text-sm whitespace-nowrap">
                    <input
                    type="checkbox"
                    checked={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(e.target.checked)}
                    />
                    Permitir Quantidade (#)
                </label>
                <Button onClick={() => createItem(list.id)}>Adicionar</Button>
                </div>

                {/* Listagem dos itens */}
                {list.items.length > 0 ? (
                <div className="space-y-2">
                    {list.items.map((item) => (
                    <div
                        key={item.id}
                        className="flex justify-between items-center border p-2 rounded"
                    >
                        {editingItem?.id === item.id ? (
                        <div className="flex gap-2 flex-1">
                            <Input
                            value={editingItem.name}
                            onChange={(e) =>
                                setEditingItem({ ...editingItem, name: e.target.value })
                            }
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
                            />
                            Quantidade
                            </label>
                            <Button onClick={saveItem}>
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
                <p className="text-gray-500">Nenhum item nesta lista.</p>
                )}
            </CardContent>
            </Card>
        ))}
        </div>
    );
}
