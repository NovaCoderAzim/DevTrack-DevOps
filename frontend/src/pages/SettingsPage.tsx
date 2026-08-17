import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { User, Shield, Lock, Bell, CheckCircle2, ShieldCheck, Laptop } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences' | 'system'>('profile');

  // Password Change Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  // Preference Toggles
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [defaultView, setDefaultView] = useState('list');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      setPasswordMsg('New passwords do not match');
      return;
    }
    setPasswordMsg('Password updated successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Account & Platform Settings</h2>
        <p className="text-sm text-slate-500 mt-1">Manage your personal profile, account security, and workspace preferences.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'profile' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          User Profile
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'security' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Security & Password
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'preferences' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Preferences
        </button>
        {user?.role === 'ADMIN' && (
          <button
            onClick={() => setActiveTab('system')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'system' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            System Info
          </button>
        )}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 space-y-4">
            <h3 className="font-semibold text-slate-900 text-sm pb-3 border-b border-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" /> Personal Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  disabled
                  value={user?.name || ''}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Assigned Role</label>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <Shield className="w-3.5 h-3.5" /> {user?.role}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-2xl uppercase mb-3 shadow-inner">
              {user?.name?.charAt(0)}
            </div>
            <h4 className="font-bold text-slate-900 text-base">{user?.name}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            <span className="mt-3 px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Account Active
            </span>
          </Card>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Card className="max-w-xl space-y-4">
          <h3 className="font-semibold text-slate-900 text-sm pb-3 border-b border-slate-100 flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600" /> Change Account Password
          </h3>
          {passwordMsg && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {passwordMsg}
            </div>
          )}
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            <Input label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <Input label="Confirm New Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            <div className="pt-2">
              <Button type="submit">Update Password</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <Card className="max-w-xl space-y-6">
          <h3 className="font-semibold text-slate-900 text-sm pb-3 border-b border-slate-100 flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" /> Workspace Preferences
          </h3>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">Email Notifications</p>
                <p className="text-xs text-slate-500">Receive email alerts when assigned to an issue or mentioned in a comment.</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={(e) => setEmailNotifs(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            <div className="pt-3 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Default Workspace View</label>
              <select
                value={defaultView}
                onChange={(e) => setDefaultView(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="list">List View (Structured Table)</option>
                <option value="kanban">Kanban Board (Visual Drag & Drop)</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* System Tab (Admin Only) */}
      {activeTab === 'system' && user?.role === 'ADMIN' && (
        <Card className="max-w-xl space-y-4">
          <h3 className="font-semibold text-slate-900 text-sm pb-3 border-b border-slate-100 flex items-center gap-2">
            <Laptop className="w-4 h-4 text-indigo-600" /> Platform Operational Status
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Application Version</span>
              <span className="font-mono font-bold text-slate-900">DevTrack v1.2.0</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Database Status</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" /> PostgreSQL Operational
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">API Endpoint</span>
              <span className="font-mono text-slate-700">/api/v1</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-600 font-medium">Authentication Engine</span>
              <span className="font-semibold text-indigo-600">OAuth2 Bearer JWT (HS256)</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
