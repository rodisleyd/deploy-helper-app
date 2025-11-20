import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '../components/Button';
import { NewProjectFormData, Project, ProjectStatus, ProjectType } from '../types';
import { saveProject } from '../services/storageService';
import { generateDeployPlan } from '../services/geminiService';
import { ChevronLeft, Sparkles } from 'lucide-react';

const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<NewProjectFormData>({
    name: '',
    description: '',
    type: ProjectType.WEB_APP,
    techStack: '',
    backend: '',
    database: '',
    hostingTarget: '',
    os: 'Windows' // Default
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsGenerating(true);

    try {
      // Create project object
      const newProject: Project = {
        id: uuidv4(),
        name: formData.name,
        description: formData.description,
        type: formData.type,
        techStack: formData.techStack.split(',').map(t => t.trim()).filter(Boolean),
        backend: formData.backend,
        database: formData.database,
        hostingTarget: formData.hostingTarget,
        os: formData.os,
        createdAt: Date.now(),
        status: ProjectStatus.PLANNING,
      };

      // Call AI
      const plan = await generateDeployPlan(newProject);
      
      // Update project with plan
      newProject.plan = plan;
      newProject.status = ProjectStatus.IN_PROGRESS;

      // Save and redirect
      saveProject(newProject);
      navigate(`/project/${newProject.id}`);

    } catch (err: any) {
      setError(err.message || "Falha ao gerar plano de deploy. Por favor, verifique sua chave de API.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-sm text-slate-500 hover:text-slate-800 mb-6"
      >
        <ChevronLeft size={16} className="mr-1" /> Voltar ao Dashboard
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-200 bg-slate-50">
          <h1 className="text-2xl font-bold text-slate-900">Novo Projeto de Deploy</h1>
          <p className="text-slate-500 mt-2">Conte-nos sobre sua stack e geraremos a estratégia de deploy perfeita.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Projeto</label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="ex: Meu SaaS Incrível"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Descreva brevemente o que seu app faz..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Projeto</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                {Object.values(ProjectType).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sistema Operacional (Dev)</label>
              <select
                name="os"
                value={formData.os}
                onChange={handleChange as any}
                className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="Windows">Windows</option>
                <option value="macOS">macOS</option>
                <option value="Linux">Linux</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tecnologias Principais 
                <span className="ml-1 text-slate-400 font-normal">(Separado por vírgula)</span>
              </label>
              <input
                required
                type="text"
                name="techStack"
                value={formData.techStack}
                onChange={handleChange}
                className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="React, Tailwind, Vite, Typescript..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Backend / API (Opcional)</label>
              <input
                type="text"
                name="backend"
                value={formData.backend}
                onChange={handleChange}
                className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Node.js, Python, Go..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Banco de Dados (Opcional)</label>
              <input
                type="text"
                name="database"
                value={formData.database}
                onChange={handleChange}
                className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Postgres, Firebase, MongoDB..."
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Hospedagem / Deploy Desejado</label>
              <input
                required
                type="text"
                name="hostingTarget"
                value={formData.hostingTarget}
                onChange={handleChange}
                className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Vercel, Netlify, AWS EC2, DigitalOcean App Platform..."
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm border border-red-100">
              {error}
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => navigate('/')}>Cancelar</Button>
            <Button type="submit" size="lg" isLoading={isGenerating}>
              {isGenerating ? 'Analisando Stack...' : (
                <>
                  <Sparkles size={18} className="mr-2" />
                  Gerar Plano de Deploy
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProject;