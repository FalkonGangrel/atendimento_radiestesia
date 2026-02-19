import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAtendimento } from '../services/atendimento.service';
import { useTiposAtendimento } from '@/modules/tipo-atendimento/hooks/useTiposAtendimento';

export default function AtendimentoForm({ clienteId }: { clienteId: number }) {
  const queryClient = useQueryClient();
  const { data: tipos } = useTiposAtendimento();

  const [form, setForm] = useState({
    tipo_atendimento_id: '',
    data_atendimento: '',
    data_retorno: '',
    observacao: ''
  });

  const mutation = useMutation({
    mutationFn: createAtendimento,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cliente-historico', clienteId],
      });

      setForm({
        tipo_atendimento_id: '',
        data_atendimento: '',
        data_retorno: '',
        observacao: ''
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutation.mutate({
      ...form,
      cliente_id: clienteId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-4">
      <h3 className="font-semibold">Novo Atendimento</h3>

      {/* 🔹 Linha 1 - Tipo */}
      <div>
        <label className="block text-sm font-medium">
          Tipo de Atendimento
        </label>
        <select
          className="w-full border rounded p-2"
          value={form.tipo_atendimento_id}
          onChange={(e) =>
            setForm({ ...form, tipo_atendimento_id: e.target.value })
          }
          required
        >
          <option value="">Selecione o tipo</option>
          {tipos?.map((tipo: any) => (
            <option key={tipo.id} value={tipo.id}>
              {tipo.nome}
            </option>
          ))}
        </select>
      </div>

      {/* 🔹 Linha 2 - Datas */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">
            Data do Atendimento
          </label>
          <input
            type="date"
            className="w-full border rounded p-2"
            value={form.data_atendimento}
            onChange={(e) =>
              setForm({ ...form, data_atendimento: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Data de Retorno
          </label>
          <input
            type="date"
            className="w-full border rounded p-2"
            value={form.data_retorno}
            onChange={(e) =>
              setForm({ ...form, data_retorno: e.target.value })
            }
          />
        </div>
      </div>

      {/* 🔹 Linha 3 - Observação */}
      <div>
        <label className="block text-sm font-medium">
          Observações
        </label>
        <textarea
          className="w-full border rounded p-2"
          rows={3}
          value={form.observacao}
          onChange={(e) =>
            setForm({ ...form, observacao: e.target.value })
          }
        />
      </div>

      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Salvar
      </button>
    </form>
  );
}
