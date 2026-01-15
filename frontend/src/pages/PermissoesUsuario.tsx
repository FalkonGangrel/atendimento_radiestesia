// src/pages/PermissoesUsuario.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import type { User, TipoAtendimento, CustomField, ListModel, ListItem, SavePermissionsPayload } from '@/types'; // Atualizado List para ListModel
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'; // Importado Select components
import { ArrowLeft, Save } from 'lucide-react';
import { useUsersList } from '@/hooks/useUsers'; // Novo hook
import { useTiposAtendimentoList } from '@/hooks/useTiposAtendimento'; // Novo hook
import { useUserPermissionsForTipo, useSaveUserPermissions } from '@/hooks/usePermissions'; // Novos hooks

export default function PermissoesUsuario() {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();

    const parsedUserId = userId ? Number(userId) : undefined;

    // Hooks para buscar dados
    const { data: user, isLoading: isLoadingUser, isError: isErrorUser, error: userError } = useUsersList(parsedUserId);
    const { data: tipos, isLoading: isLoadingTipos, isError: isErrorTipos, error: tiposError } = useTiposAtendimentoList();

    // Estado para o tipo de atendimento selecionado
    const [selectedTipoId, setSelectedTipoId] = useState<number | undefined>(undefined);

    // Hook para buscar permissões do tipo selecionado para o usuário
    const {
        data: permissionsData,
        isLoading: isLoadingPermissions,
        isError: isErrorPermissions,
        error: permissionsError,
        refetch: refetchPermissions, // Para recarregar as permissões após salvar
    } = useUserPermissionsForTipo(parsedUserId, selectedTipoId);

    // Estados para as permissões do formulário
    const [hasPermission, setHasPermission] = useState(false);
    const [selectedFieldIds, setSelectedFieldIds] = useState<number[]>([]);
    const [selectedListModelIds, setSelectedListModelIds] = useState<number[]>([]); // Renomeado
    const [selectedListItemIds, setSelectedListItemIds] = useState<number[]>([]);

    // Hook para salvar permissões
    const { mutate: savePermissions, isPending: isSaving } = useSaveUserPermissions();

    // Efeito para inicializar o estado do formulário quando as permissões são carregadas
    useEffect(() => {
        if (permissionsData) {
            setHasPermission(permissionsData.has_permission);
            setSelectedFieldIds(permissionsData.selected_field_ids);
            setSelectedListModelIds(permissionsData.selected_list_model_ids); // Renomeado
            setSelectedListItemIds(permissionsData.selected_list_item_ids);
        } else {
            // Resetar estados se não houver dados de permissão (ex: tipo não selecionado ou erro)
            setHasPermission(false);
            setSelectedFieldIds([]);
            setSelectedListModelIds([]);
            setSelectedListItemIds([]);
        }
    }, [permissionsData]);

    // Funções de toggle para checkboxes
    const toggleField = (fieldId: number) => {
        setSelectedFieldIds((prev) =>
            prev.includes(fieldId) ? prev.filter((id) => id !== fieldId) : [...prev, fieldId]
        );
    };

    const toggleListModel = (listModelId: number) => { // Renomeado
        setSelectedListModelIds((prev) => {
            const newSelectedListModels = prev.includes(listModelId)
                ? prev.filter((id) => id !== listModelId)
                : [...prev, listModelId];

            // Se desmarcar um modelo de lista, desmarcar todos os seus itens também
            if (!newSelectedListModels.includes(listModelId)) {
                const listModel = permissionsData?.available_list_models?.find(lm => lm.id === listModelId);
                if (listModel?.items) {
                    setSelectedListItemIds(prevItems => prevItems.filter(itemId => !listModel.items?.some(item => item.id === itemId)));
                }
            }
            return newSelectedListModels;
        });
    };

    const toggleListItem = (itemId: number) => {
        setSelectedListItemIds((prev) =>
            prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
        );
    };

    const handleSave = async () => {
        if (!parsedUserId || !selectedTipoId) {
            console.error('User ID or Tipo ID is missing.');
            return;
        }

        const payload: SavePermissionsPayload = {
            active: hasPermission,
            field_ids: hasPermission ? selectedFieldIds : [],
            list_model_ids: hasPermission ? selectedListModelIds : [], // Renomeado
            list_item_ids: hasPermission ? selectedListItemIds : [],
        };

        savePermissions({ userId: parsedUserId, tipoId: selectedTipoId, payload }, {
            onSuccess: () => {
                alert('Permissões salvas com sucesso!');
                refetchPermissions(); // Recarrega as permissões para refletir o estado salvo
            },
            onError: (err) => {
                console.error('Erro ao salvar permissões:', err);
                alert(`Erro ao salvar permissões: ${err.message}`);
            },
        });
    };

    // Estados de carregamento e erro combinados
    const overallLoading = isLoadingUser || isLoadingTipos || isLoadingPermissions || isSaving;
    const overallError = isErrorUser || isErrorTipos || isErrorPermissions;
    const errorMessage = userError?.message || tiposError?.message || permissionsError?.message || 'Erro desconhecido';

    if (overallLoading && !user && !tipos) { // Apenas mostra carregando se não tiver dados iniciais
        return <div className="text-center py-10">Carregando dados do usuário e tipos de atendimento...</div>;
    }

    if (overallError) {
        return <div className="text-center py-10 text-red-600">Erro: {errorMessage}</div>;
    }

    if (!user) {
        return <div className="text-center py-10">Usuário não encontrado.</div>;
    }

    return (
        <div className="space-y-8 p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    Permissões para {user.name}
                </h1>
                <Button variant="outline" onClick={() => navigate('/usuarios')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar para Usuários
                </Button>
            </div>

            {/* Seleção de Tipo de Atendimento */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Selecionar Tipo de Atendimento</CardTitle>
                </CardHeader>
                <CardContent>
                    <Select
                        onValueChange={(value) => setSelectedTipoId(Number(value))}
                        value={selectedTipoId?.toString() || ''}
                        disabled={isLoadingTipos}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione um Tipo de Atendimento" />
                        </SelectTrigger>
                        <SelectContent>
                            {tipos?.map((tipo) => (
                                <SelectItem key={tipo.id} value={tipo.id.toString()}>
                                    {tipo.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {isErrorTipos && <p className="text-red-500 text-sm mt-2">Erro ao carregar tipos de atendimento.</p>}
                </CardContent>
            </Card>

            {selectedTipoId && (
                <>
                    {isLoadingPermissions ? (
                        <div className="text-center py-10">Carregando permissões para este tipo...</div>
                    ) : (
                        <>
                            {/* Permissão Geral para o Tipo */}
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
                                        <span className="text-lg font-medium text-gray-900">
                                            Permitir acesso a este Tipo de Atendimento
                                        </span>
                                    </label>
                                </CardContent>
                            </Card>

                            {hasPermission && (
                                <>
                                    {/* Campos Customizados */}
                                    {permissionsData?.available_fields && permissionsData.available_fields.length > 0 && (
                                        <Card className="mb-6">
                                            <CardHeader>
                                                <CardTitle>Campos Customizados</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-2">
                                                    {permissionsData.available_fields.map((field) => (
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

                                    {/* Modelos de Listas e Itens */}
                                    {permissionsData?.available_list_models && permissionsData.available_list_models.length > 0 && (
                                        <Card className="mb-6">
                                            <CardHeader>
                                                <CardTitle>Modelos de Listas e Itens</CardTitle> {/* CORRIGIDO: Nomenclatura */}
                                            </CardHeader>
                                            <CardContent>
                                                {permissionsData.available_list_models.map((listModel) => ( // Renomeado
                                                    <div key={listModel.id} className="mb-6">
                                                        <label className="flex items-center gap-3 mb-3">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedListModelIds.includes(listModel.id)} // Renomeado
                                                                onChange={() => toggleListModel(listModel.id)} // Renomeado
                                                                className="w-5 h-5 rounded"
                                                            />
                                                            <span className="font-bold text-gray-900">{listModel.name}</span>
                                                        </label>
                                                        {listModel.items?.length > 0 && ( // Usando ?.
                                                            <div className="ml-8 space-y-2">
                                                                {listModel.items.map((item) => (
                                                                    <label key={item.id} className="flex items-center gap-3">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedListItemIds.includes(item.id)}
                                                                            onChange={() => toggleListItem(item.id)}
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
                                        <Button onClick={handleSave} disabled={isSaving}>
                                            <Save className="w-4 h-4 mr-2" />
                                            {isSaving ? 'Salvando...' : 'Salvar Permissões'}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}
