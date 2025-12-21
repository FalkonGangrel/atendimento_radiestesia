import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { DashboardMasterStats } from '@/types';

export default function DashboardMaster() {
    const { data, isLoading } = useQuery<DashboardMasterStats[]>({
        queryKey: ['dashboard-master'],
        queryFn: async () => {
        const { data } = await api.get('/dashboard/stats');
        return data;
        },
    });

    if (isLoading) return <p className="text-center py-6">Carregando...</p>;

    return (
        <div className="space-y-8">
        <h1 className="text-3xl font-bold">Dashboard Master</h1>

        <Card>
            <CardHeader>
            <CardTitle>Resumo dos Atendentes</CardTitle>
            </CardHeader>

            <CardContent>
            {data?.length ? (
                <div className="space-y-3">
                {data.map((item) => (
                    <div key={item.atendente_id} className="border p-4 rounded-lg">
                    <h3 className="font-semibold text-lg">{item.atendente_name}</h3>
                    <p>Total: {item.total_atendimentos}</p>
                    <p>Concluídos: {item.concluidos}</p>
                    <p>Em andamento: {item.em_andamento}</p>
                    </div>
                ))}
                </div>
            ) : (
                <p>Nenhum atendente com atendimentos ainda.</p>
            )}
            </CardContent>
        </Card>
        </div>
    );
}
