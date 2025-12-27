'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '@/lib/api';
import Logo from './Logo';

export default function TopNavbar() {
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
        // Also save to localStorage for consistency
        if (typeof window !== 'undefined') {
          localStorage.setItem('userName', user.fullName);
        }
        return;
      }

      // Then try localStorage (useful when auth context is still loading)
      if (typeof window !== 'undefined') {
        const storedName = localStorage.getItem('userName');
        if (storedName) {
          setUserName(storedName);
          return;
        }

        // Also check userData in localStorage (set by api.js)
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

      // Fallback to email or default
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

  // Show navbar if authenticated OR if there's a token in localStorage
  // This ensures navbar shows even during auth context loading
  const hasToken = typeof window !== 'undefined' && localStorage.getItem('authToken');
  if (!isAuthenticated && !hasToken) {
    return null; // Don't show navbar if not authenticated
  }

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo on the left */}
          <Logo href="/" />

          {/* Navigation links in center */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-gray-900 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-900 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              About
            </Link>
            {/* Dynamic Dashboard Link */}
            {isAuthenticated && (
              <Link
                href={
                  user?.role === 'admin' ? '/admin' :
                    user?.role === 'recruiter' ? '/recruiter/dashboard' :
                      user?.role === 'client' ? '/client/dashboard' :
                        user?.role === 'consultancy' ? '/dashboard' :
                          '/candidate/home' // Default for candidate
                }
                className="text-primary-500 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Dashboard
              </Link>
            )}
            <Link
              href="/contact"
              className="text-gray-900 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Contact
            </Link>
          </nav>

          {/* User profile on the right */}
          <div className="flex items-center space-x-4">
            {/* Notifications Icon (optional) */}
            <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Avatar Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {getUserInitial()}
                  </span>
                </div>
                <span>{userName || 'My Profile'}</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{userName || 'My Profile'}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role || 'candidate'}</p>
                  </div>
                  <Link
                    href={
                      user?.role === 'admin' ? '/admin' :
                        user?.role === 'recruiter' ? '/recruiter/dashboard' :
                          user?.role === 'client' ? '/client/dashboard' :
                            user?.role === 'consultancy' ? '/dashboard' :
                              '/candidate/home'
                    }
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

