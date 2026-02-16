export interface AtendimentoFormData {
    patient_name: string;
    birth_date: string;
    attendance_date: string;
    treatment_focus: string;
    observations: string | null;
    tables_needed: number | null;
    lines_to_clean: number | null;
    fractals_percent: number | null;
    treatment_duration_days: number | null;
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
