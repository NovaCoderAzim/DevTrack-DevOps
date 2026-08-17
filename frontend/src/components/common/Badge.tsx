import React from 'react';
import { IssueStatus, IssuePriority } from '../../types';

interface StatusBadgeProps {
  status: IssueStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const formatted = status.replace('_', ' ');
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium uppercase tracking-wider badge-${status.toLowerCase()}`}>
      {formatted}
    </span>
  );
};

interface PriorityBadgeProps {
  priority: IssuePriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium uppercase tracking-wider badge-${priority.toLowerCase()}`}>
      {priority}
    </span>
  );
};
