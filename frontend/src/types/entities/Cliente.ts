export interface Cliente {
    id: number;
    name: string;
    email?: string | null;
    telefone?: string | null;
    whatsapp?: string | null;
    birth_date?: string | null;
    observacoes?: string | null;
    active: boolean;

    created_by?: {
        id: number;
        name: string;
        email: string;
    };
}