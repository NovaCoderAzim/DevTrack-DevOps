export type UserRole = 'ADMIN' | 'PROJECT_MANAGER' | 'DEVELOPER';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  project_count?: number;
}

export interface Project {
  id: number;
  name: string;
  key: string;
  description?: string;
  owner_id: number;
  owner: User;
  created_at: string;
  updated_at: string;
  issue_count?: number;
  members?: User[];
}

export type IssueStatus = 'TODO' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type IssuePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ProjectMinimal {
  id: number;
  name: string;
  key: string;
}

export interface Issue {
  id: number;
  issue_key: string;
  title: string;
  description?: string;
  status: IssueStatus;
  priority: IssuePriority;
  project_id: number;
  assigned_to?: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  creator: User;
  assignee?: User;
  project?: ProjectMinimal;
}

export interface Comment {
  id: number;
  issue_id: number;
  user_id: number;
  content: string;
  created_at: string;
  user: User;
}

export interface DashboardStats {
  total_projects: number;
  total_employees?: number;
  total_issues: number;
  open_issues: number;
  in_progress_issues: number;
  resolved_issues: number;
  closed_issues: number;
  high_priority_issues: number;
  critical_priority_issues: number;
  status_counts: Record<string, number>;
  priority_counts: Record<string, number>;
  employee_workload?: Record<string, number>;
  project_issue_counts?: Record<string, number>;
  recent_issues: Issue[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
