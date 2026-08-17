import React, { useState, useEffect } from 'react';
import { Search, Plus, UserCheck, UserX, Edit2, ChevronLeft, ChevronRight, Filter, RefreshCw, X, ShieldAlert } from 'lucide-react';
import { userService, UserFilterParams } from '../services/userService';
import { projectService } from '../services/projectService';
import { User, UserRole, Project } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';

export const EmployeesPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'ADMIN';

  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const limit = 10;

  // Filters
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [projectFilter, setProjectFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('DEVELOPER');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formProjectIds, setFormProjectIds] = useState<number[]>([]);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: UserFilterParams = {
        page,
        limit,
      };
      if (search.trim()) params.search = search.trim();
      if (roleFilter) params.role = roleFilter as UserRole;
      if (projectFilter) params.project_id = Number(projectFilter);
      if (statusFilter !== '') params.is_active = statusFilter === 'true';

      const res = await userService.getUsers(params);
      setUsers(res.items);
      setTotal(res.total);
      setPages(res.pages);
    } catch (err: any) {
      console.error('Failed to load employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const projs = await projectService.getProjects();
      setProjects(projs);
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter, projectFilter, statusFilter]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleResetFilters = () => {
    setSearch('');
    setRoleFilter('');
    setProjectFilter('');
    setStatusFilter('');
    setPage(1);
  };

  const openCreateModal = () => {
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setFormRole('DEVELOPER');
    setFormIsActive(true);
    setFormProjectIds([]);
    setFormError('');
    setIsCreateModalOpen(true);
  };

  const openEditModal = (u: User) => {
    setSelectedUser(u);
    setFormName(u.name);
    setFormEmail(u.email);
    setFormPassword('');
    setFormRole(u.role);
    setFormIsActive(u.is_active);
    setFormProjectIds([]);
    setFormError('');
    setIsEditModalOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formPassword.trim()) {
      setFormError('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      await userService.createUser({
        name: formName.trim(),
        email: formEmail.trim(),
        password: formPassword,
        role: formRole,
        is_active: formIsActive,
        project_ids: formProjectIds,
      });
      setIsCreateModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      setFormError(err.response?.data?.detail || 'Failed to create employee');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setSubmitting(true);
    setFormError('');
    try {
      await userService.updateUser(selectedUser.id, {
        name: formName.trim(),
        email: formEmail.trim(),
        password: formPassword.trim() || undefined,
        role: formRole,
        is_active: formIsActive,
        project_ids: formProjectIds,
      });
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      setFormError(err.response?.data?.detail || 'Failed to update employee');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (u: User) => {
    try {
      await userService.toggleUserStatus(u.id, !u.is_active);
      fetchUsers();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isAdmin ? 'Employee Management' : 'Project Team Members'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isAdmin
              ? 'Manage organization accounts, role assignments, and active employee status.'
              : 'View project team members and resource allocations.'}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={openCreateModal} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Employee
          </Button>
        )}
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">ADMIN</option>
            <option value="PROJECT_MANAGER">PROJECT MANAGER</option>
            <option value="DEVELOPER">DEVELOPER</option>
          </select>

          <select
            value={projectFilter}
            onChange={(e) => {
              setProjectFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.key})
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">All Statuses</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>

          {(search || roleFilter || projectFilter || statusFilter) && (
            <button
              onClick={handleResetFilters}
              className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}
        </div>
      </Card>

      {/* Employees Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Projects</th>
                <th className="py-3 px-4">Status</th>
                {isAdmin && <th className="py-3 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
                    Loading employees...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No employees found matching criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className={`hover:bg-slate-50/80 transition-colors ${!u.is_active ? 'bg-slate-50/50' : ''}`}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm uppercase shadow-xs">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-snug">{u.name}</p>
                          <p className="text-xs text-slate-400">ID #{u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-xs">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                        u.role === 'PROJECT_MANAGER' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                        'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {u.role === 'PROJECT_MANAGER' ? 'PROJECT MANAGER' : u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-bold">
                        {u.project_count || 0} Assigned
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        u.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(u)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Employee"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              u.is_active
                                ? 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                                : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={u.is_active ? 'Deactivate Employee (Preserves History)' : 'Activate Employee'}
                          >
                            {u.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    )}
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
            <span className="font-semibold text-slate-900">{pages}</span> ({total} Total Employees)
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

      {/* Create Employee Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Add New Employee">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              {formError}
            </div>
          )}
          <Input label="Full Name" value={formName} onChange={(e) => setFormName(e.target.value)} required placeholder="e.g. Sarah Connor" />
          <Input label="Email Address" type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required placeholder="sarah@devtrack.io" />
          <Input label="Password" type="password" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} required placeholder="••••••••" />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Role Assignment</label>
            <select
              value={formRole}
              onChange={(e) => setFormRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="DEVELOPER">DEVELOPER (Task Execution)</option>
              <option value="PROJECT_MANAGER">PROJECT MANAGER (Team & Project Scope)</option>
              <option value="ADMIN">ADMINISTRATOR (Full Platform Scope)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Project Assignments</label>
            <div className="space-y-1.5 max-h-32 overflow-y-auto border border-slate-200 rounded-lg p-2 bg-slate-50/50">
              {projects.map((p) => (
                <label key={p.id} className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formProjectIds.includes(p.id)}
                    onChange={(e) => {
                      if (e.target.checked) setFormProjectIds([...formProjectIds, p.id]);
                      else setFormProjectIds(formProjectIds.filter((id) => id !== p.id));
                    }}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{p.name} [{p.key}]</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <Button variant="secondary" type="button" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create Employee'}</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit Employee: ${selectedUser?.name}`}>
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              {formError}
            </div>
          )}
          <Input label="Full Name" value={formName} onChange={(e) => setFormName(e.target.value)} required />
          <Input label="Email Address" type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required />
          <Input label="New Password (Leave blank to keep current)" type="password" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} placeholder="••••••••" />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Role Assignment</label>
            <select
              value={formRole}
              onChange={(e) => setFormRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="DEVELOPER">DEVELOPER</option>
              <option value="PROJECT_MANAGER">PROJECT MANAGER</option>
              <option value="ADMIN">ADMINISTRATOR</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Account Status</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={formIsActive}
                  onChange={() => setFormIsActive(true)}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                Active
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={!formIsActive}
                  onChange={() => setFormIsActive(false)}
                  className="text-rose-600 focus:ring-rose-500"
                />
                Inactive (Preserves Historical Ownership)
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Project Assignments</label>
            <div className="space-y-1.5 max-h-32 overflow-y-auto border border-slate-200 rounded-lg p-2 bg-slate-50/50">
              {projects.map((p) => (
                <label key={p.id} className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formProjectIds.includes(p.id)}
                    onChange={(e) => {
                      if (e.target.checked) setFormProjectIds([...formProjectIds, p.id]);
                      else setFormProjectIds(formProjectIds.filter((id) => id !== p.id));
                    }}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{p.name} [{p.key}]</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <Button variant="secondary" type="button" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save Changes'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
