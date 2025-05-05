import React, { useState } from 'react';
import { FaCalendarAlt, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CalendarModal = ({ isOpen, onClose, onSave }) => {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    time: '',
    reminder: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!eventData.title || !eventData.date || !eventData.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    const dateTime = new Date(`${eventData.date}T${eventData.time}`).toISOString();
    onSave({
      title: eventData.title,
      dateTime,
      reminder: eventData.reminder
    });
    setEventData({
      title: '',
      date: '',
      time: '',
      reminder: false
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#013024] flex items-center">
            <FaCalendarAlt className="mr-2" />
            Add to Calendar
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Title
            </label>
            <input
              type="text"
              value={eventData.title}
              onChange={(e) => setEventData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7FAF37]"
              placeholder="Enter event title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={eventData.date}
              onChange={(e) => setEventData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7FAF37]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <input
              type="time"
              value={eventData.time}
              onChange={(e) => setEventData(prev => ({ ...prev, time: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7FAF37]"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="reminder"
              checked={eventData.reminder}
              onChange={(e) => setEventData(prev => ({ ...prev, reminder: e.target.checked }))}
              className="h-4 w-4 text-[#7FAF37] focus:ring-[#7FAF37] border-gray-300 rounded"
            />
            <label htmlFor="reminder" className="ml-2 block text-sm text-gray-700">
              Set Reminder
            </label>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#7FAF37] rounded-md hover:bg-[#6B9A2E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7FAF37]"
            >
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CalendarModal; 