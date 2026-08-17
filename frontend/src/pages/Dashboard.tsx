import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { issueService } from '../services/issueService';
import { projectService } from '../services/projectService';
import { userService } from '../services/userService';
import { DashboardStats, Project, User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { IssueFormModal } from '../components/issues/IssueFormModal';
import { FolderKanban, Bug, Clock, AlertTriangle, Users, Plus, CheckCircle2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [sData, pData, uRes] = await Promise.all([
        issueService.getDashboardStats(),
        projectService.getProjects(),
        userService.getUsers({ limit: 100 }),
      ]);
      setStats(sData);
      setProjects(pData);
      setUsers(uRes.items);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateIssue = async (data: any) => {
    await issueService.createIssue(data);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const roleTitle =
    user?.role === 'ADMIN'
      ? 'Platform Overview & Performance'
      : user?.role === 'PROJECT_MANAGER'
      ? 'Managed Projects & Team Overview'
      : 'My Personal Work Workspace';

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back, {user?.name}!</h2>
          <p className="text-sm text-slate-500 mt-1">{roleTitle}</p>
        </div>
        <Button onClick={() => setIsIssueModalOpen(true)} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Create Issue
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="flex items-center justify-between p-5 border-l-4 border-l-indigo-500">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {user?.role === 'ADMIN' ? 'Total Projects' : 'Assigned Projects'}
            </p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats?.total_projects || 0}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FolderKanban className="w-6 h-6" />
          </div>
        </Card>

        {user?.role === 'ADMIN' ? (
          <Card className="flex items-center justify-between p-5 border-l-4 border-l-purple-500">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Employees</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats?.total_employees || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </Card>
        ) : (
          <Card className="flex items-center justify-between p-5 border-l-4 border-l-blue-500">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {user?.role === 'DEVELOPER' ? 'My Assigned Issues' : 'Open Project Tasks'}
              </p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats?.total_issues || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bug className="w-6 h-6" />
            </div>
          </Card>
        )}

        <Card className="flex items-center justify-between p-5 border-l-4 border-l-amber-500">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Progress</p>
            <h3 className="text-3xl font-bold text-amber-600 mt-1">{stats?.in_progress_issues || 0}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </Card>

        <Card className="flex items-center justify-between p-5 border-l-4 border-l-rose-500">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">High / Critical</p>
            <h3 className="text-3xl font-bold text-rose-600 mt-1">
              {(stats?.high_priority_issues || 0) + (stats?.critical_priority_issues || 0)}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Issues Table */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 text-sm">
                {user?.role === 'DEVELOPER' ? 'My Recent Tasks' : 'Recent Workspace Issues'}
              </h3>
              <Link to="/issues" className="text-xs font-semibold text-indigo-600 hover:underline">
                View all issues &rarr;
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Key</th>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Assignee</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {!stats?.recent_issues || stats.recent_issues.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                        No issues found for your role scope.
                      </td>
                    </tr>
                  ) : (
                    stats.recent_issues.map((issue) => (
                      <tr key={issue.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                          <Link to={`/issues/${issue.id}`}>{issue.issue_key}</Link>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs truncate">
                          <Link to={`/issues/${issue.id}`} className="hover:underline">
                            {issue.title}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {issue.assignee ? issue.assignee.name : 'Unassigned'}
                        </td>
                        <td className="py-3 px-4">
                          <PriorityBadge priority={issue.priority} />
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={issue.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Admin / PM Workload Distribution Breakdown */}
          {user?.role !== 'DEVELOPER' && stats?.employee_workload && (
            <Card>
              <h3 className="font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100 text-sm">
                Employee Task Allocation Breakdown
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(stats.employee_workload).map(([name, count]) => (
                  <div key={name} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        {name.charAt(0)}
                      </div>
                      <span className="text-xs font-semibold text-slate-800">{name}</span>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                      {count} Tasks
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Status Distribution Summary */}
        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-slate-900 mb-4 pb-3 border-b border-slate-100 text-sm">
              Status Breakdown
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600">To Do</span>
                  <span className="text-slate-900">{stats?.open_issues || 0}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-slate-400 h-2 rounded-full"
                    style={{
                      width: `${stats?.total_issues ? ((stats.open_issues / stats.total_issues) * 100).toFixed(0) : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600">In Progress</span>
                  <span className="text-amber-600">{stats?.in_progress_issues || 0}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{
                      width: `${stats?.total_issues ? ((stats.in_progress_issues / stats.total_issues) * 100).toFixed(0) : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600">Resolved</span>
                  <span className="text-emerald-600">{stats?.resolved_issues || 0}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{
                      width: `${stats?.total_issues ? ((stats.resolved_issues / stats.total_issues) * 100).toFixed(0) : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600">Closed</span>
                  <span className="text-purple-600">{stats?.closed_issues || 0}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{
                      width: `${stats?.total_issues ? ((stats.closed_issues / stats.total_issues) * 100).toFixed(0) : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <IssueFormModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        onSubmit={handleCreateIssue}
        projects={projects}
        users={users}
      />
    </div>
  );
};
