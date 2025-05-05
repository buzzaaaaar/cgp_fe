import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { content } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Advertisement from '../components/Advertisement';
import SaveModal from '../components/SaveModal';
import { Button, TextField, Typography, Box, CircularProgress, Alert } from '@mui/material';

// Correcting the image imports
import MetaDescriptionIcon from '../assets/metadescription.png';
import SubKeywordIcon from '../assets/subkeyword.png';
import SaveSuccessfulIcon from '../assets/savesuccessful.png';

export default function MetaTitle() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [title, setTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleGenerate = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setIsGenerating(true);
    setError('');
    setSuccess('');

    try {
      const response = await content.generate('meta_title', searchQuery);
      setTitle(response.content);
    } catch (error) {
      setError(error.message || 'Failed to generate meta title');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveClick = () => {
    if (!title.trim()) {
      setError('No title to save');
      return;
    }
    setIsSaveModalOpen(true);
  };

  const handleSaveModalClose = () => {
    setIsSaveModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white font-hanken px-4 sm:px-8 py-6">
      <Navbar />
      <div className="h-16"></div>

      <div className="mb-6">
        <h1 className="text-5xl font-extrabold text-[#7FAF37] mb-4">SEO Meta Title</h1>
        <hr className="border-t border-gray-300" />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-2/3 w-full">
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <div className="mb-4">
            <TextField
              fullWidth
              label="Search Query"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              margin="normal"
              disabled={isGenerating}
            />
          </div>

          <div className="mb-6">
            <TextField
              fullWidth
              label="Generated Meta Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              multiline
              rows={2}
            />
          </div>

          <div className="flex justify-end max-w-4xl mb-4 gap-4">
            <Button
              variant="contained"
              onClick={handleGenerate}
              disabled={isGenerating || !searchQuery.trim()}
              sx={{ 
                mt: 2, 
                mr: 2,
                bgcolor: '#7FAF37',
                '&:hover': {
                  bgcolor: '#6a9a2e'
                }
              }}
            >
              {isGenerating ? <CircularProgress size={24} /> : 'Generate'}
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveClick}
              sx={{ 
                mt: 2,
                bgcolor: '#7FAF37',
                '&:hover': {
                  bgcolor: '#6a9a2e'
                }
              }}
            >
              Save
            </Button>
          </div>

          <div className="text-sm text-[#1C3D86] max-w-4xl">
            If you see a warning, the content may be inappropriate or unsuitable for SEO. Please try again.
          </div>
        </div>

        <div className="lg:w-1/3 w-full flex flex-col items-center">
          <h2 className="text-xl font-semibold text-[#7FAF37] text-center mb-6">Related Tools</h2>

          {/* SEO Meta Description Tool */}
          <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-white min-h-[150px] shadow-lg w-full max-w-sm">
            <div className="flex items-center mb-2">
              <img src={MetaDescriptionIcon} alt="Meta Description Icon" className="w-6 h-6 mr-2" />
              <h3 className="text-base font-semibold text-[#013024]">SEO Meta Description</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Create compelling meta descriptions that boost your website's ranking and attract more visitors.
            </p>
            <Link 
              to="/MetaDescription" 
              className="text-sm text-[#013024] text-right block hover:underline hover:text-[#7FAF37]"
            >
              Learn more
            </Link>
          </div>

          {/* Sub Keyword Generator Tool */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white min-h-[150px] shadow-lg w-full max-w-sm mb-10">
            <div className="flex items-center mb-2">
              <img src={SubKeywordIcon} alt="Sub Keyword Generator Icon" className="w-6 h-6 mr-2" />
              <h3 className="text-base font-semibold text-[#013024]">Sub Keyword Generator</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Discover relevant sub-keywords to enhance your SEO strategy and drive more targeted traffic.
            </p>
            <Link 
              to="/SubKeywordGenerator" 
              className="text-sm text-[#013024] text-right block hover:underline hover:text-[#7FAF37]"
            >
              Learn more
            </Link>
          </div>

          <Advertisement searchQuery={searchQuery} />
        </div>
      </div>

      <SaveModal
        isOpen={isSaveModalOpen}
        onClose={handleSaveModalClose}
        content={title}
        contentType="meta_title"
      />

      <Footer />
    </div>
  );
}