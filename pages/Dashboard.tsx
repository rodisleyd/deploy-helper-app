import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, deleteProject } from '../services/storageService';
import { Project, ProjectStatus } from '../types';
import { Plus, Server, Terminal, Trash2, ChevronRight, Box } from 'lucide-react';
import { Button } from '../components/Button';

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  const loadProjects = () => {
    const data = getProjects();
    // Sort by newest first
    setProjects(data.sort((a, b) => b.createdAt - a.createdAt));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      deleteProject(id);
      loadProjects();
    }
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.COMPLETED: return 'bg-green-100 text-green-700';
      case ProjectStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Seus Projetos</h1>
          <p className="text-slate-500 mt-1">Gerencie e acompanhe seus pipelines de deploy.</p>
        </div>
        <Link to="/new">
          <Button size="lg">
            <Plus size={18} className="mr-2" />
            Novo Projeto
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Box className="text-slate-400" size={32} />
          </div>
          <h3 className="text-lg font-medium text-slate-900">Nenhum projeto ainda</h3>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">
            Comece criando seu primeiro projeto. Descreva sua stack e geraremos um guia de deploy personalizado para você.
          </p>
          <Link to="/new" className="inline-block mt-6">
            <Button variant="outline">Criar Projeto</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link 
              to={`/project/${project.id}`} 
              key={project.id}
              className="group bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary-200 transition-all flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
                <button 
                  onClick={(e) => handleDelete(e, project.id)}
                  className="text-slate-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                  title="Excluir projeto"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <h3 className="font-semibold text-slate-900 text-lg group-hover:text-primary-600 transition-colors">
                {project.name}
              </h3>
              <p className="text-sm text-slate-500 mt-1 mb-4 line-clamp-2">
                {project.description || "Sem descrição."}
              </p>
              
              <div className="mt-auto space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Terminal size={14} />
                  <span className="truncate">{project.techStack.slice(0, 3).join(', ')}{project.techStack.length > 3 ? '...' : ''}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Server size={14} />
                  <span className="truncate">{project.hostingTarget}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                 <span className="text-xs text-slate-400">
                    {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                 </span>
                 <span className="text-primary-600 group-hover:translate-x-1 transition-transform">
                    <ChevronRight size={18} />
                 </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;