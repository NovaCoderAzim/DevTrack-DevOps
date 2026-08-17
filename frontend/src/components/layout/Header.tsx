import React from 'react';
import { LogOut, User as UserIcon, Shield, Briefcase, Code } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const getRoleBadge = () => {
    if (user?.role === 'ADMIN') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 shadow-sm">
          <Shield className="w-3.5 h-3.5" /> Administrator
        </span>
      );
    }
    if (user?.role === 'PROJECT_MANAGER') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
          <Briefcase className="w-3.5 h-3.5" /> Project Manager
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 shadow-sm">
        <Code className="w-3.5 h-3.5 text-slate-500" /> Developer
      </span>
    );
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 fixed top-0 right-0 left-64 z-20 flex items-center justify-between px-8 shadow-xs">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">DevTrack SaaS</span>
        <span className="h-4 w-px bg-slate-200" />
        {getRoleBadge()}
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2.5 text-sm text-slate-800 font-medium">
          <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-semibold text-xs">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <span>{user?.name}</span>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 transition-all cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5 text-slate-500" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};
