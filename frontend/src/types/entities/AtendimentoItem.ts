import type { ListItem } from '@/types/entities/ListItem';

export interface AtendimentoItem {
  id: number;
  atendimento_id: number;
  list_item_id: number;
  item_name: string;
  has_quantity: boolean;
  quantity: number | null;
  list_item?: ListItem;
  list_name: string;
  created_at: string;
  updated_at: string;
}
