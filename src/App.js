import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import About from './pages/AboutUs'; 
import ContactUs from './pages/ContactUs';
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
          <Route path="/" element={<Home />} />
          <Route path="/AboutUs" element={<About />} />
          <Route path="/contact" element={<ContactUs />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
