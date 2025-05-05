import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { content } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Advertisement from '../components/Advertisement';
import { Button, TextField, Typography, Box, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

// Correcting the image imports
import FBCaption from '../assets/FBCaption.png';
import FBContent from '../assets/FBContent.png';
import FBHashtag from '../assets/FBHashtag.png';
import SaveSuccessfulIcon from '../assets/savesuccessful.png';

export default function FacebookHashtagGenerator() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSavePopupOpen, setIsSavePopupOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
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
      const response = await content.generate('facebook_hashtags', searchQuery);
      setHashtags(response.content);
    } catch (error) {
      setError(error.message || 'Failed to generate hashtags');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveClick = () => {
    if (!hashtags.trim()) {
      setError('No hashtags to save');
      return;
    }
    setSaveName(`Facebook Hashtags - ${new Date().toLocaleDateString()}`);
    setIsSavePopupOpen(true);
  };

  const handleSave = async () => {
    if (!saveName.trim()) {
      setError('Please enter a name for the content');
      return;
    }

    try {
      await content.save(saveName, 'facebook_hashtags', { hashtags, searchQuery });
      setSuccess('Hashtags saved successfully');
      setIsSavePopupOpen(false);
    } catch (error) {
      setError(error.message || 'Failed to save hashtags');
    }
  };

  const handleClosePopup = () => {
    setIsSavePopupOpen(false);
    setSaveName('');
  };

  return (
    <div className="min-h-screen bg-white font-hanken px-4 sm:px-8 py-6">
      <Navbar />
      <div className="h-16"></div>

      <div className="mb-6">
        <h1 className="text-5xl font-extrabold text-[#7FAF37] mb-4">Facebook Hashtag Generator</h1>
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
              label="Generated Hashtags"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              margin="normal"
              multiline
              rows={8}
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
              disabled={!hashtags.trim()}
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

          {/* Facebook Caption Generator */}
          <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-white min-h-[150px] shadow-lg w-full max-w-sm">
            <div className="flex items-center mb-2">
              <img src={FBCaption} alt="Facebook Caption Generator" className="w-6 h-6 mr-2" />
              <h3 className="text-base font-semibold text-[#013024]">Facebook Caption Generator</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Create engaging captions that resonate with your audience and boost your Facebook engagement
            </p>
            <Link 
              to="/FacebookCaptionGenerator" 
              className="text-sm text-[#013024] text-right block hover:underline hover:text-[#7FAF37]"
            >
              Learn more
            </Link>
          </div>

          <Advertisement searchQuery={searchQuery} />
        </div>
      </div>

      <Dialog open={isSavePopupOpen} onClose={handleClosePopup}>
        <DialogTitle>Save Hashtags</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Content Name"
            type="text"
            fullWidth
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#7FAF37' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
}
