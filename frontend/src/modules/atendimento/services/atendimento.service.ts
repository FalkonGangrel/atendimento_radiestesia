import { api } from '@/lib/api';

export const getAtendimentosByCliente = (clienteId: number) =>
  api.get(`/clientes/${clienteId}/atendimentos`);

export const createAtendimento = (data: any) =>
  api.post('/atendimentos', data);

export const createTipoAtendimento = (data: any) =>
  api.post('/tipos-atendimento', data);
