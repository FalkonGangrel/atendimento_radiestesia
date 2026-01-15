import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, FileText, List } from 'lucide-react'; // Mantendo List para itens também, por simplicidade
import { AxiosError } from 'axios';

interface MasterStats {
    total_users: number;
    total_atendimentos: number;
    total_lists: number; // Refere-se a ListModels
    total_list_items: number;
}

export default function DashboardMaster() {
    const navigate = useNavigate();

    const { data: stats, isLoading, error } = useQuery<MasterStats>({
        queryKey: ['master-stats'],
        queryFn: async () => {
            try {
                const { data } = await api.get('/master-stats');
                return data;
            } catch (error) {
                if (error instanceof AxiosError) {
                    // Retorna um objeto padrão em caso de erro para evitar que a UI quebre
                    console.error('Erro ao carregar estatísticas master:', error.response?.data?.message || error.message);
                    return {
                        total_users: 0,
                        total_atendimentos: 0,
                        total_lists: 0,
                        total_list_items: 0,
                    };
                }
                throw error; // Re-lança outros tipos de erro
            }
        },
        // Opcional: Adicionar um staleTime para não refetchar tão frequentemente
        staleTime: 1000 * 60 * 5, // 5 minutos
    });

    if (isLoading) {
        return <div className="text-center py-10 text-gray-500">Carregando estatísticas master...</div>;
    }

    // Se houver um erro que não foi tratado pelo queryFn (ex: erro de rede antes da requisição)
    if (error) {
        return <div className="text-center py-10 text-red-500">Erro ao carregar o dashboard master: {error.message}</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Master</h1>
                <Button variant="outline" onClick={() => navigate('/')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar ao Dashboard
                </Button>
            </div>

            {/* Estatísticas Master */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Total de Usuários
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-purple-600">{stats?.total_users || 0}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Total de Atendimentos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-blue-600">{stats?.total_atendimentos || 0}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                            <List className="w-4 h-4" />
                            Total de Modelos de Listas {/* CORRIGIDO: Nomenclatura */}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-green-600">{stats?.total_lists || 0}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                            <List className="w-4 h-4" />
                            Total de Itens de Listas {/* CORRIGIDO: Nomenclatura */}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-orange-600">{stats?.total_list_items || 0}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Ações Rápidas Master */}
            <Card>
                <CardHeader>
                    <CardTitle>Ações Master</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                    <Button variant="outline" onClick={() => navigate('/listas')}>
                        <List className="w-4 h-4 mr-2" />
                        Gerenciar Modelos de Listas {/* CORRIGIDO: Nomenclatura */}
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar ao Dashboard
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
