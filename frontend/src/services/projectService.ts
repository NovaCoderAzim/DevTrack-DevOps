import { api } from './api';
import { Project, User } from '../types';

export interface CreateProjectPayload {
  name: string;
  key: string;
  description?: string;
  member_ids?: number[];
}

export interface UpdateProjectPayload {
  name?: string;
  key?: string;
  description?: string;
  owner_id?: number;
  member_ids?: number[];
}

export const projectService = {
  async getProjects(): Promise<Project[]> {
    const res = await api.get<Project[]>('/projects/');
    return res.data;
  },

  async getProject(id: number): Promise<Project> {
    const res = await api.get<Project>(`/projects/${id}`);
    return res.data;
  },

  async createProject(data: CreateProjectPayload): Promise<Project> {
    const res = await api.post<Project>('/projects/', data);
    return res.data;
  },

  async updateProject(id: number, data: UpdateProjectPayload): Promise<Project> {
    const res = await api.put<Project>(`/projects/${id}`, data);
    return res.data;
  },

  async deleteProject(id: number): Promise<void> {
    await api.delete(`/projects/${id}`);
  },

  async getProjectMembers(projectId: number): Promise<User[]> {
    const res = await api.get<User[]>(`/projects/${projectId}/members`);
    return res.data;
  },

  async addProjectMember(projectId: number, userId: number): Promise<User[]> {
    const res = await api.post<User[]>(`/projects/${projectId}/members`, { user_id: userId });
    return res.data;
  },

  async removeProjectMember(projectId: number, userId: number): Promise<void> {
    await api.delete(`/projects/${projectId}/members/${userId}`);
  },
};
