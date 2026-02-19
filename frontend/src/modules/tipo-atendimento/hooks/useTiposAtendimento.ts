import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const useTiposAtendimento = () => {
  return useQuery({
    queryKey: ['tipos-atendimento'],
    queryFn: async () => {
      const { data } = await api.get('/tipos-atendimento');
      return data.data;
    },
  });
};
