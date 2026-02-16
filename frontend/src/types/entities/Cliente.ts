export interface Cliente {
    id: number;
    name: string;
    email?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    birth_date?: string | null;
    observation?: string | null;
    deleted_at: string | null;

    created_by?: {
        id: number;
        name: string;
        email: string;
    };
}