import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate,
  useLocation 
} from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import SEOTools from './pages/SEOTools'; 
import About from './pages/AboutUs'; 
import ContactUs from './pages/ContactUs';
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import FAQ from './pages/FAQ';
import MyProfile from './pages/MyProfile';
import Calendar from './pages/Calendar';
import Design from './pages/Design';
import DesignSavedResults from './pages/DesignSavedResults';
import MetaTitle from './pages/MetaTitle';
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
import './index.css';

// ScrollToTop component implementation
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

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
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="font-sans bg-white">
          <Routes>
            {/* Redirect root path to login */}
            <Route path="/" element={<Navigate to="/Login" replace />} />
            
            {/* Public routes */}
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/Register" element={<RegisterPage />} />
            <Route path="/AboutUs" element={<About />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/faq" element={<FAQ />} />
            
            {/* Protected routes */}
            <Route path="/Home" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/seo-tools" element={
              <ProtectedRoute>
                <SEOTools />
              </ProtectedRoute>
            } />
            <Route path="/MetaTitle" element={
              <ProtectedRoute>
                <MetaTitle />
              </ProtectedRoute>
            } />
            <Route path="/MetaDescription" element={
              <ProtectedRoute>
                <MetaDescription />
              </ProtectedRoute>
            } />
            <Route path="/SubKeywordGenerator" element={
              <ProtectedRoute>
                <SubKeywordGenerator />
              </ProtectedRoute>
            } />
            <Route path="/TopicalMapGenerator" element={
              <ProtectedRoute>
                <TopicalMapGenerator />
              </ProtectedRoute>
            } />
            <Route path="/BlogPostIdeas" element={
              <ProtectedRoute>
                <BlogPostIdeas />
              </ProtectedRoute>
            } />
            <Route path="/JSONGenerator" element={
              <ProtectedRoute>
                <JSONLDFAQGenerator />
              </ProtectedRoute>
            } />
            <Route path="/YoutubeTag" element={
              <ProtectedRoute>
                <YoutubeTagGenerator />
              </ProtectedRoute>
            } />
            <Route path="/YoutubeContent" element={
              <ProtectedRoute>
                <YoutubeContentIdeas />
              </ProtectedRoute>
            } />
            <Route path="/YoutubeHashtag" element={
              <ProtectedRoute>
                <YoutubeHashtagGenerator />
              </ProtectedRoute>
            } />
            <Route path="/InstaCaption" element={
              <ProtectedRoute>
                <InstagramCaptionGenerator />
              </ProtectedRoute>
            } />
            <Route path="/InstaContent" element={
              <ProtectedRoute>
                <InstagramContentIdeas />
              </ProtectedRoute>
            } />
            <Route path="/InstaHashtag" element={
              <ProtectedRoute>
                <InstagramHastagGenerator />
              </ProtectedRoute>
            } />
            <Route path="/FBCaption" element={
              <ProtectedRoute>
                <FacebookCaptionGenerators />
              </ProtectedRoute>
            } />
            <Route path="/FBContent" element={
              <ProtectedRoute>
                <FacebookContentIdeas />
              </ProtectedRoute>
            } />
            <Route path="/FBHashtag" element={
              <ProtectedRoute>
                <FacebookHashtagGenerators />
              </ProtectedRoute>
            } />
            <Route path="/my-profile" element={
              <ProtectedRoute>
                <MyProfile />
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            } />
            <Route path="/design" element={
              <ProtectedRoute>
                <Design />
              </ProtectedRoute>
            } />
            <Route path="/design-saved-results" element={
              <ProtectedRoute>
                <DesignSavedResults />
              </ProtectedRoute>
            } />
            <Route path="/projects" element={
              <ProtectedRoute>
                <ProjectsPage />
              </ProtectedRoute>
            } />
            <Route path="/Folder" element={
              <ProtectedRoute>
                <FolderPage />
              </ProtectedRoute>
            } />
            <Route path="/FolderPageDesign" element={
              <ProtectedRoute>
                <FolderPageWithDesign />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;