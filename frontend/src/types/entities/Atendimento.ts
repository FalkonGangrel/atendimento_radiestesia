import type { TipoAtendimento } from '@/types/entities/TipoAtendimento';
import type { AtendimentoItem } from '@/types/entities/AtendimentoItem';

export interface Atendimento {
  id: number;
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
  status: 'em_andamento' | 'concluido' | 'cancelado';
  tipo_atendimento_id: number;
  tipo_atendimento?: TipoAtendimento;
  items?: AtendimentoItem[];
  created_at: string;
  updated_at: string;
}
