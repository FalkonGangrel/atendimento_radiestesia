import type { FieldSection } from './FieldSection';

export interface CustomField {
  id: number;
  section_id: number;
  name: string;
  slug: string;
  type: 'text' | 'number' | 'checkbox' | 'select' | 'textarea' | 'date';
  options: string[] | null;
  is_required: boolean;
  order: number;
  active: boolean;
  created_at: string;
  updated_at: string;

  section?: FieldSection;
}
