import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projects, folders } from '../services/api';
import projectPageBanner from '../assets/projectpage.jpeg';
import folderIcon from '../assets/folder.png';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
import FolderItems from '../components/FolderItems';
import { FaChevronDown, FaChevronRight, FaPlus, FaShare, FaUserMinus, FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projectsList, setProjectsList] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [foldersList, setFoldersList] = useState([]);
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [folderMenuOpenId, setFolderMenuOpenId] = useState(null);
  const [projectMenuOpenId, setProjectMenuOpenId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(''); // 'project' or 'folder'
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [projectTypes, setProjectTypes] = useState([
    'personal',
    'work',
    'team',
    'business',
    'education',
    'research',
    'development',
    'marketing',
    'design',
    'other'
  ]);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedProjectType, setSelectedProjectType] = useState('');
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedProjectForSharing, setSelectedProjectForSharing] = useState(null);
  const [usernameToShare, setUsernameToShare] = useState('');
  const [sharedUsers, setSharedUsers] = useState([]);
  const [shareError, setShareError] = useState('');
  const [sharePermission, setSharePermission] = useState('view');
  const [showProjectMenu, setShowProjectMenu] = useState(false);

  const folderInputRef = useRef(null);
  const projectInputRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProjects();
  }, [user, navigate]);

  useEffect(() => {
    if (selectedProject) {
      fetchFolders(selectedProject._id);
    } else {
      setFoldersList([]);
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Starting to fetch projects...'); // Debug log
      const response = await projects.getAll();
      console.log('Projects response in component:', response); // Debug log
      
      if (Array.isArray(response)) {
        console.log('Setting projects list:', response); // Debug log
        setProjectsList(response);
      } else {
        console.warn('Unexpected projects response format:', response);
        setProjectsList([]);
      }
    } catch (error) {
      console.error('Error in fetchProjects:', error);
      setError(error.message || 'Failed to fetch projects. Please try again.');
      setProjectsList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async (projectId) => {
    try {
      setLoading(true);
      setError('');
      const response = await folders.getAll(projectId);
      console.log('Folders response:', response); // Debug log
      if (Array.isArray(response)) {
        setFoldersList(response);
      } else {
        setFoldersList([]);
        console.warn('Unexpected folders response format:', response);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
      setError(error.message || 'Failed to fetch folders. Please try again.');
      setFoldersList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    try {
      setError('');
      const newProject = await projects.create({
        name: "Untitled project",
        owner: user._id,
        type: "design"
      });
      setProjectsList(prev => [...prev, newProject]);
      setEditingProjectId(newProject._id);
    } catch (error) {
      console.error('Error creating project:', error);
      setError(error.message || 'Failed to create project. Please try again.');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleCreateFolder = async () => {
    if (!selectedProject) return;
    
    try {
      setError('');
      const newFolder = await folders.create({
        name: "Untitled folder",
        projectId: selectedProject._id,
        owner: user._id
      });
      setFoldersList(prev => [...prev, newFolder]);
      setEditingFolderId(newFolder._id);
    } catch (error) {
      console.error('Error creating folder:', error);
      setError(error.message || 'Failed to create folder');
    }
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setProjectMenuOpenId(null);
  };

  const handleProjectNameChange = async (id, newName) => {
    try {
      await projects.update(id, { name: newName });
      setProjectsList(prev => prev.map(project =>
        project._id === id ? { ...project, name: newName } : project
      ));
    } catch (error) {
      console.error('Error updating project:', error);
      setError(error.message || 'Failed to update project name');
    }
  };

  const handleFolderNameChange = async (id, newName) => {
    try {
      await folders.update(id, { name: newName });
      setFoldersList(prev => prev.map(folder =>
        folder._id === id ? { ...folder, name: newName } : folder
      ));
    } catch (error) {
      console.error('Error updating folder:', error);
      setError(error.message || 'Failed to update folder name');
    }
  };

  const handleProjectBlur = () => {
    setEditingProjectId(null);
  };

  const handleFolderBlur = () => {
    setEditingFolderId(null);
  };

  const handleProjectKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      setEditingProjectId(null);
    }
  };

  const handleFolderKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      setEditingFolderId(null);
    }
  };

  const handleRenameProject = (id) => {
    setEditingProjectId(id);
    setProjectMenuOpenId(null);
  };

  const handleRenameFolder = (id) => {
    setEditingFolderId(id);
    setFolderMenuOpenId(null);
  };

  const handleDeleteClick = (id, type) => {
    setItemToDelete(id);
    setDeleteType(type);
    setShowDeleteConfirm(true);
    // Close the menu
    if (type === 'project') {
      setProjectMenuOpenId(null);
    } else {
      setFolderMenuOpenId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (deleteType === 'project') {
        await projects.delete(itemToDelete);
        setProjectsList(prev => prev.filter(project => project._id !== itemToDelete));
        if (selectedProject?._id === itemToDelete) {
          setSelectedProject(null);
        }
        toast.success('Project deleted successfully');
      } else {
        await folders.delete(itemToDelete);
        setFoldersList(prev => prev.filter(folder => folder._id !== itemToDelete));
        if (selectedFolderId === itemToDelete) {
          setSelectedFolderId(null);
        }
        toast.success('Folder deleted successfully');
      }
    } catch (error) {
      console.error(`Error deleting ${deleteType}:`, error);
      toast.error(`Failed to delete ${deleteType}. Please try again.`);
    } finally {
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      setDeleteType('');
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setItemToDelete(null);
    setDeleteType('');
  };

  const handleOpenFolder = (folderId) => {
    setSelectedFolderId(selectedFolderId === folderId ? null : folderId);
  };

  const handleAddItem = (folderId) => {
    setShowAddItemForm(true);
  };

  const handleShareClick = (project) => {
    setSelectedProjectForSharing(project);
    setSharedUsers(project.sharedWith || []);
    setShowShareModal(true);
    setProjectMenuOpenId(null);
  };

  const handleShareProject = async () => {
    if (!usernameToShare.trim()) {
      setShareError('Please enter a username');
      return;
    }

    try {
      const response = await projects.shareProject(selectedProjectForSharing._id, [usernameToShare.trim()], sharePermission);
      setSharedUsers(response.sharedWith);
      setUsernameToShare('');
      setShareError('');
      toast.success('Project shared successfully');
      
      // Update the project in the list
      setProjectsList(prev => prev.map(p => 
        p._id === selectedProjectForSharing._id 
          ? { ...p, sharedWith: response.sharedWith }
          : p
      ));
    } catch (error) {
      setShareError(error.message);
      toast.error(error.message);
    }
  };

  const handleRemoveUser = async (username) => {
    try {
      const response = await projects.removeUserFromProject(selectedProjectForSharing._id, username);
      setSharedUsers(response.sharedWith);
      toast.success('User removed from project');
      
      // Update the project in the list
      setProjectsList(prev => prev.map(p => 
        p._id === selectedProjectForSharing._id 
          ? { ...p, sharedWith: response.sharedWith }
          : p
      ));
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (editingFolderId && folderInputRef.current) {
      folderInputRef.current.focus();
      folderInputRef.current.select();
    }
  }, [editingFolderId]);

  useEffect(() => {
    if (editingProjectId && projectInputRef.current) {
      projectInputRef.current.focus();
      projectInputRef.current.select();
    }
  }, [editingProjectId]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center flex-grow">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7FAF37] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="w-full h-16 bg-white border-b border-gray-200" />
      <div className="w-full" style={{ height: '250px', overflow: 'hidden' }}>
        <img
          src={projectPageBanner}
          alt="Projects banner"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex flex-col flex-grow px-8 py-8">
        {error && (
          <div className="flex items-center justify-between p-4 mb-4 text-red-700 bg-red-100 rounded">
            <span>{error}</span>
            <button 
              onClick={() => setError('')}
              className="text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-[#7FAF37] mb-4">Projects</h1>
          <p className="text-lg">Organize and collaborate on your projects with ease.</p>
        </div>

        {/* Projects Section */}
        <div className="w-full pl-4 mb-10">
          <h2 className="text-xl font-medium text-[#7FAF37] mb-4">Projects</h2>
          <div className="flex flex-wrap items-start gap-6">
            <button
              className="bg-[#7FAF37] text-white font-medium py-3 px-6 rounded-md w-72 flex items-center justify-center border-2 border-[#7FAF37] hover:bg-white hover:text-[#7FAF37] transition-all"
              onClick={handleCreateProject}
            >
              <span className="mr-2">+</span> CREATE NEW PROJECT
            </button>

            <div className="flex flex-wrap items-center max-w-full gap-6 ml-8">
              {projectsList.map(project => (
                <div
                  key={project._id}
                  className={`h-12 px-4 bg-white border-[3px] rounded-md flex items-center shadow-md relative ${
                    selectedProject?._id === project._id ? 'border-[#7FAF37]' : 'border-white'
                  }`}
                >
                  {editingProjectId === project._id ? (
                    <input
                      ref={projectInputRef}
                      type="text"
                      value={project.name}
                      onChange={(e) => handleProjectNameChange(project._id, e.target.value)}
                      onBlur={handleProjectBlur}
                      onKeyDown={(e) => handleProjectKeyDown(e, project._id)}
                      className="w-48 px-2 py-1 border border-[#7FAF37] rounded focus:outline-none"
                    />
                  ) : (
                    <>
                      <img src={folderIcon} alt="Project Icon" className="w-6 h-6 mr-2" />
                      <div
                        className="text-[#013024] font-bold hover:underline hover:text-[#7FAF37] cursor-pointer transition-all"
                        onClick={() => handleProjectSelect(project)}
                      >
                        {project.name}
                      </div>
                      {project.isShared && (
                        <div className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {project.userPermission === 'edit' ? 'Shared (Can Edit)' : 'Shared (View Only)'}
                        </div>
                      )}
                      {(!project.isShared || project.userPermission === 'edit') && (
                        <div className="relative ml-2">
                          <button
                            onClick={() =>
                              setProjectMenuOpenId(projectMenuOpenId === project._id ? null : project._id)
                            }
                            className="font-bold text-gray-500"
                          >
                            ⋮
                          </button>
                          {projectMenuOpenId === project._id && (
                            <div className="absolute z-10 bg-white border rounded shadow-md right-2 top-6">
                              {(!project.isShared || project.userPermission === 'edit') && (
                                <>
                                  <button
                                    className="block px-4 py-2 text-sm text-black w-full text-left hover:bg-[#D4D4D4]"
                                    onClick={() => handleRenameProject(project._id)}
                                  >
                                    Rename
                                  </button>
                                  <button
                                    className="block px-4 py-2 text-sm text-black w-full text-left hover:bg-[#D4D4D4]"
                                    onClick={() => handleDeleteClick(project._id, 'project')}
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                              {!project.isShared && (
                                <button
                                  className="block px-4 py-2 text-sm text-black w-full text-left hover:bg-[#D4D4D4] transition-colors duration-300"
                                  onClick={() => handleShareClick(project)}
                                >
                                  Share
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Folders Section - Only shown when a project is selected */}
        {selectedProject && (
          <div className="w-full pl-4">
            <h2 className="text-xl font-medium text-[#7FAF37] mb-4">Folders</h2>
            <div className="flex items-start">
              <button
                className="bg-[#7FAF37] text-white font-medium py-3 px-6 rounded-md w-72 flex items-center justify-center border-2 border-[#7FAF37] hover:bg-white hover:text-[#7FAF37] transition-all duration-300"
                onClick={handleCreateFolder}
              >
                <span className="mr-2">+</span> CREATE NEW FOLDER
              </button>

              <div className="flex flex-col w-full max-w-4xl gap-4 ml-8">
                {foldersList.map(folder => (
                  <div
                    key={folder._id}
                    className={`bg-white rounded-md shadow-md transition-all duration-300 ease-in-out ${
                      selectedFolderId === folder._id 
                        ? 'border-[3px] border-[#7FAF37]' 
                        : 'border-[3px] border-white hover:border-gray-200'
                    }`}
                  >
                    {/* Folder Header */}
                    <div className="flex items-center justify-between h-12 px-4">
                      {editingFolderId === folder._id ? (
                        <input
                          ref={folderInputRef}
                          type="text"
                          value={folder.name}
                          onChange={(e) => handleFolderNameChange(folder._id, e.target.value)}
                          onBlur={handleFolderBlur}
                          onKeyDown={(e) => handleFolderKeyDown(e, folder._id)}
                          className="w-48 px-2 py-1 border border-[#7FAF37] rounded focus:outline-none transition-all duration-300"
                        />
                      ) : (
                        <>
                          <button
                            onClick={() => handleOpenFolder(folder._id)}
                            className="flex items-center text-[#013024] font-bold hover:text-[#7FAF37] transition-all duration-300"
                          >
                            <div className="transition-transform duration-300 transform">
                              {selectedFolderId === folder._id ? (
                                <FaChevronDown className="mr-2 text-[#7FAF37]" />
                              ) : (
                                <FaChevronRight className="mr-2" />
                              )}
                            </div>
                            <img src={folderIcon} alt="Folder Icon" className="w-6 h-6 mr-2 transition-transform duration-300 hover:scale-110" />
                            {folder.name}
                          </button>
                          {(!selectedProject.isShared || selectedProject.userPermission === 'edit') && (
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setFolderMenuOpenId(folderMenuOpenId === folder._id ? null : folder._id)
                                }
                                className="font-bold text-gray-500 hover:text-[#7FAF37] transition-colors duration-300"
                              >
                                ⋮
                              </button>
                              {folderMenuOpenId === folder._id && (
                                <div className="absolute right-0 z-10 transition-all duration-300 origin-top-right transform bg-white border rounded shadow-md top-6">
                                  <button
                                    className="block px-4 py-2 text-sm text-black w-full text-left hover:bg-[#D4D4D4] transition-colors duration-300"
                                    onClick={() => handleRenameFolder(folder._id)}
                                  >
                                    Rename
                                  </button>
                                  <button
                                    className="block px-4 py-2 text-sm text-black w-full text-left hover:bg-[#D4D4D4] transition-colors duration-300"
                                    onClick={() => handleDeleteClick(folder._id, 'folder')}
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Folder Content */}
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      selectedFolderId === folder._id ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-medium text-gray-700">Folder Items</h3>
                          {(!selectedProject.isShared || selectedProject.userPermission === 'edit') && (
                            <button
                              onClick={() => handleAddItem(folder._id)}
                              className="flex items-center px-3 py-1 text-sm text-[#7FAF37] hover:text-[#013024] transition-all duration-300 hover:scale-105"
                            >
                              <FaPlus className="mr-1 transition-transform duration-300" />
                              Add Item
                            </button>
                          )}
                        </div>
                        <div className="transition-all duration-300 transform">
                          <FolderItems 
                            folderId={folder._id} 
                            canEdit={!selectedProject.isShared || selectedProject.userPermission === 'edit'} 
                            projectId={selectedProject._id}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {showAddItemForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl w-[500px] max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-[#7FAF37]">Add Items to Folder</h2>
              <p className="mt-1 text-sm text-gray-500">Upload images and add notes to your folder</p>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const formData = new FormData();
                  
                  // Add all selected files
                  selectedFiles.forEach(file => {
                    formData.append('images', file);
                  });

                  // Add the new note if it's not empty
                  if (newNote.trim()) {
                    formData.append('notes', newNote);
                  }

                  await folders.addItems(selectedFolderId, formData);
                  toast.success('Items added successfully');
                  setShowAddItemForm(false);
                  setSelectedFiles([]);
                  setNewNote('');
                  // Refresh the folders list
                  fetchFolders(selectedProject._id);
                } catch (error) {
                  toast.error(error.message || 'Failed to add items');
                }
              }}>
                {/* File Upload Section */}
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Images
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#7FAF37] transition-colors">
                    <div className="space-y-1 text-center">
                      <svg
                        className="w-12 h-12 mx-auto text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-[#7FAF37] hover:text-[#013024] focus-within:outline-none"
                        >
                          <span>Upload files</span>
                          <input
                            id="file-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="mt-4">
                      <h4 className="mb-2 text-sm font-medium text-gray-700">Selected Files:</h4>
                      <ul className="space-y-2">
                        {selectedFiles.map((file, index) => (
                          <li key={index} className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 rounded bg-gray-50">
                            <span className="truncate">{file.name}</span>
                            <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)}MB</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Note Section */}
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Note
                  </label>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7FAF37] focus:border-[#7FAF37] transition-colors"
                    rows="4"
                    placeholder="Enter your note here..."
                  />
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end pt-4 space-x-3 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddItemForm(false);
                      setSelectedFiles([]);
                      setNewNote('');
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7FAF37] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedFiles.length && !newNote.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#7FAF37] rounded-lg hover:bg-[#013024] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7FAF37] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Save Items
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl w-[400px] p-6">
            <h2 className="mb-4 text-xl font-bold text-red-600">Confirm Delete</h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this {deleteType}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7FAF37] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl w-[500px] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-[#7FAF37]">Share Project</h2>
              <button
                onClick={() => {
                  setShowShareModal(false);
                  setSelectedProjectForSharing(null);
                  setUsernameToShare('');
                  setShareError('');
                  setSharePermission('view');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Share with (username)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={usernameToShare}
                  onChange={(e) => setUsernameToShare(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7FAF37] focus:border-[#7FAF37]"
                  placeholder="Enter username"
                />
                <select
                  value={sharePermission}
                  onChange={(e) => setSharePermission(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7FAF37] focus:border-[#7FAF37]"
                >
                  <option value="view">View Only</option>
                  <option value="edit">Can Edit</option>
                </select>
                <button
                  onClick={handleShareProject}
                  className="px-4 py-2 bg-[#7FAF37] text-white rounded-lg hover:bg-[#013024] transition-colors"
                >
                  Share
                </button>
              </div>
              {shareError && (
                <p className="mt-2 text-sm text-red-600">{shareError}</p>
              )}
            </div>

            {sharedUsers.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-700">Shared with:</h3>
                <div className="space-y-2">
                  {sharedUsers.map((user) => (
                    <div
                      key={user.username}
                      className="flex items-center justify-between px-3 py-2 rounded bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{user.username}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200">
                          {user.permission === 'edit' ? 'Can Edit' : 'View Only'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveUser(user.username)}
                        className="text-red-600 transition-colors hover:text-red-800"
                      >
                        <FaUserMinus />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
