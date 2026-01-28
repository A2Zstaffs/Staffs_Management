'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, Bell, User } from 'lucide-react';

export default function ClientTopbar({ onMenuClick }) {
  const { user } = useAuth();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (user?.fullName) {
      setUserName(user.fullName);
    } else if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('userName');
      if (storedName) {
        setUserName(storedName);
      } else if (user?.email) {
        setUserName(user.email);
      }
    }
  }, [user]);

  const getInitial = () => {
    if (userName) return userName.charAt(0).toUpperCase();
    if (user?.fullName) return user.fullName.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'C';
  };

  return (
    <header className="bg-gradient-to-r from-[#0F172A] to-[#1e293b] border-b border-gray-700/50 sticky top-0 z-30">
      <div className="px-4 md:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button - Now visible on all screens */}
          <button
            onClick={onMenuClick}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>



          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* History Icon - Hidden on mobile */}
            <button className="hidden md:block p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200">
              <Clock className="w-5 h-5" />
            </button>

            {/* Notification Bell */}
            <button className="relative p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile */}
            <button className="flex items-center space-x-2 p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200">
              <div className="w-8 h-8 bg-gradient-to-br from-[#1A73FF] to-[#0047CC] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-semibold text-sm">
                  {getInitial()}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}


