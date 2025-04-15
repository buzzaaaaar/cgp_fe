import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function MyProfile() {
  const [activeTab, setActiveTab] = useState('summary');

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
          <>
            <h2 className="text-2xl font-bold text-[#013024] mb-4">Summary</h2>
            <p className="text-[#013024] text-base">
              This is your profile summary. It includes your account information, recent activity, and project history.
            </p>
          </>
        );
      case 'changePassword':
        return (
          <>
            <h2 className="text-2xl font-bold text-[#013024] mb-4">Change Password</h2>
            <p className="text-[#013024] text-base">
              You can change your current password here. Make sure it’s strong and secure.
            </p>
          </>
        );
      case 'deleteAccount':
        return (
          <>
            <h2 className="text-2xl font-bold text-[#013024] mb-4">Delete Account</h2>
            <p className="text-[#013024] text-base">
              Warning: Deleting your account is permanent. All saved data will be removed.
            </p>
          </>
        );
      case 'logout':
        return (
          <>
            <h2 className="text-2xl font-bold text-[#013024] mb-4">Logout</h2>
            <p className="text-[#013024] text-base">
              Are you sure you want to log out of Rankmeone AI?
            </p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="font-[Hanken_Grotesk] min-h-screen bg-[#013024] text-white flex flex-col">
      <Navbar />
      <div className="flex flex-grow pt-32">
        {/* Left Sidebar */}
        <div className="w-full md:w-1/3 bg-[#7FAF37] py-10 px-6">
          <h1 className="text-4xl font-semibold text-left mb-4">My Profile</h1>
          <hr className="border-white border-[1px] mb-6" />

          <div className="flex flex-col gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-left px-4 py-2 rounded-md font-semibold ${
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
        <div className="w-full md:w-2/3 bg-white text-left p-8">
          {renderContent()}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MyProfile;
