import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MetaTitleTool from './pages/MetaTitleTool';
import ProjectsPage from './pages/ProjectsPage';
import FolderPage from './pages/FolderPage';
import FolderPageWithDesign from './pages/FolderPageWithDesign';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MetaDescription from './pages/MetaDescription';
import SubKeywordGenerator from './pages/SubKeywordGenerator';
import TopicalMapGenerator from './pages/TopicalMapGenerator';
import BlogPostIdeas from './pages/BlogPostIdeas';
import JSONLDFAQGenerator from './pages/JSON-LDFAQGenerator';
import YoutubeTagGenerator from './pages/YoutubeTagGenerator';
import YoutubeContentIdeas from './pages/YoutubeContentIdeas';
import YoutubeHashtagGenerator from './pages/YoutubeHashtagGenerator';
import InstagramCaptionGenerator from './pages/InstagramCaptionGenerator';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MetaTitleTool />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/Folder" element={<FolderPage />} />
        <Route path="/FolderPageDesign" element={<FolderPageWithDesign />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Register" element={<RegisterPage />} />
        <Route path="/MetaDescription" element={<MetaDescription />} />
        <Route path="/SubKeywordGenerator" element={<SubKeywordGenerator />} />
        <Route path="/TopicalMapGenerator" element={<TopicalMapGenerator />} />
        <Route path="/BlogPostIdeas" element={<BlogPostIdeas />} />
        <Route path="/JSONGenerator" element={<JSONLDFAQGenerator />} />
        <Route path="/YoutubeTag" element={<YoutubeTagGenerator />} />
        <Route path="/YoutubeContent" element={<YoutubeContentIdeas />} />
        <Route path="/YoutubeHashtag" element={<YoutubeHashtagGenerator />} />
        <Route path="/InstaCaption" element={<InstagramCaptionGenerator />} />
        
      </Routes>
    </Router>
  );
}

export default App;
