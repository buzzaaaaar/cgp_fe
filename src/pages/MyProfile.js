import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function MyProfile() {
  const [activeTab, setActiveTab] = useState('summary');
  const [userData, setUserData] = useState({ email: '', memberSince: '' });
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = {
        email: 'user@example.com',
        memberSince: 'January 1, 2024',
      };
      setUserData(data);
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (activeTab === 'logout') {
      // Simulate logout
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    }
  }, [activeTab]);

  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'changePassword', label: 'Change Password' },
    { id: 'deleteAccount', label: 'Delete Account' },
    { id: 'logout', label: 'Logout' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'summary':
        return (
          <div className="text-[#013024] space-y-10">
            <h2 className="text-4xl font-bold">Summary</h2>
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-base font-semibold">Email address:</p>
                <p className="text-base">{userData.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold">Member since:</p>
                <p className="text-base">{userData.memberSince}</p>
              </div>
            </div>
          </div>
        );
      case 'changePassword':
        return (
          <div className="text-[#013024] space-y-4">
            <h2 className="text-4xl font-bold">Change Password</h2>
            <p className="text-base">
              You can change your current password here. Make sure it’s strong and secure.
            </p>
          </div>
        );
      case 'deleteAccount':
        return (
          <div className="text-[#013024] space-y-4">
            <h2 className="text-4xl font-bold">Delete Account</h2>
            <p className="text-base">
              Warning: Deleting your account is permanent. All saved data will be removed.
            </p>
            <button
              onClick={() => setShowDeletePopup(true)}
              className="mt-6 px-6 py-2 bg-[#7FAF37] text-white font-semibold rounded-md hover:bg-white hover:text-[#7FAF37] border border-[#7FAF37] transition-all"
            >
              Delete My Account
            </button>
          </div>
        );
      case 'logout':
        return null; // handled by useEffect
      default:
        return null;
    }
  };

  return (
    <div className="font-[Hanken_Grotesk] min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-grow pt-16">
        {/* Left Sidebar */}
        <div className="w-full md:w-1/3 bg-[#7FAF37] py-16 px-6 min-h-[92vh]">
          <h1 className="text-4xl text-white font-semibold text-left mb-4">My Profile</h1>
          <hr className="border-white border-[1px] mb-6" />
          <div className="flex flex-col gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-left px-4 py-3 rounded-md font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-[#7FAF37]'
                    : 'text-white hover:opacity-80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="w-full md:w-2/3 bg-white text-left p-12 min-h-[92vh]">
          {renderContent()}
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white border border-[#D4D4D4] shadow-lg rounded-lg p-8 w-full max-w-md relative">
            <button
              onClick={() => setShowDeletePopup(false)}
              className="absolute top-2 right-3 text-[#013024] text-xl font-bold"
            >
              &times;
            </button>
            <p className="text-[#013024] text-lg font-semibold mb-6">
              Are you sure you want to delete your account?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-8 py-2 bg-[#7FAF37] text-white rounded-md font-semibold hover:bg-white hover:text-[#7FAF37] border border-[#7FAF37] transition-all"
                onClick={() => {
                  setShowDeletePopup(false);
                  alert("Account deleted!");
                  // Add actual delete logic here
                }}
              >
                YES
              </button>
              <button
                className="px-8 py-2 bg-[#7FAF37] text-white rounded-md font-semibold hover:bg-white hover:text-[#7FAF37] border border-[#7FAF37] transition-all"
                onClick={() => setShowDeletePopup(false)}
              >
                NO
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default MyProfile;
