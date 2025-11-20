import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 w-full">
        {children}
      </main>
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} Assistente de Deploy. Construído com React & Gemini API.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;