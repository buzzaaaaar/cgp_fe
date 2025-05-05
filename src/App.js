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
import InstagramContentIdeas from './pages/InstagramContentIdeas';
import InstagramHastagGenerator from './pages/InstagramHashtagGenerator';
import FacebookCaptionGenerators from './pages/FacebookCaptionGenerator';
import FacebookContentIdeas from './pages/FacebookContentIdeas';
import FacebookHashtagGenerators from './pages/FacebookHashtagGenerator';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import About from './pages/AboutUs'; 
import ContactUs from './pages/ContactUs';
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import FAQ from './pages/FAQ';
import MyProfile from './pages/MyProfile';
import Calendar from './pages/Calendar';
import Design from './pages/Design';
import DesignSavedResults from './pages/DesignSavedResults';

import './index.css';

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="font-sans bg-white">
        <Routes>
          {/* Development routes */}
          <Route path="/" element={<Home />} />
          <Route path="/AboutUs" element={<About />} />
          <Route path="/contact" element={<ContactUs />} /> 
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/my-profile" element={<MyProfile />} /> 
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/design" element={<Design />} />
          <Route path="/design-saved-results" element={<DesignSavedResults />} />

          {/* Minidu routes */}
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
          <Route path="/InstaContent" element={<InstagramContentIdeas />} />
          <Route path="/InstaHashtag" element={<InstagramHastagGenerator />} />
          <Route path="/FBCaption" element={<FacebookCaptionGenerators />} />
          <Route path="/FBContent" element={<FacebookContentIdeas />} />
          <Route path="/FBHashtag" element={<FacebookHashtagGenerators />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
