import React, { useState } from 'react';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import isToday from 'dayjs/plugin/isToday';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

dayjs.extend(weekday);
dayjs.extend(isToday);
dayjs.extend(isSameOrAfter);

const lightGreen = '#A7EC4F';
const darkGreen = '#7FAF37';

const eventsData = {
  '2025-04-17': [
    {
      title: 'Post Morning Routine to IG',
      time: '8:30pm',
      image: 'MeditationPose.jpg',
      description: 'Healthy Morning Routines',
    },
    {
      title: 'Facebook Weekend Offer Post',
      time: '3:00pm',
      image: '',
      description: 'Share the upcoming weekend offers on Facebook',
    },
    {
      title: 'Email Campaign Setup',
      time: '10:00am',
      image: '',
      description: 'Prepare and schedule email blasts for the weekend deals',
    }
  ],
  '2025-04-21': [
    {
      title: 'New Collection Launch',
      time: '11:00am',
      image: 'LaunchBanner.jpg',
      description: 'Announce new spring collection with image banner',
    }
  ],
  '2025-04-22': [
    {
      title: 'Influencer Collaboration Teaser',
      time: '2:00pm',
      image: 'TeaserImage.jpg',
      description: 'Tease upcoming collab with @trendygal',
    }
  ],
  '2025-04-26': [
    {
      title: 'Instagram Story Poll',
      time: '6:00pm',
      image: '',
      description: 'Poll: Which color do you prefer? Green or Jade?',
    },
    {
      title: 'Schedule Giveaway Post',
      time: '9:00am',
      image: '',
      description: 'Draft copy and creative for the April giveaway',
    }
  ],
  '2025-04-28': [
    {
      title: 'Customer Review Repost',
      time: '4:00pm',
      image: '',
      description: 'Highlight satisfied customer review on IG',
    }
  ],
  '2025-04-30': [
    {
      title: 'End of Month Report',
      time: '5:30pm',
      image: '',
      description: 'Summarize analytics and social media KPIs',
    }
  ]
};

const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

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

  const handleDeleteEvent = () => {
    setShowDeletePopup(false);
    setSelectedEvent(null);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-[100px] pb-[70px] px-4 font-[Hanken Grotesk]">
        {/* Header */}
        <div className="flex justify-center items-center gap-1 text-2xl font-bold text-[#013024] mb-6">
          <button onClick={handlePrev} className="px-2">&lt;</button>
          <h2 className="mx-2">{currentMonth.format('MMMM YYYY')}</h2>
          <button onClick={handleNext} className="px-2">&gt;</button>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 text-center font-semibold mb-2 text-[#7FAF37]">
          {weekDays.map(day => <div key={day}>{day}</div>)}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1 text-sm">
          {calendarDays.map((day, index) => {
            if (!day) return <div key={index} className="h-24 border p-1 bg-transparent"></div>;

            const dayKey = day.format('YYYY-MM-DD');
            const events = eventsData[dayKey] || [];
            const showMore = events.length > 2;
            const displayEvents = showMore ? events.slice(0, 2) : events;

            return (
              <div
                key={day.toString()}
                className="relative h-24 border p-1 cursor-pointer"
                onClick={() => events.length > 0 && setSelectedDate(dayKey)}
              >
                <div
                  className={`text-xs absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center font-bold ${day.isToday() ? 'bg-[#013024] text-white' : ''}`}
                >
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
                  {showMore && (
                    <div className="text-xs text-black hover:underline cursor-pointer">
                      more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Date Popup */}
        {selectedDate && !selectedEvent && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-20 flex items-center justify-center z-50">
            <div className="bg-white border rounded-lg shadow-lg p-4 w-72 relative">
              <div className="text-center text-green-700 font-bold border-b pb-2">
                {dayjs(selectedDate).format('ddd').toUpperCase()}<br />
                <span className="text-black">{dayjs(selectedDate).date()}</span>
              </div>
              <button
                className="absolute top-2 right-3 text-gray-500 hover:text-black"
                onClick={() => setSelectedDate(null)}
              >
                ✕
              </button>
              <div className="mt-3 space-y-2">
                {eventsData[selectedDate].map((e, i) => (
                  <div
                    key={i}
                    className="text-white px-2 py-1 text-xs rounded truncate"
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
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white border rounded-lg shadow-[0_2px_6px_#D4D4D4] p-5 w-[350px] relative text-sm">
              <button className="absolute top-2 right-3 text-gray-500" onClick={() => setSelectedEvent(null)}>✕</button>
              <p className="text-[#7FAF37] font-bold text-lg mb-1">{selectedEvent.title}</p>
              <p className="text-black font-bold text-sm mb-2">
                {selectedEvent.time} | {dayjs(selectedEvent.date).format('dddd, D MMMM YYYY')}
              </p>
              <div className="border-t border-[#D4D4D4] mb-3"></div>
              {selectedEvent.image && (
                <div className="bg-[#D4D4D4] p-1 shadow-[0_2px_6px_#D4D4D4] mb-3">
                  <img
                    src={`/images/${selectedEvent.image}`}
                    alt="Reminder"
                    className="w-full h-40 object-cover mb-1"
                  />
                  <p className="text-center font-bold text-sm">{selectedEvent.description}</p>
                </div>
              )}
              {!selectedEvent.image && (
                <p className="text-center font-bold text-sm mb-3">{selectedEvent.description}</p>
              )}
              <div className="flex justify-end gap-4 mt-2">
                <button className="flex items-center gap-1 text-[#013024] font-semibold">
                  <img src="/Images/EditIcon.png" className="w-4 h-4" alt="Edit" /> Edit
                </button>
                <button className="flex items-center gap-1 text-red-600 font-semibold" onClick={() => setShowDeletePopup(true)}>
                  <img src="/Images/DeleteIcon.png" className="w-4 h-4" alt="Delete" /> Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Popup */}
        {showDeletePopup && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center relative">
              <button
                className="absolute top-2 right-3 text-gray-500 hover:text-black"
                onClick={() => setShowDeletePopup(false)}
              >
                ✕
              </button>
              <p className="text-lg font-semibold mb-4">Are you sure you want to delete this content reminder?</p>
              <div className="mt-4 space-x-4">
                <button
                  className="w-24 py-2 text-white bg-[#7FAF37] rounded-lg hover:bg-white hover:text-[#7FAF37] hover:border-2 hover:border-[#7FAF37] transition-all"
                  onClick={handleDeleteEvent}
                >
                  Yes
                </button>
                <button
                  className="w-24 py-2 text-white bg-[#7FAF37] rounded-lg hover:bg-white hover:text-[#7FAF37] hover:border-2 hover:border-[#7FAF37] transition-all"
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
