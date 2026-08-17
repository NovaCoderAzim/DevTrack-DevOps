import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../../types';
import { FolderKanban, Layers, User } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-brand-300 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded bg-brand-50 text-brand-700 font-mono text-xs font-bold border border-brand-200">
            {project.key}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Created {new Date(project.created_at).toLocaleDateString()}
          </span>
        </div>

        <Link to={`/projects/${project.id}`} className="text-lg font-bold text-slate-900 hover:text-brand-600 mb-2 block">
          {project.name}
        </Link>

        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {project.description || 'No description provided.'}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span>Owner: {project.owner?.name || 'Admin'}</span>
        </div>

        <div className="flex items-center gap-1 font-semibold text-slate-700">
          <Layers className="w-3.5 h-3.5 text-brand-600" />
          <span>{project.issue_count || 0} issues</span>
        </div>
      </div>
    </div>
  );
};
