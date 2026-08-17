import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { issueService } from '../services/issueService';
import { userService } from '../services/userService';
import { Project, Issue, User } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { IssueFormModal } from '../components/issues/IssueFormModal';
import { ProjectFormModal } from '../components/projects/ProjectFormModal';
import { Modal } from '../components/common/Modal';
import { ArrowLeft, Plus, Edit, Trash2, Layers, Users as UsersIcon, UserCheck, UserMinus, ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'team'>('overview');

  // Modals
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | ''>('');

  const fetchProjectData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [pData, iRes, uRes] = await Promise.all([
        projectService.getProject(Number(id)),
        issueService.getIssues({ project_id: Number(id), limit: 100 }),
        userService.getUsers({ limit: 100 }),
      ]);
      setProject(pData);
      setIssues(iRes.items);
      setAllUsers(uRes.items);
    } catch (err) {
      console.error('Failed to fetch project details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const handleCreateIssue = async (data: any) => {
    await issueService.createIssue(data);
    fetchProjectData();
  };

  const handleUpdateProject = async (data: any) => {
    if (!project) return;
    await projectService.updateProject(project.id, data);
    fetchProjectData();
  };

  const handleDeleteProject = async () => {
    if (!project || !window.confirm('Are you sure you want to delete this project? All associated issues will be removed.')) return;
    await projectService.deleteProject(project.id);
    navigate('/projects');
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !selectedMemberId) return;
    try {
      await projectService.addProjectMember(project.id, Number(selectedMemberId));
      setIsAddMemberModalOpen(false);
      setSelectedMemberId('');
      fetchProjectData();
    } catch (err) {
      console.error('Failed to add member', err);
    }
  };

  const handleRemoveMember = async (userId: number) => {
    if (!project || !window.confirm('Remove this team member from project?')) return;
    try {
      await projectService.removeProjectMember(project.id, userId);
      fetchProjectData();
    } catch (err) {
      console.error('Failed to remove member', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>Project not found or access restricted.</p>
        <Link to="/projects" className="text-indigo-600 font-semibold hover:underline mt-2 inline-block">
          &larr; Back to projects
        </Link>
      </div>
    );
  }

  const isOwnerOrAdmin = currentUser?.role === 'ADMIN' || currentUser?.id === project.owner_id;

  const openIssuesCount = issues.filter((i) => i.status === 'TODO').length;
  const inProgressCount = issues.filter((i) => i.status === 'IN_PROGRESS').length;
  const resolvedCount = issues.filter((i) => i.status === 'RESOLVED' || i.status === 'CLOSED').length;
  const criticalCount = issues.filter((i) => i.priority === 'CRITICAL').length;

  return (
    <div className="space-y-6">
      <Link to="/projects" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects
      </Link>

      {/* Project Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 font-mono text-xs font-bold border border-indigo-200">
              {project.key}
            </span>
            <span className="text-xs text-slate-500 font-medium">Project Lead: <strong className="text-slate-900">{project.owner?.name}</strong></span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{project.name}</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">{project.description || 'No detailed description provided.'}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isOwnerOrAdmin && (
            <>
              <Button variant="secondary" size="sm" onClick={() => setIsEditProjectModalOpen(true)} className="gap-1.5">
                <Edit className="w-3.5 h-3.5" /> Edit
              </Button>
              <Button variant="secondary" size="sm" onClick={handleDeleteProject} className="gap-1.5 text-rose-600 hover:bg-rose-50 border-rose-200">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </Button>
            </>
          )}
          <Button onClick={() => setIsIssueModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Create Issue
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200 flex items-center gap-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('issues')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'issues' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Issues ({issues.length})
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'team' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Team Members ({project.members?.length || 0})
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 border-l-4 border-l-indigo-500">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Issues</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{issues.length}</p>
            </Card>
            <Card className="p-4 border-l-4 border-l-amber-500">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Open Tasks</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{openIssuesCount + inProgressCount}</p>
            </Card>
            <Card className="p-4 border-l-4 border-l-emerald-500">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Resolved Tasks</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{resolvedCount}</p>
            </Card>
            <Card className="p-4 border-l-4 border-l-rose-500">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Critical Priority</p>
              <p className="text-2xl font-bold text-rose-600 mt-1">{criticalCount}</p>
            </Card>
          </div>

          <Card>
            <h3 className="text-sm font-bold text-slate-900 mb-4">Recent Project Activity</h3>
            <div className="space-y-3">
              {issues.slice(0, 5).map((iss) => (
                <div key={iss.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-indigo-600">{iss.issue_key}</span>
                    <Link to={`/issues/${iss.id}`} className="text-xs font-semibold text-slate-900 hover:underline">
                      {iss.title}
                    </Link>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={iss.status} />
                    <span className="text-[11px] text-slate-400">{new Date(iss.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'issues' && (
        <Card className="p-0 overflow-hidden">
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
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {issues.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                      No issues created for this project yet.
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
                      <td className="py-3 px-4 font-semibold text-slate-900">
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
      )}

      {activeTab === 'team' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Assigned Team Members</h3>
            {isOwnerOrAdmin && (
              <Button size="sm" onClick={() => setIsAddMemberModalOpen(true)} className="gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add Member
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Owner Card */}
            <Card className="p-4 border-2 border-indigo-200 bg-indigo-50/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                    {project.owner?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{project.owner?.name}</p>
                    <p className="text-xs text-slate-500">{project.owner?.email}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 uppercase">
                  Project Lead
                </span>
              </div>
            </Card>

            {/* Team Members */}
            {project.members?.map((m) => (
              <Card key={m.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{m.name}</p>
                    <p className="text-xs text-slate-500">{m.email}</p>
                  </div>
                </div>
                {isOwnerOrAdmin && m.id !== project.owner_id && (
                  <button
                    onClick={() => handleRemoveMember(m.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove member"
                  >
                    <UserMinus className="w-4 h-4" />
                  </button>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add Team Member Modal */}
      <Modal isOpen={isAddMemberModalOpen} onClose={() => setIsAddMemberModalOpen(false)} title="Add Team Member to Project">
        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Select Employee</label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(Number(e.target.value))}
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">Choose an employee...</option>
              {allUsers
                .filter((u) => !project.members?.some((m) => m.id === u.id))
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email}) - {u.role}
                  </option>
                ))}
            </select>
          </div>
          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <Button variant="secondary" type="button" onClick={() => setIsAddMemberModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={!selectedMemberId}>Add to Team</Button>
          </div>
        </form>
      </Modal>

      <IssueFormModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        onSubmit={handleCreateIssue}
        projects={[project]}
        users={allUsers}
        defaultProjectId={project.id}
      />

      <ProjectFormModal
        isOpen={isEditProjectModalOpen}
        onClose={() => setIsEditProjectModalOpen(false)}
        onSubmit={handleUpdateProject}
        initialData={project}
      />
    </div>
  );
};
