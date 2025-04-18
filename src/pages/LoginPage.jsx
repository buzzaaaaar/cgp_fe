import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/rankmeone.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(false);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validPassword = '12345'; // Example correct password
    const isEmailValid = emailPattern.test(email);
    const isPasswordValid = /^\d{5}$/.test(password) && password === validPassword;

    if (!isEmailValid && !isPasswordValid) {
      setEmail('');
      setPassword('');
      setEmailError(true);
      setPasswordError(true);
      return;
    }

    if (!isEmailValid) {
      setEmail('');
      setPassword('');
      setEmailError(true);
      setPasswordError(false);
      return;
    }

    if (!isPasswordValid) {
      setEmail('');
      setPassword('');
      setPasswordError(true);
      setEmailError(false);
      return;
    }

    // Proceed with login logic if both are valid
  };

  return (
    <div className="flex h-screen font-hanken">
      {/* Left Side (White part) */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white relative">
        <div className="max-w-md w-full px-12 py-10">
          {/* Logo positioned above the heading with space */}
          <div className="mb-16">
            <img
              src={logo}
              alt="RankMeOne Logo"
              style={{ width: '200px', height: '40px' }}
            />
          </div>

          <h2 className="text-left text-2xl font-bold text-gray-900">Log In</h2>
          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium" style={{ color: '#000000' }}>
                Email address*
              </label>
              <input
                id="email"
                name="email"
                type="text"
                value={email}
                onChange={handleEmailChange}
                placeholder={emailError ? 'Please enter a valid email address.' : ''}
                className="appearance-none rounded-[8px] relative block w-full px-3 py-2 border text-gray-900 focus:outline-none focus:ring-green-600 focus:border-green-600 focus:z-10 sm:text-sm mt-1"
                style={{
                  borderColor: '#000000',
                  color: '#000000',
                  '::placeholder': {
                    color: '#898888',
                  },
                }}
              />
            </div>
            <div className="space-y-2">
              <div>
                <label htmlFor="password" className="block text-sm font-medium" style={{ color: '#000000' }}>
                  Password*
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder={passwordError ? 'Please enter a valid password.' : ''}
                  className="appearance-none rounded-[8px] relative block w-full px-3 py-2 border text-gray-900 focus:outline-none focus:ring-green-600 focus:border-green-600 focus:z-10 sm:text-sm mt-1"
                  style={{
                    borderColor: '#000000',
                    color: '#000000',
                    '::placeholder': {
                      color: '#898888',
                    },
                  }}
                />
              </div>
              <div className="text-right -mt-1">
                <Link
                  to="/forgot-password"
                  className="text-xs hover:underline"
                  style={{ color: '#1C3D86' }}
                >
                  Forgot your password?
                </Link>
              </div>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded text-white focus:outline-none uppercase"
                style={{
                  backgroundColor: '#013024',
                  borderRadius: '10px',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.border = '1px solid #013024';
                  e.currentTarget.style.color = '#013024';
                  e.currentTarget.style.backgroundColor = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.border = '1px solid transparent';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.backgroundColor = '#013024';
                }}
              >
                Log In
              </button>
            </div>
            <p className="mt-6 text-center text-sm" style={{ color: '#000000' }}>
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-medium hover:underline"
                style={{ color: '#1C3D86' }}
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side (Green part) - Using a custom SVG for the curve */}
      <div className="hidden md:block md:w-1/2 bg-white relative">
        <div className="absolute inset-0">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
            <path d="M0,0 L100,0 L100,100 L0,100 C30,50 0,0 0,0 Z" fill="#013024" />
          </svg>
        </div>
      </div>
    </div>
  );
}
