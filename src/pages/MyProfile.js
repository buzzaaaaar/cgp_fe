import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { users } from '../services/api';
import { useNavigate } from 'react-router-dom';

function MyProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('summary');
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    if (activeTab === 'logout') {
      logout();
      window.location.href = '/';
    }
  }, [activeTab, logout]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user types
    if (passwordError) setPasswordError('');
    if (passwordSuccess) setPasswordSuccess('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      setPasswordSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setPasswordError(error.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleteError('');
      await users.deleteAccount();
      logout();
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      setDeleteError('Failed to delete account. Please try again.');
    }
  };

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
                <p className="text-base font-semibold">Username:</p>
                <p className="text-base">{user?.username || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold">Email address:</p>
                <p className="text-base">{user?.email || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold">Member since:</p>
                <p className="text-base">{formatDate(user?.createdAt)}</p>
              </div>
            </div>
          </div>
        );
      case 'changePassword':
        return (
          <div className="text-[#013024] space-y-8">
            <h2 className="text-4xl font-bold">Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="w-[35%]">
                <label className="block mb-1 text-sm font-medium">Current password*</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full border-[2px] border-[#D4D4D4] rounded-md px-4 py-2 focus:outline-none"
                  required
                />
              </div>
              <div className="w-[35%]">
                <label className="block mb-1 text-sm font-medium">New password*</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full border-[2px] border-[#D4D4D4] rounded-md px-4 py-2 focus:outline-none"
                  required
                />
              </div>
              <div className="w-[35%]">
                <label className="block mb-1 text-sm font-medium">Confirm new password*</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full border-[2px] border-[#D4D4D4] rounded-md px-4 py-2 focus:outline-none"
                  required
                />
              </div>
              {passwordError && (
                <div className="text-sm text-red-500">{passwordError}</div>
              )}
              {passwordSuccess && (
                <div className="text-sm text-green-500">{passwordSuccess}</div>
              )}
              <div className="flex justify-start gap-4 pt-4">
                <button
                  type="submit"
                  className="px-8 py-2 bg-[#7FAF37] text-white rounded-md font-semibold hover:bg-white hover:text-[#7FAF37] border border-[#7FAF37] transition-all"
                >
                  SAVE
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('summary');
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                    setPasswordError('');
                    setPasswordSuccess('');
                  }}
                  className="px-8 py-2 bg-[#7FAF37] text-white rounded-md font-semibold hover:bg-white hover:text-[#7FAF37] border border-[#7FAF37] transition-all"
                >
                  CANCEL
                </button>
              </div>
            </form>
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
          <h1 className="mb-4 text-4xl font-semibold text-left text-white">My Profile</h1>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
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
            {deleteError && (
              <p className="text-red-500 mb-4">{deleteError}</p>
            )}
            <div className="flex justify-center gap-4">
              <button
                className="px-8 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-all"
                onClick={handleDeleteAccount}
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
