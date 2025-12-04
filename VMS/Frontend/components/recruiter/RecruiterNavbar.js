'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '../common/Logo';

export default function RecruiterNavbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [userName, setUserName] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const resolveName = () => {
      if (user?.fullName) {
        setUserName(user.fullName);
        if (typeof window !== 'undefined') localStorage.setItem('userName', user.fullName);
        return;
      }
      if (typeof window !== 'undefined') {
        const lsName = localStorage.getItem('userName');
        if (lsName) {
          setUserName(lsName);
          return;
        }
        const userDataStr = localStorage.getItem('userData');
        if (userDataStr) {
          try {
            const ud = JSON.parse(userDataStr);
            if (ud.fullName) {
              setUserName(ud.fullName);
              localStorage.setItem('userName', ud.fullName);
              return;
            }
          } catch {}
        }
      }
      if (user?.email) {
        setUserName(user.email);
      } else {
        setUserName('Recruiter');
      }
    };
    resolveName();
  }, [user, isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitial = () => {
    if (user?.fullName) return user.fullName.charAt(0).toUpperCase();
    if (userName && userName !== 'Recruiter') return userName.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'R';
  };

  const handleLogout = async () => {
    await logout();
    setShowProfileDropdown(false);
    router.push('/login');
  };

  const hasToken = typeof window !== 'undefined' && localStorage.getItem('authToken');
  if (!isAuthenticated && !hasToken) return null;

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <Logo href="/recruiter/home" />

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/recruiter/home" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link href="/recruiter/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
            <Link href="/recruiter/jobs" className="text-gray-700 hover:text-blue-600">Jobs</Link>
            <Link href="/recruiter/applications" className="text-gray-700 hover:text-blue-600">Applications</Link>
            <Link href="/recruiter/candidates" className="text-gray-700 hover:text-blue-600">Candidates</Link>
          </nav>

          <div className="flex items-center">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-2 py-2 rounded-lg"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{getInitial()}</span>
                </div>
                <span className="hidden sm:inline">{userName}</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link href="/recruiter/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowProfileDropdown(false)}>My Profile</Link>
                  <Link href="/recruiter/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowProfileDropdown(false)}>Dashboard</Link>
                  <Link href="/recruiter/applications" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowProfileDropdown(false)}>Applications</Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}


<<<<<<< HEAD




<<<<<<< Updated upstream
=======


>>>>>>> Stashed changes
=======
>>>>>>> edb5f0059bdc71fbc87831b17e2d8335f0536193
