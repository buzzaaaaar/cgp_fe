import React, { useState, useEffect } from 'react';
import { folders, content, calendar } from '../services/api';
import { toast } from 'react-toastify';
import { FaTrash, FaFileAlt, FaCalendarAlt } from 'react-icons/fa';
import CalendarModal from './CalendarModal';

const FolderItems = ({ folderId, canEdit, projectId }) => {
  const [items, setItems] = useState({ images: [], notes: [], contents: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  useEffect(() => {
    fetchItems();
    fetchContents();
  }, [folderId]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await folders.getItems(folderId);
      setItems(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error('Error fetching folder items:', error);
      setError(error.message || 'Failed to fetch items');
      toast.error(error.message || 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const fetchContents = async () => {
    try {
      console.log('Fetching contents for folder:', folderId);
      const data = await content.getAll(folderId);
      console.log('Received contents:', data);
      setItems(prev => ({ ...prev, contents: data }));
    } catch (error) {
      console.error('Error fetching contents:', error);
      toast.error(error.message || 'Failed to fetch contents');
    }
  };

  const handleDeleteImage = async (index) => {
    if (!canEdit) {
      toast.error('You do not have permission to delete items');
      return;
    }

    try {
      await folders.deleteImage(folderId, index);
      toast.success('Image deleted successfully');
      fetchItems();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error(error.message || 'Failed to delete image');
    }
  };

  const handleDeleteNote = async (index) => {
    if (!canEdit) {
      toast.error('You do not have permission to delete items');
      return;
    }

    try {
      await folders.deleteNote(folderId, index);
      toast.success('Note deleted successfully');
      fetchItems();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error(error.message || 'Failed to delete note');
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (!canEdit) {
      toast.error('You do not have permission to delete items');
      return;
    }

    try {
      await content.delete(contentId);
      toast.success('Content deleted successfully');
      fetchContents();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error(error.message || 'Failed to delete content');
    }
  };

  const handleSaveCalendarEvent = async (eventData) => {
    try {
      console.log('Saving calendar event with data:', {
        ...eventData,
        folderId,
        projectId
      });
      await calendar.create({
        ...eventData,
        folderId,
        projectId
      });
      toast.success('Event added to calendar successfully');
    } catch (error) {
      console.error('Error saving calendar event:', error);
      toast.error(error.message || 'Failed to save calendar event');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7FAF37]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add to Calendar Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsCalendarModalOpen(true)}
          className="flex items-center px-4 py-2 bg-[#7FAF37] text-white rounded-md hover:bg-[#6B9A2E] transition-colors duration-200"
        >
          <FaCalendarAlt className="mr-2" />
          Add to Calendar
        </button>
      </div>

      {/* Calendar Modal */}
      <CalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        onSave={handleSaveCalendarEvent}
      />

      {/* Saved Content Section */}
      {items.contents.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Saved Content</h4>
          <div className="space-y-3">
            {items.contents.map((item) => (
              <div key={item._id} className="relative group bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start">
                  <FaFileAlt className="text-[#7FAF37] mt-1 mr-3 flex-shrink-0" />
                  <div className="flex-grow">
                    <h5 className="text-sm font-medium text-[#013024] mb-1">{item.name}</h5>
                    <p className="text-sm text-gray-600 mb-2">Type: {item.type}</p>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {typeof item.data.content === 'string' ? item.data.content : JSON.stringify(item.data.content, null, 2)}
                      </p>
                    </div>
                  </div>
                </div>
                {canEdit && (
                  <button
                    onClick={() => handleDeleteContent(item._id)}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Images Section */}
      {items.images.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Images</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={`http://localhost:5000${image}`}
                  alt={`Image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                {canEdit && (
                  <button
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes Section */}
      {items.notes.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Notes</h4>
          <div className="space-y-3">
            {items.notes.map((note, index) => (
              <div key={index} className="relative group bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{note}</p>
                {canEdit && (
                  <button
                    onClick={() => handleDeleteNote(index)}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {items.images.length === 0 && items.notes.length === 0 && items.contents.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          No items in this folder
        </div>
      )}
    </div>
  );
};

export default FolderItems; 