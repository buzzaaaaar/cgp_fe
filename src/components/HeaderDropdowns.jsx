import React, { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';

const HeaderDropdowns = () => {
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
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
            <a href="#" className="block px-4 py-2 hover:bg-gray-100">My Account</a>
            <a href="#" className="block px-4 py-2 hover:bg-gray-100">Log Out</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderDropdowns;
