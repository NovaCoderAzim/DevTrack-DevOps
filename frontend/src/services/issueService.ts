import { api } from './api';
import { Issue, Comment, DashboardStats, IssueStatus, IssuePriority, PaginatedResponse } from '../types';

export interface IssueFilterParams {
  project_id?: number;
  status?: IssueStatus;
  priority?: IssuePriority;
  assigned_to?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateIssuePayload {
  title: string;
  description?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  project_id: number;
  assigned_to?: number;
}

export interface UpdateIssuePayload {
  title?: string;
  description?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  assigned_to?: number;
}

export const issueService = {
  async getIssues(params: IssueFilterParams = {}): Promise<PaginatedResponse<Issue>> {
    const res = await api.get<PaginatedResponse<Issue>>('/issues/', { params });
    return res.data;
  },

  async getIssue(id: number): Promise<Issue> {
    const res = await api.get<Issue>(`/issues/${id}`);
    return res.data;
  },

  async createIssue(data: CreateIssuePayload): Promise<Issue> {
    const res = await api.post<Issue>('/issues/', data);
    return res.data;
  },

  async updateIssue(id: number, data: UpdateIssuePayload): Promise<Issue> {
    const res = await api.put<Issue>(`/issues/${id}`, data);
    return res.data;
  },

  async deleteIssue(id: number): Promise<void> {
    await api.delete(`/issues/${id}`);
  },

  async getComments(issueId: number): Promise<Comment[]> {
    const res = await api.get<Comment[]>(`/issues/${issueId}/comments`);
    return res.data;
  },

  async addComment(issueId: number, content: string): Promise<Comment> {
    const res = await api.post<Comment>(`/issues/${issueId}/comments`, { content });
    return res.data;
  },

  async deleteComment(commentId: number): Promise<void> {
    await api.delete(`/issues/comments/${commentId}`);
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const res = await api.get<DashboardStats>('/stats/dashboard');
    return res.data;
  },
};
