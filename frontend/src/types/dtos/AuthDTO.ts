import type { User } from '@/types/entities/User';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  user: User;
  token?: string;
}
