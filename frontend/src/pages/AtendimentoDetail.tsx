import { useParams, useNavigate } from 'react-router-dom';
import { useAtendimento } from '@/hooks/useAtendimentos';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate, formatDateTime } from '@/lib/utils';
import { Edit, ArrowLeft, CheckCircle, XCircle } from 'lucide-react'; // Importar CheckCircle e XCircle
import type { Atendimento, AtendimentoItemDetail } from '@/types'; // Importar Atendimento e AtendimentoItemDetail

// Componente auxiliar para exibir campos booleanos de forma clara
interface BooleanDisplayProps {
    label: string;
    value: boolean;
}

const BooleanDisplay: React.FC<BooleanDisplayProps> = ({ label, value }) => (
    <div className="flex items-center gap-2">
        {value ? (
            <CheckCircle size={20} className="text-green-500" />
        ) : (
            <XCircle size={20} className="text-red-500" />
        )}
        <span>{label}: {value ? 'Sim' : 'Não'}</span>
    </div>
);

export default function AtendimentoDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Tipar o retorno do hook useAtendimento
    const { data: atendimento, isLoading } = useAtendimento(id ? Number(id) : undefined);

    if (isLoading) {
        return <div className="text-center py-10">Carregando...</div>;
    }

    if (!atendimento) {
        return <div className="text-center py-10">Atendimento não encontrado</div>;
    }

    const getStatusColor = (status: Atendimento['status']) => { // Tipar o parâmetro status
        switch (status) {
            case 'em_andamento':
                return 'bg-blue-100 text-blue-800';
            case 'concluido':
                return 'bg-green-100 text-green-800';
            case 'cancelado':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: Atendimento['status']) => { // Tipar o parâmetro status
        switch (status) {
            case 'em_andamento':
                return 'Em Andamento';
            case 'concluido':
                return 'Concluído';
            case 'cancelado':
                return 'Cancelado';
            default:
                return status; // Retorna o próprio status se não houver mapeamento
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => navigate('/atendimentos')}>
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Voltar
                    </Button>
                    <h1 className="text-3xl font-bold">{atendimento.patient_name}</h1>
                </div>
                <div className="flex gap-2">
                    <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                            atendimento.status
                        )}`}
                    >
                        {getStatusLabel(atendimento.status)}
                    </span>
                    <Button onClick={() => navigate(`/atendimentos/${id}/editar`)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Dados do Paciente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p>
                        <strong>Nome:</strong> {atendimento.patient_name}
                    </p>
                    <p>
                        <strong>Data de Nascimento:</strong> {formatDate(atendimento.birth_date)}
                    </p>
                    <p>
                        <strong>Data do Atendimento:</strong> {formatDate(atendimento.attendance_date)}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Informações do Tratamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {atendimento.treatment_focus && (
                        <p>
                            <strong>Foco do Tratamento:</strong> {atendimento.treatment_focus}
                        </p>
                    )}
                    {atendimento.observations && (
                        <p>
                            <strong>Observações:</strong> {atendimento.observations}
                        </p>
                    )}
                    {/* Para números, 0 é um valor válido, então a verificação explícita é boa */}
                    {(atendimento.tables_needed !== null && atendimento.tables_needed !== undefined) && (
                        <p>
                            <strong>Mesas Necessárias:</strong> {atendimento.tables_needed}
                        </p>
                    )}
                    {(atendimento.lines_to_clean !== null && atendimento.lines_to_clean !== undefined) && (
                        <p>
                            <strong>Linhas para Limpar:</strong> {atendimento.lines_to_clean}
                        </p>
                    )}
                    {(atendimento.fractals_percent !== null && atendimento.fractals_percent !== undefined) && (
                        <p>
                            <strong>Fractais:</strong> {atendimento.fractals_percent}%
                        </p>
                    )}
                    {(atendimento.treatment_duration_days !== null && atendimento.treatment_duration_days !== undefined) && (
                        <p>
                            <strong>Duração do Tratamento:</strong> {atendimento.treatment_duration_days} dias
                        </p>
                    )}
                    <div className="flex gap-4 pt-3">
                        <BooleanDisplay label="Tem Diretivas" value={atendimento.has_directives} />
                        <BooleanDisplay label="Tem Ancestralidade" value={atendimento.has_ancestralidade} />
                        <BooleanDisplay label="Tem RCO" value={atendimento.has_rco} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Itens do Atendimento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {atendimento.items && atendimento.items.length > 0 ? (
                        atendimento.items.map((item: AtendimentoItemDetail) => (
                            <div
                                key={item.id}
                                className="p-3 border rounded-lg flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-medium">{item.item_name}</p>
                                    <p className="text-sm text-gray-600">{item.list_name}</p>
                                </div>
                                {item.has_quantity && item.quantity !== null && item.quantity !== undefined && (
                                    <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-800 font-semibold">
                                        {item.quantity}
                                    </span>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">Nenhum item selecionado</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Registro do Sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-700">
                    <p>
                        <strong>Criado em:</strong> {formatDateTime(atendimento.created_at)}
                    </p>
                    <p>
                        <strong>Atualizado em:</strong> {formatDateTime(atendimento.updated_at)}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
