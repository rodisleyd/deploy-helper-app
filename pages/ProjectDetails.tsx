import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, saveProject } from '../services/storageService';
import { Project, ProjectStatus } from '../types';
import { Button } from '../components/Button';
import { ChevronLeft, CheckCircle, Circle, Copy, FileCode, AlertTriangle, Terminal, Info } from 'lucide-react';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const p = getProjectById(id);
      if (p) {
        setProject(p);
      } else {
        navigate('/');
      }
    }
    setLoading(false);
  }, [id, navigate]);

  const toggleStep = (stepId: string) => {
    if (!project || !project.plan) return;

    const updatedSteps = project.plan.steps.map(step => 
      step.id === stepId ? { ...step, isCompleted: !step.isCompleted } : step
    );

    const allCompleted = updatedSteps.every(s => s.isCompleted);
    const updatedProject = {
      ...project,
      status: allCompleted ? ProjectStatus.COMPLETED : ProjectStatus.IN_PROGRESS,
      plan: {
        ...project.plan,
        steps: updatedSteps
      }
    };

    setProject(updatedProject);
    saveProject(updatedProject);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast here
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Carregando projeto...</div>;
  if (!project || !project.plan) return <div className="p-12 text-center text-slate-500">Dados do projeto não encontrados.</div>;

  const completedCount = project.plan.steps.filter(s => s.isCompleted).length;
  const progress = Math.round((completedCount / project.plan.steps.length) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Area */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center text-sm text-slate-500 hover:text-slate-800 mb-4"
        >
          <ChevronLeft size={16} className="mr-1" /> Voltar ao Dashboard
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              Deploy para <span className="font-semibold text-slate-700">{project.hostingTarget}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span>{project.type}</span>
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-slate-600 mb-1">{progress}% Concluído</span>
            <div className="w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-600 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Timeline */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h2 className="font-semibold text-lg text-slate-900">Checklist de Deploy</h2>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                  Gerado por IA
                </span>
             </div>
             
             <div className="divide-y divide-slate-100">
               {project.plan.steps.map((step, index) => (
                 <div key={step.id} className={`p-6 transition-colors ${step.isCompleted ? 'bg-slate-50/50' : 'bg-white'}`}>
                   <div className="flex items-start gap-4">
                     <button 
                       onClick={() => toggleStep(step.id)}
                       className={`mt-1 flex-shrink-0 transition-colors ${step.isCompleted ? 'text-green-500 hover:text-green-600' : 'text-slate-300 hover:text-primary-500'}`}
                     >
                       {step.isCompleted ? <CheckCircle size={24} className="fill-green-50" /> : <Circle size={24} />}
                     </button>
                     
                     <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2 mb-1">
                         <span className="text-xs font-mono text-slate-400">PASSO {index + 1}</span>
                         <h3 className={`font-semibold text-lg ${step.isCompleted ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-900'}`}>
                           {step.title}
                         </h3>
                       </div>
                       
                       <div className={`prose prose-slate prose-sm max-w-none mt-2 ${step.isCompleted ? 'opacity-60' : ''}`}>
                         <p className="text-slate-600 whitespace-pre-line">{step.description}</p>
                       </div>

                       {!step.isCompleted && (
                         <div className="mt-4 space-y-4">
                           {/* Commands Block */}
                           {step.commands && step.commands.length > 0 && (
                             <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-50 relative group">
                               <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button 
                                   onClick={() => copyToClipboard(step.commands!.join('\n'))}
                                   className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                                   title="Copiar comandos"
                                 >
                                   <Copy size={14} />
                                 </button>
                               </div>
                               <div className="flex gap-2 text-slate-500 mb-2 text-xs uppercase tracking-wider select-none">
                                 <Terminal size={12} /> Terminal ({project.os})
                               </div>
                               <div className="space-y-1">
                                 {step.commands.map((cmd, i) => (
                                   <div key={i} className="flex gap-2">
                                     <span className="text-slate-500 select-none">$</span>
                                     <span className="text-green-400">{cmd}</span>
                                   </div>
                                 ))}
                               </div>
                             </div>
                           )}

                           {/* Config Files Block */}
                           {step.configFiles && step.configFiles.length > 0 && step.configFiles.map((file, i) => (
                             <div key={i} className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                               <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
                                 <div className="flex items-center gap-2">
                                   <FileCode size={16} className="text-primary-600" />
                                   <span className="font-mono text-sm font-medium text-slate-700">{file.fileName}</span>
                                 </div>
                                 <button 
                                   onClick={() => copyToClipboard(file.content)}
                                   className="text-xs flex items-center gap-1 text-slate-500 hover:text-primary-600"
                                 >
                                   <Copy size={12} /> Copiar
                                 </button>
                               </div>
                               <pre className="p-4 text-xs font-mono text-slate-700 bg-white overflow-x-auto">
                                 {file.content}
                               </pre>
                             </div>
                           ))}
                           
                           {/* Notes/Warnings */}
                           {step.notes && (
                             <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-3 text-sm text-amber-800">
                               <Info size={16} className="flex-shrink-0 mt-0.5" />
                               <p>{step.notes}</p>
                             </div>
                           )}
                         </div>
                       )}
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Sidebar Information */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Info do Projeto</h3>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-slate-500 mb-1">Stack</dt>
                <dd className="flex flex-wrap gap-2">
                  {project.techStack.map(t => (
                    <span key={t} className="bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200 text-xs font-medium">
                      {t}
                    </span>
                  ))}
                </dd>
              </div>
              {project.backend && (
                <div>
                  <dt className="text-slate-500 mb-1">Backend</dt>
                  <dd className="text-slate-800 font-medium">{project.backend}</dd>
                </div>
              )}
              {project.database && (
                <div>
                  <dt className="text-slate-500 mb-1">Banco de Dados</dt>
                  <dd className="text-slate-800 font-medium">{project.database}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Prerequisites */}
          {project.plan.prerequisites && project.plan.prerequisites.length > 0 && (
            <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-6">
              <h3 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                Pré-requisitos
              </h3>
              <ul className="space-y-2 text-sm text-indigo-800">
                {project.plan.prerequisites.map((prereq, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0"></span>
                    {prereq}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings */}
          {project.plan.warnings && project.plan.warnings.length > 0 && (
            <div className="bg-orange-50 rounded-xl border border-orange-100 p-6">
              <h3 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                <AlertTriangle size={16} /> Avisos Importantes
              </h3>
              <ul className="space-y-2 text-sm text-orange-800">
                {project.plan.warnings.map((warn, i) => (
                  <li key={i}>{warn}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;