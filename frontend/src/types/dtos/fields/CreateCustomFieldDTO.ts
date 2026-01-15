export interface CreateCustomFieldDTO {
  section_id: number;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
}