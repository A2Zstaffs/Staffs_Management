'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

export default function CandidateNavbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userName, setUserName] = useState('');
  const dropdownRef = useRef(null);

  // Get user name from multiple sources (localStorage, auth context)
  useEffect(() => {
    const getName = () => {
      // First try auth context
      if (user?.fullName) {
        setUserName(user.fullName);
        if (typeof window !== 'undefined') {
          localStorage.setItem('userName', user.fullName);
        }
        return;
      }
      
      // Then try localStorage
      if (typeof window !== 'undefined') {
        const storedName = localStorage.getItem('userName');
        if (storedName) {
          setUserName(storedName);
          return;
        }
        
        // Also check userData in localStorage
        const userDataStr = localStorage.getItem('userData');
        if (userDataStr) {
          try {
            const userData = JSON.parse(userDataStr);
            if (userData.fullName) {
              setUserName(userData.fullName);
              localStorage.setItem('userName', userData.fullName);
              return;
            }
          } catch (e) {
            console.error('Error parsing userData:', e);
          }
        }
      }
      
      // Fallback
      if (user?.email) {
        setUserName(user.email);
      } else {
        setUserName('My Profile');
      }
    };

    getName();
  }, [user, isAuthenticated]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowProfileDropdown(false);
    router.push('/login');
  };

  // Get user initial for avatar
  const getUserInitial = () => {
    if (user?.fullName) {
      return user.fullName.charAt(0).toUpperCase();
    }
    if (userName && userName !== 'My Profile') {
      return userName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Check if user is authenticated or has token
  const hasToken = typeof window !== 'undefined' && localStorage.getItem('authToken');
  if (!isAuthenticated && !hasToken) {
    return null;
  }

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo on the left */}
          <Link href="/candidate/home" className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold">
                <span className="text-blue-500">VMS</span>
                <span className="text-gray-700">Recruit</span>
              </h1>
            </div>
          </Link>

          {/* Center: EMPTY - No CTA buttons in header */}
          <div className="flex-1"></div>

          {/* Right: Candidate Name + Avatar */}
          <div className="flex items-center">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {getUserInitial()}
                  </span>
                </div>
                <span className="hidden md:inline">{userName || 'My Profile'}</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{userName || 'My Profile'}</p>
                    <p className="text-xs text-gray-500 capitalize">candidate</p>
                  </div>
                  <Link
                    href="/candidate/home"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/candidate/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    View Profile
                  </Link>
                  <Link
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    Settings
                  </Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

