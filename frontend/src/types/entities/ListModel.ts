import type { ListItem } from '@/types/entities/ListItem';

export interface ListModel {
  id: number;
  name: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  items?: ListItem[];
}
