export enum ProjectType {
  WEB_APP = 'Aplicação Web',
  MOBILE_APP = 'App Mobile',
  DESKTOP_APP = 'App Desktop',
  LANDING_PAGE = 'Landing Page',
  API_SERVICE = 'API / Backend',
  GAME = 'Jogo',
  OTHER = 'Outro'
}

export enum ProjectStatus {
  DRAFT = 'Rascunho',
  PLANNING = 'Planejando',
  IN_PROGRESS = 'Em Andamento',
  COMPLETED = 'Implantado'
}

export interface ConfigFile {
  fileName: string;
  content: string;
  language: string;
}

export interface DeployStep {
  id: string;
  title: string;
  description: string;
  commands?: string[];
  configFiles?: ConfigFile[];
  isCompleted: boolean;
  notes?: string;
}

export interface DeployPlan {
  steps: DeployStep[];
  prerequisites: string[];
  warnings: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  type: ProjectType;
  techStack: string[];
  backend?: string;
  database?: string;
  hostingTarget: string;
  os: 'Windows' | 'macOS' | 'Linux';
  createdAt: number;
  status: ProjectStatus;
  plan?: DeployPlan;
}

export interface NewProjectFormData {
  name: string;
  description: string;
  type: ProjectType;
  techStack: string; // Comma separated for input
  backend: string;
  database: string;
  hostingTarget: string;
  os: 'Windows' | 'macOS' | 'Linux';
}