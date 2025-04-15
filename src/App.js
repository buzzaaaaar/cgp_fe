import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MetaTitleTool from './pages/MetaTitleTool';
import ProjectsPage from './pages/ProjectsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MetaTitleTool />} />
        <Route path="/projects" element={<ProjectsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
