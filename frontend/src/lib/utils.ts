const TOKEN_KEY = 'token';

export function getAuthToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}

// Junta classes Tailwind condicionalmente
export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}

// Formata DATA simples: 15/05/2025
export function formatDate(date: string | Date | null | undefined): string {
    if (!date) return '';

    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return '';

    return d.toLocaleDateString('pt-BR');
}

// Formata DATA + HORA: 15/05/2025 14:30
export function formatDateTime(date: string | Date | null | undefined): string {
    if (!date) return '';

    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return '';

    return d.toLocaleString('pt-BR');
}

export function formatDateSimple(date: string | Date | null | undefined): string {
    if (!date) return '';

    return date.toString().split('-').reverse().join('/');
}

// Formata moeda brasileira: R$ 1.500,00
export function formatCurrency(value: string | number | null | undefined): string {
    if (value === null || value === undefined) return 'R$&nbsp;0,00';

    const numberValue = typeof value === 'number'
        ? value
        : parseFloat(value);

    if (isNaN(numberValue)) return 'R$&nbsp;0,00';

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(numberValue);
}
