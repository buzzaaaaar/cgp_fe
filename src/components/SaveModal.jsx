import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const SaveModal = ({ isOpen, onClose, content, contentType }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedProject) {
      fetchFolders(selectedProject._id);
    } else {
      setFolders([]);
      setSelectedFolder(null);
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/projects/my-projects', {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      const data = await response.json();
      if (response.ok) {
        setProjects(data);
      } else {
        console.error('Failed to fetch projects:', data);
        toast.error(data.message || 'Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Error fetching projects');
    }
  };

  const fetchFolders = async (projectId) => {
    if (!projectId) return;
    
    setIsLoadingFolders(true);
    try {
      const response = await fetch(`http://localhost:5000/api/folders/my-folders?projectId=${projectId}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Fetched folders:', data); // Debug log
        setFolders(data);
      } else {
        console.error('Failed to fetch folders:', data);
        toast.error(data.message || 'Failed to fetch folders');
        setFolders([]);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
      toast.error('Error fetching folders');
      setFolders([]);
    } finally {
      setIsLoadingFolders(false);
    }
  };

  const handleSave = async () => {
    if (!selectedProject || !selectedFolder) {
      toast.error('Please select both a project and a folder');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({
          name: `${contentType} - ${new Date().toLocaleDateString()}`,
          type: contentType,
          data: { content },
          projectId: selectedProject._id,
          folderId: selectedFolder._id
        })
      });

      if (response.ok) {
        toast.success('Content saved successfully');
        onClose();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to save content');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Error saving content');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Save Content</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Project Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Project
            </label>
            <select
              value={selectedProject?._id || ''}
              onChange={(e) => {
                const project = projects.find(p => p._id === e.target.value);
                setSelectedProject(project);
                setSelectedFolder(null);
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Folder Selection */}
          {selectedProject && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Folder
              </label>
              <select
                value={selectedFolder?._id || ''}
                onChange={(e) => {
                  const folder = folders.find(f => f._id === e.target.value);
                  setSelectedFolder(folder);
                }}
                disabled={isLoadingFolders}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                <option value="">{isLoadingFolders ? 'Loading folders...' : 'Select a folder'}</option>
                {folders.map((folder) => (
                  <option key={folder._id} value={folder._id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !selectedProject || !selectedFolder}
              className="px-4 py-2 text-white bg-[#7FAF37] rounded-md hover:bg-[#6c9b2f] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveModal; 