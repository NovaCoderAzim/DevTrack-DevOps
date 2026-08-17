import { api } from './api';
import { User } from '../types';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export const authService = {
  async register(data: RegisterPayload): Promise<User> {
    const res = await api.post<User>('/auth/register', data);
    return res.data;
  },

  async login(email: string, password: string): Promise<TokenResponse> {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const res = await api.post<TokenResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return res.data;
  },

  async getMe(): Promise<User> {
    const res = await api.get<User>('/auth/me');
    return res.data;
  },

  async getUsers(): Promise<User[]> {
    const res = await api.get<User[]>('/users');
    return res.data;
  },
};
