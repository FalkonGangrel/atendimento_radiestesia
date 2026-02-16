export interface CreateCustomFieldDTO {
  section_id: number;
  name: string;
  type: string;
  required?: boolean;
  options?: string[];
}