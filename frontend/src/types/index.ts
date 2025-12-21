export interface User {
  id: number;
  name: string;
  email: string;
  role: 'master' | 'atendente';
}

export interface List {
  id: number;
  name: string;
  slug: string;
  created_by: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  items: ListItem[];
}

export interface ListItem {
  id: number;
  list_id: number;
  name: string;
  has_quantity: boolean;
  active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Atendimento {
  id: number;
  patient_name: string;
  birth_date: string;
  attendance_date: string;
  treatment_focus?: string;
  observations?: string;
  tables_needed?: number;
  lines_to_clean?: number;
  fractals_percent?: number;
  treatment_duration_days?: number;
  has_directives: boolean;
  has_ancestralidade: boolean;
  has_rco: boolean;
  status: 'em_andamento' | 'concluido' | 'cancelado';
  created_at: string;
  updated_at: string;
  items?: AtendimentoItem[];
}

export interface AtendimentoItem {
  id: number;
  user_id: number;
  atendimento_table: string;
  atendimento_id: number;
  list_item_id: number;
  quantity?: number;
  created_at: string;
  updated_at: string;
  item_name?: string;
  has_quantity?: boolean;
  list_name?: string;
  list_slug?: string;
}

export interface AtendimentoFormData {
  patient_name: string;
  birth_date: string;
  attendance_date: string;
  treatment_focus?: string;
  observations?: string;
  tables_needed?: number;
  lines_to_clean?: number;
  fractals_percent?: number;
  treatment_duration_days?: number;
  has_directives: boolean;
  has_ancestralidade: boolean;
  has_rco: boolean;
  items: {
    list_item_id: number;
    quantity?: number;
  }[];
}

export interface DashboardMasterStats {
  atendente_id: number;
  atendente_name: string;
  total_atendimentos: number;
  concluidos: number;
  em_andamento: number;
}
