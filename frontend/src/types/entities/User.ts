import type { Role } from '@/constants/roles';

export interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
    created_at: string;
    updated_at: string;
}