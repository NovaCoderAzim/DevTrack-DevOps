import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { issueService } from '../services/issueService';
import { projectService } from '../services/projectService';
import { userService } from '../services/userService';
import { Issue, Project, User, IssueStatus, IssuePriority } from '../types';
import { IssueFilterBar } from '../components/issues/IssueFilterBar';
import { KanbanBoard } from '../components/issues/KanbanBoard';
import { IssueFormModal } from '../components/issues/IssueFormModal';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Plus, ChevronLeft, ChevronRight, User as UserIcon, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const IssuesPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchInitialData = async () => {
    try {
      const [pData, uRes] = await Promise.all([
        projectService.getProjects(),
        userService.getUsers({ limit: 100 }),
      ]);
      setProjects(pData);
      setUsers(uRes.items);
    } catch (err) {
      console.error('Failed to fetch filter options', err);
    }
  };

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await issueService.getIssues({
        search: search.trim() || undefined,
        status: statusFilter ? (statusFilter as any) : undefined,
        priority: priorityFilter ? (priorityFilter as any) : undefined,
        project_id: projectFilter ? Number(projectFilter) : undefined,
        assigned_to: assigneeFilter ? Number(assigneeFilter) : undefined,
        page,
        limit,
      });
      setIssues(res.items);
      setTotal(res.total);
      setPages(res.pages);
    } catch (err) {
      console.error('Failed to fetch issues', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchIssues();
    }, 200);
    return () => clearTimeout(handler);
  }, [search, statusFilter, priorityFilter, projectFilter, assigneeFilter, page]);

  const handleCreateIssue = async (data: any) => {
    await issueService.createIssue(data);
    fetchIssues();
  };

  const handleStatusChange = async (issueId: number, newStatus: IssueStatus) => {
    await issueService.updateIssue(issueId, { status: newStatus });
    fetchIssues();
  };

  const handlePriorityChange = async (issueId: number, newPriority: IssuePriority) => {
    await issueService.updateIssue(issueId, { priority: newPriority });
    fetchIssues();
  };

  const handleAssigneeChange = async (issueId: number, newAssigneeId: number) => {
    await issueService.updateIssue(issueId, { assigned_to: newAssigneeId });
    fetchIssues();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {currentUser?.role === 'DEVELOPER' ? 'My Assigned Issues' : 'Workspace Issues & Tasks'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {currentUser?.role === 'DEVELOPER'
              ? 'Track and update your personal assigned task workflow.'
              : 'Search, filter, and assign tasks across engineering projects.'}
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Create Issue
        </Button>
      </div>

      <IssueFilterBar
        search={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        status={statusFilter}
        onStatusChange={(val) => { setStatusFilter(val); setPage(1); }}
        priority={priorityFilter}
        onPriorityChange={(val) => { setPriorityFilter(val); setPage(1); }}
        projectId={projectFilter}
        onProjectChange={(val) => { setProjectFilter(val); setPage(1); }}
        assigneeId={assigneeFilter}
        onAssigneeChange={(val) => { setAssigneeFilter(val); setPage(1); }}
        projects={projects}
        users={users}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : viewMode === 'kanban' ? (
        <KanbanBoard issues={issues} onStatusChange={handleStatusChange} />
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Key</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Assignee</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {issues.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                      No matching issues found. Try adjusting filter parameters.
                    </td>
                  </tr>
                ) : (
                  issues.map((issue) => (
                    <tr key={issue.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                        <Link to={`/issues/${issue.id}`} className="hover:underline">
                          {issue.issue_key}
                        </Link>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs truncate">
                        <Link to={`/issues/${issue.id}`} className="hover:text-indigo-600 hover:underline">
                          {issue.title}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-semibold">
                          {issue.project?.name || `Project #${issue.project_id}`}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {issue.assignee ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold uppercase shadow-xs">
                              {issue.assignee.name.charAt(0)}
                            </div>
                            <span className="text-xs font-medium text-slate-800">{issue.assignee.name}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic flex items-center gap-1">
                            <UserIcon className="w-3.5 h-3.5" /> Unassigned
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {currentUser?.role === 'DEVELOPER' && issue.assigned_to !== currentUser.id ? (
                          <PriorityBadge priority={issue.priority} />
                        ) : (
                          <select
                            value={issue.priority}
                            onChange={(e) => handlePriorityChange(issue.id, e.target.value as IssuePriority)}
                            className="text-xs font-semibold px-2 py-1 rounded border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                          >
                            <option value="LOW">LOW</option>
                            <option value="MEDIUM">MEDIUM</option>
                            <option value="HIGH">HIGH</option>
                            <option value="CRITICAL">CRITICAL</option>
                          </select>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={issue.status}
                          onChange={(e) => handleStatusChange(issue.id, e.target.value as IssueStatus)}
                          className="text-xs font-semibold px-2 py-1 rounded border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                        >
                          <option value="TODO">TODO</option>
                          <option value="IN_PROGRESS">IN PROGRESS</option>
                          <option value="RESOLVED">RESOLVED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-400">
                        {new Date(issue.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/issues/${issue.id}`}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                          View Details →
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <div>
              Showing Page <span className="font-semibold text-slate-900">{page}</span> of{' '}
              <span className="font-semibold text-slate-900">{pages}</span> ({total} Total Issues)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= pages}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
              >
                Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      <IssueFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateIssue}
        projects={projects}
        users={users}
      />
    </div>
  );
};
