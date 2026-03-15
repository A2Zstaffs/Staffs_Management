'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Clock, Bell } from 'lucide-react';

export default function RecruiterManagerTopbar({ onMenuClick }) {
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
        return 'R';
    };

    return (
        <header className="bg-white border-b border-secondary-200 sticky top-0 z-30 shadow-sm">
            <div className="px-4 md:px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* Mobile Menu Button - Visible on all screens */}
                    <button
                        onClick={onMenuClick}
                        className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-all duration-200"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-md ml-4 md:ml-0">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base"
                            />
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-2 md:space-x-4">
                        {/* History Icon - Hidden on mobile */}
                        <button className="hidden md:block p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-all duration-200">
                            <Clock className="w-5 h-5" />
                        </button>

                        {/* Notification Bell */}
                        <button className="relative p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-all duration-200">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* User Profile */}
                        <button className="flex items-center space-x-2 p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-all duration-200">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-md">
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
