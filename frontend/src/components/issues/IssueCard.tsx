import React from 'react';
import { Link } from 'react-router-dom';
import { Issue } from '../../types';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { User as UserIcon } from 'lucide-react';

interface IssueCardProps {
  issue: Issue;
  onStatusChange?: (issueId: number, status: any) => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onStatusChange }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:border-brand-300 transition-colors flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <Link
            to={`/issues/${issue.id}`}
            className="font-mono text-xs font-semibold text-brand-600 hover:underline"
          >
            {issue.issue_key}
          </Link>
          <PriorityBadge priority={issue.priority} />
        </div>

        <Link
          to={`/issues/${issue.id}`}
          className="text-sm font-semibold text-slate-900 hover:text-brand-600 line-clamp-2 mb-2"
        >
          {issue.title}
        </Link>

        {issue.description && (
          <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
            {issue.description}
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px]">
            {issue.assignee?.name.charAt(0) || '?'}
          </div>
          <span className="truncate max-w-[100px]">{issue.assignee ? issue.assignee.name : 'Unassigned'}</span>
        </div>

        <StatusBadge status={issue.status} />
      </div>
    </div>
  );
};
