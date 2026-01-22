import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts';
import { api } from '@/lib/api';
import { Permissions } from '@/constants/permissions';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { BarChart3, FileText, List, Plus } from 'lucide-react'; // Importar List para o ícone
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
    total: number;
    em_andamento: number;
    concluidos: number;
    cancelados: number;
}

export default function Dashboard() {
    const { user, hasPermission } = useAuth();
    const navigate = useNavigate();

    const { data: stats, isLoading, error } = useQuery<DashboardStats, AxiosError>({
        queryKey: ['dashboard-stats'],
        queryFn: async (): Promise<DashboardStats> => {
            const { data } = await api.get('/atendimentos/stats')
            return data
        },
        enabled: !!user?.id,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })

    if (isLoading) {
        return <div className="text-center py-10 text-gray-500">Carregando dashboard...</div>;
    }

    // Embora o queryFn já retorne um objeto padrão em caso de erro,
    // esta verificação pode ser útil para erros de rede mais graves
    if (error && !stats) { // Verifica se há erro E se stats ainda é null/undefined
        return (
            <div className="text-center py-10 text-red-600">
                Erro ao carregar dados do dashboard: {error.message}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-2">Visão geral dos seus atendimentos</p>
                </div>

                {/* Estatísticas de Atendimentos */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-gray-600">Total de Atendimentos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold text-gray-900">{stats?.total || 0}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-gray-600">Em Andamento</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold text-blue-600">{stats?.em_andamento || 0}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-gray-600">Concluídos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold text-green-600">{stats?.concluidos || 0}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-gray-600">Cancelados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold text-red-600">{stats?.cancelados || 0}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Ações Rápidas */}
                <Card>
                    <CardHeader>
                        <CardTitle>Ações Rápidas</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-4">
                        <Button onClick={() => navigate('/novo-atendimento')}>
                            <Plus className="w-4 h-4 mr-2" />
                            Novo Atendimento
                        </Button>
                        <Button variant="outline" onClick={() => navigate('/atendimentos')}>
                            <FileText className="w-4 h-4 mr-2" />
                            Ver Todos os Atendimentos
                        </Button>

                        {/* Botão Dashboard Master - APENAS para MASTER */}
                        {hasPermission(Permissions.DASHBOARD_MASTER) && (
                            <Button onClick={() => navigate('/dashboard-master')}>
                                <BarChart3 className="w-4 h-4 mr-2" />
                                Dashboard Master
                            </Button>
                        )}


                        {/* Botão Gerenciar Listas - APENAS para MASTER */}
                        {user?.role === 'master' && (
                            <Button variant="outline" onClick={() => navigate('/listas')}>
                                <List className="w-4 h-4 mr-2" />
                                Gerenciar Modelos de Listas {/* CORRIGIDO: Nomenclatura */}
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
