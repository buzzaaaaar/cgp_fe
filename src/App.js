import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MetaTitleTool from './pages/MetaTitleTool';
import ProjectsPage from './pages/ProjectsPage';
import FolderPage from './pages/FolderPage';
import FolderPageWithDesign from './pages/FolderPageWithDesign';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MetaTitleTool />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/Folder" element={<FolderPage />} />
        <Route path="/FolderPageDesign" element={<FolderPageWithDesign />} />
        
      </Routes>
    </Router>
  );
}

export default App;
