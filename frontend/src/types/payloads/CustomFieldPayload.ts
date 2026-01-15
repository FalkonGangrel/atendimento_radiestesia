export interface CustomFieldPayload {
    section_id: number;
    name: string;
    slug: string;
    type: 'text' | 'number' | 'checkbox' | 'select' | 'textarea' | 'date';
    options: string[] | null;
    is_required: boolean;
    order?: number;
    active: boolean;
}
