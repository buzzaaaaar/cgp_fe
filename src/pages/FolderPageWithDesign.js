import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { folders, content } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function FolderPageWithDesign() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [folder, setFolder] = useState(null);
  const [contents, setContents] = useState([]);
  const [editingFolder, setEditingFolder] = useState(false);
  const [editingContentId, setEditingContentId] = useState(null);
  const [contentMenuOpenId, setContentMenuOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const contentInputRef = useRef(null);
  const folderInputRef = useRef(null);

  useEffect(() => {
    fetchFolder();
    fetchContents();
  }, [id]);

  const fetchFolder = async () => {
    try {
      const data = await folders.getById(id);
      setFolder(data.folder);
    } catch (error) {
      setError('Failed to fetch folder');
    }
  };

  const fetchContents = async () => {
    try {
      const data = await content.getAll(id);
      setContents(data.contents);
    } catch (error) {
      setError('Failed to fetch contents');
    } finally {
      setLoading(false);
    }
  };

  const handleContentNameChange = async (id, newName) => {
    try {
      await content.update(id, { name: newName });
      setContents(contents.map(content =>
        content._id === id ? { ...content, name: newName } : content
      ));
    } catch (error) {
      setError('Failed to update content name');
    }
  };

  const handleContentBlur = () => {
    setEditingContentId(null);
  };

  const handleContentKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      setEditingContentId(null);
    }
  };

  const handleRenameContent = (id) => {
    setEditingContentId(id);
    setContentMenuOpenId(null);
  };

  const handleDeleteContent = async (id) => {
    try {
      await content.delete(id);
      setContents(contents.filter(content => content._id !== id));
    } catch (error) {
      setError('Failed to delete content');
    }
  };

  const handleFolderNameChange = async (newName) => {
    try {
      await folders.update(id, { name: newName });
      setFolder({ ...folder, name: newName });
      setEditingFolder(false);
    } catch (error) {
      setError('Failed to update folder name');
    }
  };

  const handleDeleteFolder = async () => {
    try {
      await folders.delete(id);
      navigate('/projects');
    } catch (error) {
      setError('Failed to delete folder');
    }
  };

  useEffect(() => {
    if (editingContentId && contentInputRef.current) {
      contentInputRef.current.focus();
      contentInputRef.current.select();
    }
  }, [editingContentId]);

  useEffect(() => {
    if (editingFolder && folderInputRef.current) {
      folderInputRef.current.focus();
      folderInputRef.current.select();
    }
  }, [editingFolder]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7FAF37] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="h-16" />

      {folder && (
        <>
          {/* Header */}
          <div className="w-full flex items-center justify-between px-8 mb-2">
            <div className="flex items-center gap-2">
              {editingFolder ? (
                <input
                  ref={folderInputRef}
                  type="text"
                  value={folder.name}
                  onChange={(e) => setFolder({ ...folder, name: e.target.value })}
                  onBlur={() => handleFolderNameChange(folder.name)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFolderNameChange(folder.name)}
                  className="text-4xl font-bold text-[#7FAF37] focus:outline-none px-2 py-1 bg-transparent"
                />
              ) : (
                <h1 className="text-4xl font-bold text-[#7FAF37]">{folder.name}</h1>
              )}
            </div>

            {/* Folder menu */}
            <div className="relative">
              <button
                className="text-gray-600 text-2xl hover:text-[#7FAF37]"
                onClick={() =>
                  setContentMenuOpenId(contentMenuOpenId === 'top' ? null : 'top')
                }
              >
                ⋮
              </button>
              {contentMenuOpenId === 'top' && (
                <div className="absolute right-0 top-10 bg-white border rounded shadow-md z-50 w-32">
                  <button
                    className="block px-4 py-2 text-sm text-black w-full text-left hover:bg-[#D4D4D4]"
                    onClick={() => setEditingFolder(true)}
                  >
                    Rename
                  </button>
                  <button
                    className="block px-4 py-2 text-sm text-black w-full text-left hover:bg-[#D4D4D4]"
                    onClick={handleDeleteFolder}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-[2px] bg-[#D4D4D4] mb-4" />

          <div className="flex flex-col px-8 py-8 flex-grow">
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            <h2 className="text-xl font-bold text-[#7FAF37] mb-6">Contents</h2>

            <div className="flex flex-wrap gap-6">
              {contents.map((content) => (
                <div
                  key={content._id}
                  className="w-56 bg-white shadow-md rounded-lg relative border border-[#D4D4D4] pt-1"
                >
                  <div
                    className="w-56 h-36 bg-gray-100 border-[3px] border-white rounded-lg mb-2 flex items-center justify-center overflow-hidden cursor-pointer"
                  >
                    {content.media && (
                      <img
                        src={content.media}
                        alt="Content"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-between px-2 pb-2">
                    {editingContentId === content._id ? (
                      <input
                        ref={contentInputRef}
                        type="text"
                        value={content.name}
                        onChange={(e) => handleContentNameChange(content._id, e.target.value)}
                        onBlur={handleContentBlur}
                        onKeyDown={(e) => handleContentKeyDown(e, content._id)}
                        className="w-full px-2 py-1 bg-transparent focus:outline-none"
                      />
                    ) : (
                      <>
                        <div
                          className="text-[#013024] font-bold hover:underline hover:text-[#7FAF37] cursor-pointer truncate transition-all mr-4"
                          onClick={() => setEditingContentId(content._id)}
                        >
                          {content.name}
                        </div>
                        <div className="relative">
                          <button
                            onClick={() =>
                              setContentMenuOpenId(
                                contentMenuOpenId === content._id ? null : content._id
                              )
                            }
                            className="text-gray-500 font-bold"
                          >
                            ⋮
                          </button>
                          {contentMenuOpenId === content._id && (
                            <div className="absolute right-0 top-6 bg-white border rounded shadow-md z-10">
                              <button
                                className="block px-4 py-2 text-sm text-black w-full text-left hover:bg-[#D4D4D4]"
                                onClick={() => handleRenameContent(content._id)}
                              >
                                Rename
                              </button>
                              <button
                                className="block px-4 py-2 text-sm text-black w-full text-left hover:bg-[#D4D4D4]"
                                onClick={() => handleDeleteContent(content._id)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}
