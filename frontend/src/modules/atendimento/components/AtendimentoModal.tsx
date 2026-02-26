import { useClienteHistorico } from '@/hooks/useClientes';
import { formatDateSimple } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import AtendimentoForm from './AtendimentoForm';

interface Props {
  clienteId: number;
  open: boolean;
  onClose: () => void;
}

export default function AtendimentoModal({ clienteId, open, onClose }: Props) {
  const queryClient = useQueryClient();

  const {
    data: atendimentos,
    isLoading,
  } = useClienteHistorico(clienteId, open);

  const handleClose = () => {
    // 🔥 Remove cache específico desse cliente
    queryClient.removeQueries({
      queryKey: ['cliente-historico', clienteId],
    });

    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-6 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          Histórico de Atendimento
        </h2>

        {isLoading && (
          <p className="text-gray-500">Carregando...</p>
        )}

        {!isLoading && atendimentos?.length === 0 && (
          <p className="text-gray-500">
            Nenhum atendimento encontrado.
          </p>
        )}

        <div className="mt-6 mb-4 border-t pt-4">
          <AtendimentoForm clienteId={clienteId} />
        </div>

        {atendimentos?.map((at: any) => (
          <div
            key={at.id}
            className="border p-3 mb-3 rounded-lg bg-gray-50"
          >
            <div className="text-sm">
              <b>Data:</b> {formatDateSimple(at.data_atendimento) || '-'}
            </div>

            <div className="text-sm">
              <b>Retorno:</b> {formatDateSimple(at.data_retorno) || '-'}
            </div>

            <div className="text-sm">
              <b>Tipo:</b> {at.tipo?.nome}
            </div>

            <div className="text-sm text-gray-600 mt-1">
              {at.observacao}
            </div>
          </div>
        ))}

        <div className="flex justify-end mt-6">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
