export interface User {
  id: number;
  name: string;
  email: string;
  role: 'master' | 'atendente';
  created_at: string;
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
  user_id: number;
  cliente_id?: number;
  tipo_atendimento_id?: number; // NOVO
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
  valor_cobrado?: number; // NOVO
  custom_data?: Record<string, unknown>;
  cliente?: Cliente;
  tipoAtendimento?: TipoAtendimento; // NOVO
  created_at: string;
  updated_at: string;
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
  custom_data?: Record<string, unknown>; // ← NOVO: campos dinâmicos
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

// ====================================================================
// NOVOS TIPOS PARA CAMPOS DINÂMICOS
// ====================================================================

export interface FieldSection {
  id: number;
  name: string;
  slug: string;
  order: number;
  active: boolean;
  fields?: CustomField[];
  created_at: string;
  updated_at: string;
}

export interface CustomField {
  id: number;
  section_id: number;
  name: string;
  slug: string;
  type: 'text' | 'number' | 'checkbox' | 'select' | 'textarea' | 'date';
  options: string[] | null;
  order: number;
  is_required: boolean;
  active: boolean;
  section?: FieldSection;
  created_at: string;
  updated_at: string;
}

export interface UserFieldPermission {
  id: number;
  user_id: number;
  custom_field_id: number;
  created_at: string;
  updated_at: string;
  customField?: CustomField;
}

export interface Cliente {
  id: number;
  user_id: number;
  nome: string;
  email?: string;
  telefone?: string;
  whatsapp?: string;
  data_nascimento?: string;
  observacoes?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface TipoAtendimento {
  id: number;
  nome: string;
  slug: string;
  descricao?: string;
  valor: string | number;
  duracao_minutos?: number;
  ativo: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
}