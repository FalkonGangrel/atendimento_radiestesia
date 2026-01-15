export interface CustomFieldFormData {
  section_id: number | null;
  name: string;
  slug: string;
  type: 'text' | 'number' | 'checkbox' | 'select' | 'textarea' | 'date';
  options: string;
  is_required: boolean;
  active: boolean;
}
