export interface AtendimentoListDTO {
  id: number;
  patient_name: string;
  attendance_date: string;
  status: 'em_andamento' | 'concluido' | 'cancelado';
}
