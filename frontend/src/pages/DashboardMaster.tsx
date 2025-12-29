import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, FileText, List } from 'lucide-react';
import { AxiosError } from 'axios';

interface MasterStats {
    total_users: number;
    total_atendimentos: number;
    total_lists: number;
    total_list_items: number;
}

export default function DashboardMaster() {
    const navigate = useNavigate();

    const { data: stats, isLoading } = useQuery<MasterStats>({
        queryKey: ['master-stats'],
        queryFn: async () => {
        try {
            const { data } = await api.get('/master/stats');
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
        {/* Header com botão Voltar */}
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
            <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/')}
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Dashboard Master</h1>
            </div>
        </div>

        {/* Estatísticas Globais */}
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
                Total de Listas
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
                Total de Itens
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
            <CardContent className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/listas')}>
                <List className="w-4 h-4 mr-2" />
                Gerenciar Listas
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
