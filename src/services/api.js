import mockContent from './mockData';

const API_BASE_URL = 'http://localhost:5000/api';
const USE_MOCK_DATA = true; // Set to false to use real API

// Data storage service
const storage = {
  projects: {
    getAll: () => {
      const projects = localStorage.getItem('projects');
      return projects ? JSON.parse(projects) : [];
    },
    save: (projects) => {
      localStorage.setItem('projects', JSON.stringify(projects));
    },
    add: (project) => {
      const projects = storage.projects.getAll();
      projects.push(project);
      storage.projects.save(projects);
      return project;
    },
    update: (id, data) => {
      const projects = storage.projects.getAll();
      const index = projects.findIndex(p => p._id === id);
      if (index !== -1) {
        projects[index] = { ...projects[index], ...data };
        storage.projects.save(projects);
        return projects[index];
      }
      throw new Error('Project not found');
    },
    delete: (id) => {
      const projects = storage.projects.getAll();
      const filtered = projects.filter(p => p._id !== id);
      storage.projects.save(filtered);
    }
  },
  folders: {
    getAll: (projectId) => {
      const folders = localStorage.getItem('folders');
      const allFolders = folders ? JSON.parse(folders) : [];
      return projectId ? allFolders.filter(f => f.projectId === projectId) : allFolders;
    },
    save: (folders) => {
      localStorage.setItem('folders', JSON.stringify(folders));
    },
    add: (folder) => {
      const folders = storage.folders.getAll();
      folders.push(folder);
      storage.folders.save(folders);
      return folder;
    },
    update: (id, data) => {
      const folders = storage.folders.getAll();
      const index = folders.findIndex(f => f._id === id);
      if (index !== -1) {
        folders[index] = { ...folders[index], ...data };
        storage.folders.save(folders);
        return folders[index];
      }
      throw new Error('Folder not found');
    },
    delete: (id) => {
      const folders = storage.folders.getAll();
      const filtered = folders.filter(f => f._id !== id);
      storage.folders.save(filtered);
    }
  }
};

// API service
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No authentication token found');
    return {};
  }
  return { 'x-auth-token': token };
};

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    console.error('Non-JSON response:', contentType);
    throw new Error('Server returned non-JSON response');
  }

  try {
    const data = await response.json();
    if (!response.ok) {
      console.error('API Error Response:', data);
      throw new Error(data.message || 'Something went wrong');
    }
    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('JSON Parse Error:', error);
      throw new Error('Invalid JSON response from server');
    }
    throw error;
  }
};

// Project service
const projects = {
  getTypes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/types`, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching project types:', error);
      throw new Error('Failed to fetch project types');
    }
  },

  getAll: async () => {
    try {
      console.log('Fetching projects with token:', localStorage.getItem('token')); // Debug log
      
      // Fetch both owned and shared projects
      const [ownedProjects, sharedProjects] = await Promise.all([
        fetch(`${API_BASE_URL}/projects/my-projects`, {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json'
          },
        }),
        fetch(`${API_BASE_URL}/projects/shared`, {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json'
          },
        })
      ]);
      
      console.log('Projects response status:', ownedProjects.status); // Debug log
      
      if (!ownedProjects.ok || !sharedProjects.ok) {
        if (ownedProjects.status === 404 || sharedProjects.status === 404) {
          console.log('No projects found, returning empty array');
          return [];
        }
        const errorData = await ownedProjects.json().catch(() => ({}));
        console.error('Projects API error:', {
          status: ownedProjects.status,
          statusText: ownedProjects.statusText,
          errorData
        });
        throw new Error(`HTTP error! status: ${ownedProjects.status}`);
      }
      
      const ownedData = await handleResponse(ownedProjects);
      const sharedData = await handleResponse(sharedProjects);
      
      // Combine both arrays and mark shared projects
      const allProjects = [
        ...ownedData,
        ...sharedData.map(project => ({
          ...project,
          isShared: true
        }))
      ];
      
      console.log('Projects data received:', allProjects); // Debug log
      
      // Return empty array if data is null/undefined or not an array
      if (!allProjects || !Array.isArray(allProjects)) {
        console.log('Invalid projects data format, returning empty array');
        return [];
      }
      
      return allProjects;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw new Error('Failed to fetch projects. Please check your connection and try again.');
    }
  },

  create: async (data) => {
    try {
      const project = {
        ...data,
        createdAt: new Date().toISOString()
      };

      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(project),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return handleResponse(response);
    } catch (error) {
      console.error('Error creating project:', error);
      throw new Error('Failed to create project. Please try again.');
    }
  },

  update: async (id, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return handleResponse(response);
    } catch (error) {
      console.error('Error updating project:', error);
      throw new Error('Failed to update project. Please try again.');
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await handleResponse(response);
    } catch (error) {
      console.error('Error deleting project:', error);
      throw new Error('Failed to delete project. Please try again.');
    }
  },

  // New method to sync pending changes with MongoDB
  syncPendingChanges: async () => {
    const projects = storage.projects.getAll();
    const pendingProjects = projects.filter(p => p._syncStatus === 'pending');
    const pendingDeletions = projects.filter(p => p._syncStatus === 'pending_deletion');

    try {
      // Sync pending creations and updates
      for (const project of pendingProjects) {
        const { _syncStatus, ...projectData } = project;
        await projects.create(projectData);
      }

      // Sync pending deletions
      for (const project of pendingDeletions) {
        await projects.delete(project._id);
      }

      // Clear sync status from local storage
      const updatedProjects = projects.map(p => {
        const { _syncStatus, ...rest } = p;
        return rest;
      });
      storage.projects.save(updatedProjects);

      return true;
    } catch (error) {
      console.error('Error syncing pending changes:', error);
      return false;
    }
  },

  // Project sharing methods
  shareProject: async (projectId, usernames, permission = 'view') => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ usernames, permission })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to share project');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to share project');
    }
  },

  removeUserFromProject: async (projectId, username) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/share/${username}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to remove user from project');
      }

      return await response.json();
    } catch (error) {
      console.error('Error removing user from project:', error);
      throw error;
    }
  },

  getSharedProjects: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/shared`, {
        headers: getAuthHeader()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch shared projects');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching shared projects:', error);
      throw error;
    }
  },
};

// Folder service
const folders = {
  getAll: async (projectId) => {
    try {
      console.log('Fetching folders for project:', projectId); // Debug log
      const response = await fetch(`${API_BASE_URL}/folders/my-folders?projectId=${projectId}`, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
      });
      
      console.log('Folders response status:', response.status); // Debug log
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Folders API error:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await handleResponse(response);
      console.log('Folders data received:', data); // Debug log
      return data;
    } catch (error) {
      console.error('Error fetching folders:', error);
      throw new Error(error.message || 'Failed to fetch folders. Please check your connection and try again.');
    }
  },

  create: async (data) => {
    try {
      const folder = {
        ...data,
        createdAt: new Date().toISOString()
      };

      const response = await fetch(`${API_BASE_URL}/folders`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(folder),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return handleResponse(response);
    } catch (error) {
      console.error('Error creating folder:', error);
      throw new Error('Failed to create folder. Please try again.');
    }
  },

  update: async (id, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/folders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return handleResponse(response);
    } catch (error) {
      console.error('Error updating folder:', error);
      throw new Error('Failed to update folder. Please try again.');
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/folders/${id}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return handleResponse(response);
    } catch (error) {
      console.error('Error deleting folder:', error);
      throw new Error('Failed to delete folder. Please try again.');
    }
  },

  addItems: async (folderId, formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/folders/${folderId}/items`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return handleResponse(response);
    } catch (error) {
      console.error('Error adding items to folder:', error);
      throw new Error('Failed to add items to folder. Please try again.');
    }
  },

  getItems: async (folderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/folders/${folderId}/items`, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching folder items:', error);
      throw new Error('Failed to fetch folder items. Please try again.');
    }
  },

  deleteImage: async (folderId, imageIndex) => {
    try {
      const response = await fetch(`${API_BASE_URL}/folders/${folderId}/images/${imageIndex}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return handleResponse(response);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image. Please try again.');
    }
  },

  deleteNote: async (folderId, noteIndex) => {
    try {
      const response = await fetch(`${API_BASE_URL}/folders/${folderId}/notes/${noteIndex}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return handleResponse(response);
    } catch (error) {
      console.error('Error deleting note:', error);
      throw new Error('Failed to delete note. Please try again.');
    }
  }
};

// Auth service
const auth = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  register: async (username, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });
    return handleResponse(response);
  },

  forgotPassword: async (email) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  },

  resetPassword: async (token, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password }),
    });
    return handleResponse(response);
  },
};

// User service
const users = {
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: getAuthHeader(),
    });
    return handleResponse(response);
  },

  updateProfile: async (data) => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  updatePassword: async (currentPassword, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/users/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return handleResponse(response);
  },

  deleteAccount: async () => {
    const response = await fetch(`${API_BASE_URL}/users/account`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return handleResponse(response);
  },
};

// Content service
const content = {
  generate: async (type, prompt, projectId, folderId) => {
    if (USE_MOCK_DATA) {
      return mockContent.generate(type, prompt);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/content/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ type, prompt, projectId, folderId })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate content');
      }

      return await response.json();
    } catch (error) {
      console.error('Content generation error:', error);
      throw error;
    }
  },

  save: async (name, type, data, projectId, folderId) => {
    // Always save to MongoDB, even when using mock data
    try {
      const response = await fetch(`${API_BASE_URL}/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ name, type, data, projectId, folderId })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save content');
      }

      return await response.json();
    } catch (error) {
      console.error('Content save error:', error);
      throw error;
    }
  },

  getMyContent: async () => {
    // Always fetch from MongoDB, even when using mock data
    try {
      const response = await fetch(`${API_BASE_URL}/content/my-content`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch content');
      }

      return await response.json();
    } catch (error) {
      console.error('Content fetch error:', error);
      throw error;
    }
  },

  getAll: async (folderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/content/folder/${folderId}`, {
        headers: getAuthHeader(),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch content');
      }

      return await response.json();
    } catch (error) {
      console.error('Content fetch error:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/content/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/content/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return handleResponse(response);
  },
};

// Calendar service
const calendar = {
  create: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/calendar`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw new Error('Failed to create calendar event');
    }
  },

  getMyEvents: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/calendar/my-events`, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw new Error('Failed to fetch calendar events');
    }
  },

  getFolderEvents: async (folderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/calendar/folder/${folderId}`, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching folder calendar events:', error);
      throw new Error('Failed to fetch folder calendar events');
    }
  },

  update: async (id, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/calendar/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw new Error('Failed to update calendar event');
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/calendar/${id}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw new Error('Failed to delete calendar event');
    }
  }
};

// Export all services
export {
  projects,
  folders,
  auth,
  users,
  content,
  calendar
}; 