import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import isToday from 'dayjs/plugin/isToday';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { calendar } from '../services/api';
import { toast } from 'react-toastify';

dayjs.extend(weekday);
dayjs.extend(isToday);
dayjs.extend(isSameOrAfter);

const lightGreen = '#A7EC4F';
const darkGreen = '#7FAF37';

const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [editEventData, setEditEventData] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await calendar.getMyEvents();
      // Transform the events data into the format expected by the calendar
      const formattedEvents = data.reduce((acc, event) => {
        const date = dayjs(event.dateTime).format('YYYY-MM-DD');
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push({
          id: event._id,
          title: event.title,
          time: dayjs(event.dateTime).format('h:mm A'),
          description: event.description || '',
          reminder: event.reminder,
          folderId: event.folderId,
          projectId: event.projectId
        });
        return acc;
      }, {});
      setEvents(formattedEvents);
    } catch (error) {
      toast.error('Failed to fetch calendar events');
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const startOfMonth = currentMonth.startOf('month');
  const daysInMonth = currentMonth.daysInMonth();
  const firstDayIndex = startOfMonth.day();

  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(startOfMonth.date(i));

  const handlePrev = () => setCurrentMonth(prev => prev.subtract(1, 'month'));
  const handleNext = () => setCurrentMonth(prev => prev.add(1, 'month'));

  const getReminderColor = date => {
    const day = date.day();
    return [0, 2, 4, 6].includes(day) ? lightGreen : darkGreen;
  };

  const handleDeleteEvent = async () => {
    try {
      await calendar.delete(selectedEvent.id);
      await fetchEvents(); // Refresh events after deletion
      toast.success('Event deleted successfully');
    } catch (error) {
      toast.error('Failed to delete event');
      console.error('Error deleting event:', error);
    } finally {
      setShowDeletePopup(false);
      setSelectedEvent(null);
    }
  };

  const handleEditEvent = () => {
    setEditEventData({ ...selectedEvent });
    setShowEditPanel(true);
    setSelectedEvent(null);
  };

  const closeEditPanel = () => {
    setShowEditPanel(false);
    setEditEventData(null);
  };

  const handleSaveEvent = async () => {
    try {
      console.log('Edit Event Data:', editEventData);

      if (!editEventData.date || !editEventData.time) {
        throw new Error('Date and time are required');
      }

      // Parse the time string to get hours and minutes
      const timeStr = editEventData.time.toLowerCase();
      const period = timeStr.includes('pm') ? 'pm' : 'am';
      const time = timeStr.replace(/[ap]m/, '').trim();
      
      console.log('Time parts:', { time, period });

      let [hours, minutes] = time.split(':').map(Number);
      console.log('Hours and minutes:', { hours, minutes });
      
      // Convert to 24-hour format
      if (period === 'pm' && hours !== 12) {
        hours += 12;
      } else if (period === 'am' && hours === 12) {
        hours = 0;
      }
      console.log('Converted hours:', hours);

      // Create a dayjs object with the date and time
      const dateObj = dayjs(editEventData.date);
      console.log('Date object:', dateObj.format());

      const dateTime = dateObj
        .hour(hours)
        .minute(minutes)
        .second(0)
        .millisecond(0);
      
      console.log('Final datetime:', dateTime.format());

      if (!dateTime.isValid()) {
        throw new Error('Invalid date/time combination');
      }

      const eventData = {
        title: editEventData.title,
        dateTime: dateTime.toISOString(),
        reminder: editEventData.reminder,
        folderId: editEventData.folderId,
        projectId: editEventData.projectId
      };

      console.log('Event data to be sent:', eventData);

      if (editEventData.id) {
        // Update existing event
        await calendar.update(editEventData.id, eventData);
        toast.success('Event updated successfully');
      } else {
        // Create new event
        await calendar.create(eventData);
        toast.success('Event created successfully');
      }

      // Refresh events and close panel
      await fetchEvents();
      closeEditPanel();
    } catch (error) {
      console.error('Detailed error:', {
        message: error.message,
        editEventData,
        stack: error.stack
      });
      toast.error(error.message || 'Failed to save event');
    }
  };

  const [miniCalendarMonth, setMiniCalendarMonth] = useState(
    dayjs(editEventData?.date || new Date())
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white pt-[100px] pb-[70px] px-4 font-[Hanken Grotesk] relative overflow-hidden">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7FAF37]"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-[100px] pb-[70px] px-4 font-[Hanken Grotesk] relative overflow-hidden">
        {/* Calendar Header */}
        <div className="flex justify-center items-center gap-1 text-2xl font-bold text-[#013024] mb-6">
          <button onClick={handlePrev} className="px-2">&lt;</button>
          <h2 className="mx-2">{currentMonth.format('MMMM YYYY')}</h2>
          <button onClick={handleNext} className="px-2">&gt;</button>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 text-center font-semibold mb-2 text-[#7FAF37]">
          {weekDays.map(day => <div key={day}>{day}</div>)}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1 text-sm">
          {calendarDays.map((day, index) => {
            if (!day) return <div key={index} className="h-24 p-1 bg-transparent border"></div>;

            const dayKey = day.format('YYYY-MM-DD');
            const dayEvents = events[dayKey] || [];
            const showMore = dayEvents.length > 2;
            const displayEvents = showMore ? dayEvents.slice(0, 2) : dayEvents;

            return (
              <div
                key={day.toString()}
                className="relative h-24 p-1 border cursor-pointer"
                onClick={() => dayEvents.length > 0 && setSelectedDate(dayKey)}
              >
                <div className={`text-xs absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center font-bold ${day.isToday() ? 'bg-[#013024] text-white' : ''}`}>
                  {day.date()}
                </div>
                <div className="mt-6 space-y-1">
                  {displayEvents.map((event, i) => (
                    <div
                      key={i}
                      className="text-white px-1 rounded text-[11px] truncate"
                      style={{ backgroundColor: getReminderColor(day) }}
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedEvent({ ...event, date: dayKey });
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {showMore && <div className="text-xs text-black cursor-pointer hover:underline">more</div>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Date Popup */}
        {selectedDate && !selectedEvent && (
          <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-20">
            <div className="relative p-4 bg-white border rounded-lg shadow-lg w-72">
              <div className="pb-2 font-bold text-center text-green-700 border-b">
                {dayjs(selectedDate).format('ddd').toUpperCase()}<br />
                <span className="text-black">{dayjs(selectedDate).date()}</span>
              </div>
              <button
                className="absolute text-gray-500 top-2 right-3 hover:text-black"
                onClick={() => setSelectedDate(null)}
              >
                ✕
              </button>
              <div className="mt-3 space-y-2">
                {events[selectedDate].map((e, i) => (
                  <div
                    key={i}
                    className="px-2 py-1 text-xs text-white truncate rounded"
                    style={{ backgroundColor: getReminderColor(dayjs(selectedDate)) }}
                  >
                    {e.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content Popup */}
        {selectedEvent && (
          <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-30">
            <div className="bg-white border rounded-lg shadow-[0_2px_6px_#D4D4D4] p-5 w-[350px] relative text-sm">
              <button className="absolute text-gray-500 top-2 right-3" onClick={() => setSelectedEvent(null)}>✕</button>
              <p className="text-[#7FAF37] font-bold text-lg mb-1">{selectedEvent.title}</p>
              <p className="mb-2 text-sm font-bold text-black">
                {selectedEvent.time} | {dayjs(selectedEvent.date).format('dddd, D MMMM YYYY')}
              </p>
              <div className="border-t border-[#D4D4D4] mb-3"></div>
              {selectedEvent.image && (
                <div className="bg-[#D4D4D4] p-1 shadow-[0_2px_6px_#D4D4D4] mb-3">
                  <img
                    src={`/images/${selectedEvent.image}`}
                    alt="Reminder"
                    className="object-cover w-full h-40 mb-1"
                  />
                  <p className="text-sm font-bold text-center">{selectedEvent.description}</p>
                </div>
              )}
              {!selectedEvent.image && (
                <p className="mb-3 text-sm font-bold text-center">{selectedEvent.description}</p>
              )}
              <div className="flex justify-end gap-4 mt-2">
                <button className="flex items-center gap-1 text-[#013024] font-semibold" onClick={handleEditEvent}>
                  <img src="/Images/EditIcon.png" className="w-4 h-4" alt="Edit" /> Edit
                </button>
                <button className="flex items-center gap-1 font-semibold text-red-600" onClick={() => setShowDeletePopup(true)}>
                  <img src="/Images/DeleteIcon.png" className="w-4 h-4" alt="Delete" /> Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right Side Edit Panel */}
        {showEditPanel && (
          <div className="fixed top-0 right-0 w-[380px] h-full bg-white border-l border-[#D4D4D4] z-50 shadow-lg p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xl font-bold text-[#013024]">Add to Calendar</div>
              <button
                className="text-xl text-gray-500 hover:text-black"
                onClick={closeEditPanel}
              >
                ✕
              </button>
            </div>
            <div className="border-b border-[#D4D4D4] mb-4"></div>

            {editEventData?.image && (
              <div className="bg-[#D4D4D4] p-1 shadow-[0_2px_6px_#D4D4D4] mb-4">
                <img src={`/images/${editEventData.image}`} className="object-cover w-full h-40 rounded" />
                <p className="mt-2 font-semibold text-center">{editEventData.description}</p>
              </div>
            )}

            <div className="mb-4">
              <label className="text-[#7FAF37] font-semibold flex items-center gap-2 mb-1">
                <img src="/Images/ReminderTitleIcon.png" className="w-4 h-4" /> Title
              </label>
              <input
                type="text"
                className="w-full px-2 py-1 border rounded"
                value={editEventData?.title || ''}
                onChange={e => setEditEventData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="mb-4">
              <label className="text-[#7FAF37] font-semibold flex items-center gap-2 mb-2">
                <img src="/Images/DateIcon.png" className="w-4 h-4" /> Date
              </label>

              <div className="flex items-center justify-between px-2 mb-2">
                <button
                  onClick={() => setMiniCalendarMonth(prev => prev.subtract(1, 'month'))}
                  className="text-[#7FAF37] font-bold text-lg hover:text-[#013024]"
                >
                  ‹
                </button>
                <div className="text-sm font-semibold text-[#013024]">
                  {miniCalendarMonth.format('MMMM YYYY')}
                </div>
                <button
                  onClick={() => setMiniCalendarMonth(prev => prev.add(1, 'month'))}
                  className="text-[#7FAF37] font-bold text-lg hover:text-[#013024]"
                >
                  ›
                </button>
              </div>

              <div className="grid grid-cols-7 text-xs text-center border rounded shadow-lg">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={i} className="py-1 font-semibold text-[#7FAF37]">{d}</div>
                ))}
                {(() => {
                  const monthStart = miniCalendarMonth.startOf('month');
                  const daysInMonth = monthStart.daysInMonth();
                  const firstDay = monthStart.day();
                  const cells = [];

                  for (let i = 0; i < firstDay; i++) {
                    cells.push(<div key={`empty-${i}`} className="py-2"></div>);
                  }

                  for (let i = 1; i <= daysInMonth; i++) {
                    const current = monthStart.date(i);
                    const formatted = current.format('YYYY-MM-DD');
                    const selected = editEventData.date === formatted;
                    cells.push(
                      <div
                        key={i}
                        className={`py-[6px] text-xs cursor-pointer rounded-full ${
                          selected ? 'bg-[#A7EC4F] text-white font-bold' : 'hover:bg-[#A7EC4F] hover:text-white'
                        }`}
                        onClick={() => {
                          setEditEventData(prev => ({ ...prev, date: formatted }));
                        }}
                      >
                        {i}
                      </div>
                    );
                  }
                  return cells;
                })()}
              </div>
            </div>

            <div className="mb-6">
              <label className="text-[#7FAF37] font-semibold flex items-center gap-2 mb-1">
                <img src="/Images/TimeIcon.png" className="w-4 h-4" /> Time
              </label>
              <select
                className="w-full px-2 py-1 border rounded"
                value={editEventData?.time || ''}
                onChange={e => setEditEventData(prev => ({ ...prev, time: e.target.value }))}
              >
                {[
                  '8:00am', '8:30am', '9:00am', '9:30am',
                  '10:00am', '10:30am', '11:00am', '11:30am',
                  '12:00pm', '12:30pm', '1:00pm', '1:30pm',
                  '2:00pm', '2:30pm', '3:00pm', '3:30pm',
                  '4:00pm', '4:30pm', '5:00pm', '5:30pm',
                  '6:00pm', '6:30pm', '7:00pm', '7:30pm',
                  '8:00pm', '8:30pm', '9:00pm'
                ].map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-start gap-4">
              <button
                className="bg-[#7FAF37] text-white px-5 py-2 rounded font-semibold hover:bg-transparent hover:text-[#7FAF37] border border-[#7FAF37] transition"
                onClick={handleSaveEvent}
              >
                SAVE
              </button>
              <button
                className="bg-[#7FAF37] text-white px-5 py-2 rounded font-semibold hover:bg-transparent hover:text-[#7FAF37] border border-[#7FAF37] transition"
                onClick={closeEditPanel}
              >
                CANCEL
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeletePopup && (
          <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <div className="relative p-6 text-center bg-white rounded-lg shadow-lg w-80">
              <button
                className="absolute text-gray-500 top-2 right-3 hover:text-black"
                onClick={() => setShowDeletePopup(false)}
              >
                ✕
              </button>
              <p className="mb-4 text-lg font-semibold">Are you sure you want to delete this content reminder?</p>
              <div className="mt-4 space-x-4">
                <button
                  className="w-24 py-2 text-white bg-[#7FAF37] rounded-lg"
                  onClick={handleDeleteEvent}
                >
                  Yes
                </button>
                <button
                  className="w-24 py-2 text-white bg-[#7FAF37] rounded-lg"
                  onClick={() => setShowDeletePopup(false)}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Calendar;
