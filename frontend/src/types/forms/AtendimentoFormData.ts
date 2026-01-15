export interface AtendimentoFormData {
    patient_name: string;
    birth_date: string;
    attendance_date: string;
    treatment_focus: string;
    observations: string;
    tables_needed?: number;
    lines_to_clean?: number;
    fractals_percent?: number;
    treatment_duration_days?: number;
    has_directives: boolean;
    has_ancestralidade: boolean;
    has_rco: boolean;
    custom_data: Record<string, unknown>;
    items: {
        list_item_id: number;
        quantity?: number;
    }[];
    tipo_atendimento_id?: number;
}
