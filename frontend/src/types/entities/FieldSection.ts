import type { CustomField } from '@/types/entities/CustomField';

export interface FieldSection {
  id: number;
  name: string;
  slug: string;
  order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  fields?: CustomField[];
}
