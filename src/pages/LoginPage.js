import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/rankmeone.png';
import Navbar from '../components/Navbar';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(false);
    setSubmitError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError(false);
    setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailPattern.test(email);
    const isPasswordValid = password.length >= 6;

    if (!isEmailValid || !isPasswordValid) {
      setEmailError(!isEmailValid);
      setPasswordError(!isPasswordValid);
      return;
    }

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/Home');
      } else {
        setSubmitError(result.error);
      }
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  return (
    <div className="flex h-screen font-hanken">
      <Navbar />
      {/* Left Side (White part) */}
      <div className="relative flex items-center justify-center w-full bg-white md:w-1/2">
        <div className="w-full max-w-md px-12 py-10">
          {/* Logo positioned above the heading with space */}
          <div className="mb-16">
            <img
              src={logo}
              alt="RankMeOne Logo"
              style={{ width: '200px', height: '40px' }}
            />
          </div>

          <h2 className="text-2xl font-bold text-left text-gray-900">Log In</h2>
          {submitError && (
            <div className="mt-2 text-sm text-red-600">
              {submitError}
            </div>
          )}
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
                  placeholder={passwordError ? 'Password must be at least 6 characters' : ''}
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
              <div className="-mt-1 text-right">
                {/* <Link
                  to="/forgot-password"
                  className="text-xs hover:underline"
                  style={{ color: '#1C3D86' }}
                >
                  Forgot your password?
                </Link> */}
              </div>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white uppercase border border-transparent rounded group focus:outline-none"
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
            <p className="mt-6 text-sm text-center" style={{ color: '#000000' }}>
              Don't have an account?{' '}
              <Link
                to="/Register"
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
      <div className="relative hidden bg-white md:block md:w-1/2">
        <div className="absolute inset-0">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,0 L100,0 L100,100 L0,100 C30,50 0,0 0,0 Z" fill="#013024" />
          </svg>
        </div>
      </div>
    </div>
  );
}
