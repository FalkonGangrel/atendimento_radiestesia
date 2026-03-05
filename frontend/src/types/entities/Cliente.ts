export interface Cliente {
    id: number
    name: string
    email?: string | null
    phone?: string | null
    whatsapp?: string | null
    birth_date?: string | null
    observation?: string | null
    deleted_at: string | null

    ultimo_atendimento?: string | null
    data_retorno?: string | null
    observacao_resumo?: string | null

    // created_by sempre presente — id é o user_id do dono (usado para ownership)
    created_by: {
        id: number
        name: string
        email: string
    }
}