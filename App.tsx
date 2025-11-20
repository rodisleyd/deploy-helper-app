import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NewProject from './pages/NewProject';
import ProjectDetails from './pages/ProjectDetails';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new" element={<NewProject />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;