export interface Cliente {
  id: number;
  name: string;
  email: string | null;
  telefone: string | null;
  whatsapp: string | null;
  data_nascimento: string | null;
  observacoes: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}
