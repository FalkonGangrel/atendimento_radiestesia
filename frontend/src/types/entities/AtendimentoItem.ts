import type { ListItem } from '@/types/entities/ListItem';

export interface AtendimentoItem {
  id: number;
  atendimento_id: number;
  list_item_id: number;
  quantity: number | null;
  list_item?: ListItem;
  created_at: string;
  updated_at: string;
}
