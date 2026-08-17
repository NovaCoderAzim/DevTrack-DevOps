import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CircleDot, Users, Settings, Hexagon, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const getNavItems = () => {
    if (user?.role === 'ADMIN') {
      return [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Projects', path: '/projects', icon: FolderKanban },
        { name: 'Issues', path: '/issues', icon: CircleDot },
        { name: 'Employees', path: '/employees', icon: Users },
        { name: 'Settings', path: '/settings', icon: Settings },
      ];
    } else if (user?.role === 'PROJECT_MANAGER') {
      return [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Projects', path: '/projects', icon: FolderKanban },
        { name: 'Issues', path: '/issues', icon: CircleDot },
        { name: 'Team', path: '/employees', icon: Users },
        { name: 'Settings', path: '/settings', icon: Settings },
      ];
    } else {
      // DEVELOPER
      return [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'My Projects', path: '/projects', icon: FolderKanban },
        { name: 'My Issues', path: '/issues', icon: CircleDot },
        { name: 'Settings', path: '/settings', icon: Settings },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 fixed top-0 bottom-0 left-0 flex flex-col z-30 shadow-sm">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Hexagon className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight tracking-tight">DevTrack</h1>
            <p className="text-[11px] font-medium text-slate-500">Issue & Task Management</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold border-l-4 border-indigo-600 pl-2.5'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase shrink-0 shadow-inner">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-semibold text-slate-900 truncate">{user?.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                user?.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                user?.role === 'PROJECT_MANAGER' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
              }`}>
                {user?.role === 'PROJECT_MANAGER' ? 'PM' : user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
