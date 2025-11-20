import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Github } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="bg-primary-600 text-white p-1.5 rounded-lg">
            <Rocket size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">AssistenteDeploy</span>
        </Link>
        
        <nav className="flex gap-6 items-center">
          <Link to="/" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
            Dashboard
          </Link>
          <Link to="/new" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
            Novo Projeto
          </Link>
          <a href="#" className="text-slate-400 hover:text-slate-800 transition-colors">
            <Github size={20} />
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;