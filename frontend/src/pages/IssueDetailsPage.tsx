import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { issueService } from '../services/issueService';
import { projectService } from '../services/projectService';
import { userService } from '../services/userService';
import { Issue, Comment, Project, User, IssueStatus, IssuePriority } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { IssueFormModal } from '../components/issues/IssueFormModal';
import { ArrowLeft, Edit, Trash2, MessageSquare, Send, Calendar, UserCheck, Folder, ShieldAlert } from 'lucide-react';

export const IssueDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [issue, setIssue] = useState<Issue | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newComment, setNewComment] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchIssueDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError('');
      const issueData = await issueService.getIssue(Number(id));
      setIssue(issueData);

      const [commentsData, projectsData, usersRes] = await Promise.all([
        issueService.getComments(Number(id)),
        projectService.getProjects(),
        userService.getUsers({ limit: 100 }),
      ]);
      setComments(commentsData);
      setProjects(projectsData);
      setUsers(usersRes.items);
    } catch (err: any) {
      console.error('Failed to load issue details', err);
      if (err.response?.status === 403) {
        setError('403 Forbidden: You do not have permission to view this issue.');
      } else if (err.response?.status === 404) {
        setError('404 Not Found: The requested issue does not exist.');
      } else {
        setError('Failed to load issue details.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssueDetails();
  }, [id]);

  const handleUpdateStatus = async (newStatus: IssueStatus) => {
    if (!issue) return;
    try {
      const updated = await issueService.updateIssue(issue.id, { status: newStatus });
      setIssue(updated);
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleUpdatePriority = async (newPriority: IssuePriority) => {
    if (!issue) return;
    try {
      const updated = await issueService.updateIssue(issue.id, { priority: newPriority });
      setIssue(updated);
    } catch (err) {
      console.error('Failed to update priority', err);
    }
  };

  const handleUpdateAssignee = async (newAssigneeId: number) => {
    if (!issue) return;
    try {
      const updated = await issueService.updateIssue(issue.id, { assigned_to: newAssigneeId });
      setIssue(updated);
    } catch (err) {
      console.error('Failed to update assignee', err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue || !newComment.trim()) return;
    try {
      setCommentSubmitting(true);
      const comment = await issueService.addComment(issue.id, newComment.trim());
      setComments([...comments, comment]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment', err);
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await issueService.deleteComment(commentId);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error('Failed to delete comment', err);
    }
  };

  const handleDeleteIssue = async () => {
    if (!issue || !window.confirm('Are you sure you want to delete this issue?')) return;
    try {
      await issueService.deleteIssue(issue.id);
      navigate('/issues');
    } catch (err) {
      console.error('Failed to delete issue', err);
    }
  };

  const handleEditIssue = async (data: any) => {
    if (!issue) return;
    const updated = await issueService.updateIssue(issue.id, data);
    setIssue(updated);
    setIsEditModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="space-y-4 max-w-lg mx-auto py-12">
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-sm">Access Restricted</h3>
            <p className="text-xs text-rose-700 mt-1">{error || 'Issue not found'}</p>
          </div>
        </div>
        <Link to="/issues" className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to My Issues
        </Link>
      </div>
    );
  }

  const isAuthorOrAdmin = currentUser?.role === 'ADMIN' || currentUser?.id === issue.created_by;

  return (
    <div className="space-y-6">
      <Link to="/issues" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Issues List
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Left Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="font-mono text-xs font-bold text-indigo-700 px-2.5 py-1 bg-indigo-50 rounded border border-indigo-200">
                {issue.issue_key}
              </span>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => setIsEditModalOpen(true)} className="gap-1">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </Button>
                {isAuthorOrAdmin && (
                  <Button variant="secondary" size="sm" onClick={handleDeleteIssue} className="gap-1 text-rose-600 hover:bg-rose-50 border-rose-200">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </Button>
                )}
              </div>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-4">{issue.title}</h1>

            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-lg border border-slate-100">
                {issue.description || 'No detailed description provided.'}
              </p>
            </div>
          </Card>

          {/* Activity / Comments Section */}
          <Card>
            <h3 className="font-semibold text-slate-900 mb-6 flex items-center gap-2 pb-3 border-b border-slate-100">
              <MessageSquare className="w-4 h-4 text-indigo-600" /> Activity Thread ({comments.length})
            </h3>

            {/* Comment List */}
            <div className="space-y-4 mb-6">
              {comments.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No comments yet on this issue.</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase">
                          {c.user.name.charAt(0)}
                        </div>
                        <span className="text-xs font-semibold text-slate-900">{c.user.name}</span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(c.created_at).toLocaleString()}
                        </span>
                      </div>
                      {(currentUser?.role === 'ADMIN' || currentUser?.id === c.user_id) && (
                        <button
                          onClick={() => handleDeleteComment(c.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                          title="Delete comment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed pl-8">{c.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="flex items-start gap-3 border-t border-slate-100 pt-4">
              <textarea
                rows={2}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment or status update..."
                className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Button type="submit" size="sm" disabled={commentSubmitting} className="gap-1 mt-1">
                <Send className="w-3.5 h-3.5" /> Post
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Metadata Sidebar */}
        <div className="space-y-6">
          <Card className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              Issue Controls & Metadata
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Status</label>
              <div className="flex items-center gap-2">
                <StatusBadge status={issue.status} />
                <select
                  value={issue.status}
                  onChange={(e) => handleUpdateStatus(e.target.value as IssueStatus)}
                  className="text-xs bg-white border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 font-semibold cursor-pointer"
                >
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Priority</label>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={issue.priority} />
                {currentUser?.role === 'DEVELOPER' && issue.assigned_to !== currentUser.id ? null : (
                  <select
                    value={issue.priority}
                    onChange={(e) => handleUpdatePriority(e.target.value as IssuePriority)}
                    className="text-xs bg-white border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 font-semibold cursor-pointer"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Assignee</label>
              {currentUser?.role === 'DEVELOPER' ? (
                <div className="flex items-center gap-2 py-1">
                  {issue.assignee ? (
                    <>
                      <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase">
                        {issue.assignee.name.charAt(0)}
                      </div>
                      <span className="text-xs font-semibold text-slate-900">{issue.assignee.name}</span>
                    </>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Unassigned</span>
                  )}
                </div>
              ) : (
                <select
                  value={issue.assigned_to || 0}
                  onChange={(e) => handleUpdateAssignee(Number(e.target.value))}
                  className="w-full text-xs bg-white border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 font-semibold cursor-pointer"
                >
                  <option value={0}>Unassigned</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs space-y-2.5">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1 font-medium"><Folder className="w-3.5 h-3.5 text-slate-400" /> Project:</span>
                <span className="font-semibold text-slate-900">{issue.project?.name || `ID #${issue.project_id}`}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1 font-medium"><UserCheck className="w-3.5 h-3.5 text-slate-400" /> Reporter:</span>
                <span className="font-semibold text-slate-900">{issue.creator.name}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1 font-medium"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Created:</span>
                <span className="text-slate-700">{new Date(issue.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <IssueFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditIssue}
        projects={projects}
        users={users}
        initialData={issue}
      />
    </div>
  );
};
