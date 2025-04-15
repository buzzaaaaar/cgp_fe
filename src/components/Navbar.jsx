// components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Navbar() {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef();
  const profileRef = useRef();

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow px-6 py-1">
      <div className="flex items-center justify-between h-[60px]">
        <div className="flex items-center space-x-10">
          <Link to="/">
            <img
              src="/Images/RankmeoneNavbarLogo.png"
              alt="RankMeOne Logo"
              className="h-16 w-auto"
            />
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 font-medium hover:text-green-700">
              SEO Tools
            </Link>
            <Link to="/projects" className="text-gray-700 font-medium hover:text-green-700">
              Projects
            </Link>
            <Link to="/calendar" className="text-gray-700 font-medium hover:text-green-700">
              Calendar
            </Link>
            <Link to="/AboutUs" className="text-gray-700 font-medium hover:text-green-700">
              About Us
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setShowNotif(!showNotif);
                setShowProfile(false);
              }}
              className="text-gray-700 hover:text-green-700"
            >
              <FaBell className="w-6 h-6" />
            </button>
            {showNotif && (
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-10">
                <div className="text-green-600 font-semibold px-4 py-2 border-b">
                  Notifications
                </div>
                <div className="text-center text-sm text-gray-400 px-4 py-6">
                  This is where your notifications will appear.
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotif(false);
              }}
              className="bg-green-950 text-white w-9 h-9 rounded-full font-semibold flex items-center justify-center"
            >
              R
            </button>
            {showProfile && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                <Link to="/account" className="block px-4 py-2 hover:bg-gray-100 text-black">
                  My Account
                </Link>
                <Link to="/logout" className="block px-4 py-2 hover:bg-gray-100 text-black">
                  Log Out
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
