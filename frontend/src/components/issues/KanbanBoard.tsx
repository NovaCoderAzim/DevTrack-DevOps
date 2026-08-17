import React from 'react';
import { Issue, IssueStatus } from '../../types';
import { IssueCard } from './IssueCard';

interface KanbanBoardProps {
  issues: Issue[];
  onStatusChange: (issueId: number, newStatus: IssueStatus) => void;
}

const columns: { title: string; status: IssueStatus; color: string }[] = [
  { title: 'To Do', status: 'TODO', color: 'border-slate-300' },
  { title: 'In Progress', status: 'IN_PROGRESS', color: 'border-blue-400' },
  { title: 'Resolved', status: 'RESOLVED', color: 'border-emerald-400' },
  { title: 'Closed', status: 'CLOSED', color: 'border-purple-400' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ issues, onStatusChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map((col) => {
        const colIssues = issues.filter((i) => i.status === col.status);
        return (
          <div key={col.status} className="bg-slate-100/70 p-4 rounded-xl border border-slate-200 flex flex-col min-h-[500px]">
            <div className={`flex items-center justify-between pb-3 mb-4 border-b-2 ${col.color}`}>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">{col.title}</h4>
              <span className="bg-slate-200 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {colIssues.length}
              </span>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto">
              {colIssues.length === 0 ? (
                <div className="p-4 text-center border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-xs font-medium">
                  No issues in {col.title}
                </div>
              ) : (
                colIssues.map((issue) => (
                  <div key={issue.id} className="relative group">
                    <IssueCard issue={issue} />
                    {/* Quick status movement select */}
                    <div className="mt-1 flex justify-end">
                      <select
                        value={issue.status}
                        onChange={(e) => onStatusChange(issue.id, e.target.value as IssueStatus)}
                        className="text-[11px] bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-600 focus:outline-none hover:border-brand-500"
                      >
                        <option value="TODO">Move to TODO</option>
                        <option value="IN_PROGRESS">Move to IN PROGRESS</option>
                        <option value="RESOLVED">Move to RESOLVED</option>
                        <option value="CLOSED">Move to CLOSED</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
