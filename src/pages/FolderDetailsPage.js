import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { folders } from '../services/api';
import { toast } from 'react-toastify';
import FolderItems from '../components/FolderItems';

const FolderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [folder, setFolder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFolder();
  }, [id]);

  const loadFolder = async () => {
    try {
      const data = await folders.getById(id);
      setFolder(data);
    } catch (error) {
      toast.error(error.message);
      navigate('/folders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!folder) {
    return <div className="text-center">Folder not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">{folder.name}</h1>
          <p className="text-gray-600 mb-4">{folder.description}</p>
          <div className="flex items-center text-sm text-gray-500">
            <span>Created: {new Date(folder.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <FolderItems 
          folderId={id} 
          projectId={folder.projectId}
          canEdit={true}
        />
      </div>
    </div>
  );
};

export default FolderDetailsPage; 