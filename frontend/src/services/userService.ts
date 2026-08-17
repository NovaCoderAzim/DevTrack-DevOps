import { api } from './api';
import { User, UserRole, PaginatedResponse } from '../types';

export interface UserFilterParams {
  search?: string;
  role?: UserRole;
  project_id?: number;
  is_active?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  is_active?: boolean;
  project_ids?: number[];
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  is_active?: boolean;
  project_ids?: number[];
}

export const userService = {
  async getUsers(params: UserFilterParams = {}): Promise<PaginatedResponse<User>> {
    const res = await api.get<PaginatedResponse<User>>('/users/', { params });
    return res.data;
  },

  async createUser(data: CreateUserPayload): Promise<User> {
    const res = await api.post<User>('/users/', data);
    return res.data;
  },

  async updateUser(id: number, data: UpdateUserPayload): Promise<User> {
    const res = await api.put<User>(`/users/${id}`, data);
    return res.data;
  },

  async toggleUserStatus(id: number, is_active: boolean): Promise<User> {
    const res = await api.put<User>(`/users/${id}/status`, { is_active });
    return res.data;
  },
};
