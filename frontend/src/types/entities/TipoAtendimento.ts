export interface TipoAtendimento {
    id: number;
    nome: string;
    slug: string;
    descricao: string | null;
    valor: number;
    duracao_minutos: number | null;
    ativo: boolean;
    ordem: number;
    created_at: string;
    updated_at: string;
}