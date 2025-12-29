import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Plus, BarChart3, FileText, List } from 'lucide-react';
import { AxiosError } from 'axios';

interface DashboardStats {
    total: number;
    em_andamento: number;
    concluidos: number;
    cancelados: number;
}

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const { data: stats, isLoading } = useQuery<DashboardStats>({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
        try {
            const { data } = await api.get('/atendimentos/stats');
            return data;
        } catch (error) {
            if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Erro ao carregar estatísticas');
            }
            throw error;
        }
        },
    });

    if (isLoading) {
        return <div className="text-center py-10">Carregando...</div>;
    }

    return (
        <div className="space-y-8">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Bem-vindo, {user?.name}!</h1>
            <Button onClick={() => navigate('/novo-atendimento')}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Atendimento
            </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
            <CardHeader>
                <CardTitle className="text-sm text-gray-600">Total</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold">{stats?.total || 0}</p>
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
            {user?.role === 'master' && (
                <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard-master')}
                className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                >
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard Master
                </Button>
            )}

            {user?.role === 'master' && (
                <Button variant="outline" onClick={() => navigate('/listas')}>
                <List className="w-4 h-4 mr-2" />
                Gerenciar Listas
                </Button>
            )}
            </CardContent>
        </Card>
        </div>
    );
}
