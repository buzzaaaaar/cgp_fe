import React, { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { calendar } from '../services/api';
import dayjs from 'dayjs';

function Navbar() {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [todayEvents, setTodayEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const notifRef = useRef();
  const profileRef = useRef();
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchTodayEvents = async () => {
    try {
      setLoading(true);
      const events = await calendar.getMyEvents();
      const today = dayjs().startOf('day');
      const filteredEvents = events.filter(event => {
        const eventDate = dayjs(event.dateTime);
        return eventDate.isSame(today, 'day');
      });
      setTodayEvents(filteredEvents);
    } catch (error) {
      console.error('Error fetching today\'s events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showNotif) {
      fetchTodayEvents();
    }
  }, [showNotif]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-1 bg-white shadow">
      <div className="flex items-center justify-between h-[60px]">
        <div className="flex items-center space-x-10">
          <Link to="/Home ">
            <img
              src="/Images/RankmeoneNavbarLogo.png"
              alt="RankMeOne Logo"
              className="w-auto h-16"
            />
          </Link>
          <div className="hidden space-x-12 md:flex">
            <Link to="/seo-tools" className="font-medium text-gray-700 hover:text-green-700">
              SEO Tools
            </Link>
            <Link to="/projects" className="font-medium text-gray-700 hover:text-green-700">
              Projects
            </Link>
            <Link to="/calendar" className="font-medium text-gray-700 hover:text-green-700">
              Calendar
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-8">
          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setShowNotif(!showNotif);
                setShowProfile(false);
              }}
              className="relative text-gray-700 hover:text-green-700"
            >
              <FaBell className="w-6 h-6" />
              {todayEvents.length > 0 && (
                <span className="absolute flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                  {todayEvents.length}
                </span>
              )}
            </button>
            {showNotif && (
              <div className="absolute right-0 z-10 mt-2 bg-white border rounded shadow-lg w-80">
                <div className="px-4 py-2 font-semibold text-green-600 border-b">
                  Today's Reminders
                </div>
                <div className="overflow-y-auto max-h-96">
                  {loading ? (
                    <div className="px-4 py-6 text-sm text-center text-gray-400">
                      Loading reminders...
                    </div>
                  ) : todayEvents.length > 0 ? (
                    <div className="divide-y">
                      {todayEvents.map((event) => (
                        <div key={event._id} className="px-4 py-3 hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{event.title}</p>
                              <p className="text-sm text-gray-500">
                                {dayjs(event.dateTime).format('h:mm A')}
                              </p>
                            </div>
                            <Link
                              to="/calendar"
                              className="text-sm text-green-600 hover:text-green-700"
                              onClick={() => setShowNotif(false)}
                            >
                              View
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-sm text-center text-gray-400">
                      No reminders for today
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotif(false);
              }}
              className="flex items-center justify-center font-semibold text-white rounded-full bg-green-950 w-9 h-9"
            >
              R
            </button>
            {showProfile && (
              <div className="absolute right-0 z-10 w-40 mt-2 bg-white border rounded shadow-lg">
                <Link to="/my-profile" className="block px-4 py-2 text-black hover:bg-gray-100">
                  My Account
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/Login');
                  }}
                  className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
