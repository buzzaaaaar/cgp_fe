import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projects, content } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function FolderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [contents, setContents] = useState([]);
  const [editingContentId, setEditingContentId] = useState(null);
  const [contentMenuOpenId, setContentMenuOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const contentInputRef = useRef(null);

  useEffect(() => {
    fetchProject();
    fetchContents();
  }, [id]);

  const fetchProject = async () => {
    try {
      const data = await projects.getById(id);
      setProject(data.project);
    } catch (error) {
      setError('Failed to fetch project');
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

  const handleCreateContent = async () => {
    try {
      const newContent = await content.create({
        name: "Untitled content",
        project: id,
        owner: user._id
      });
      setContents([...contents, newContent]);
      setEditingContentId(newContent._id);
    } catch (error) {
      setError('Failed to create content');
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

  const handleOpenContent = (id) => {
    navigate(`/FolderPageDesign/${id}`);
  };

  useEffect(() => {
    if (editingContentId && contentInputRef.current) {
      contentInputRef.current.focus();
      contentInputRef.current.select();
    }
  }, [editingContentId]);

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
      <div className="w-full h-16 bg-white border-b border-gray-200" />

      <div className="flex flex-col px-8 py-8 flex-grow">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-[#7FAF37]">{project?.name || 'Untitled folder'}</h1>
          <hr className="border-t border-[#D4D4D4] mt-4" />
        </div>

        {/* Contents */}
        <div className="w-full pl-4">
          <h2 className="text-xl font-bold text-[#7FAF37] mb-4">Contents</h2>
          <div className="flex items-start">
            <button
              className="bg-[#7FAF37] text-white font-medium py-3 px-6 rounded-md w-72 flex items-center justify-center border-2 border-[#7FAF37] hover:bg-white hover:text-[#7FAF37] transition-all"
              onClick={handleCreateContent}
            >
              <span className="mr-2">+</span> CREATE NEW
            </button>

            <div className="flex flex-wrap gap-6 ml-8">
              {contents.map((content) => (
                <div key={content._id} className="w-56 shadow-md rounded-lg relative">
                  <div
                    className="w-56 h-36 bg-gray-100 border-[3px] border-white rounded-lg mb-2 flex items-center justify-center overflow-hidden cursor-pointer"
                    onClick={() => handleOpenContent(content._id)}
                  >
                    {content.media && (
                      <img src={content.media} alt="Content" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex items-center justify-center px-2">
                    {editingContentId === content._id ? (
                      <input
                        ref={contentInputRef}
                        type="text"
                        value={content.name}
                        onChange={(e) => handleContentNameChange(content._id, e.target.value)}
                        onBlur={handleContentBlur}
                        onKeyDown={(e) => handleContentKeyDown(e, content._id)}
                        className="w-full px-2 py-1 border border-[#7FAF37] rounded focus:outline-none"
                      />
                    ) : (
                      <>
                        <div
                          className="text-[#013024] font-bold hover:underline hover:text-[#7FAF37] cursor-pointer truncate transition-all"
                          onClick={() => handleOpenContent(content._id)}
                        >
                          {content.name}
                        </div>
                        <div className="relative ml-3">
                          <button
                            onClick={() =>
                              setContentMenuOpenId(contentMenuOpenId === content._id ? null : content._id)
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
        </div>
      </div>

      <div className="w-full h-16 bg-white border-t border-gray-200" />
      <Footer />
    </div>
  );
}
