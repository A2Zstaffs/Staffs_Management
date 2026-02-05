'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, User, LogOut, CheckCircle, AlertCircle, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { notificationAPI } from '@/lib/api';

export default function GradientHeader({ onToggleSidebar }) {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await notificationAPI.getNotifications();
        if (response.success && response.data) {
          // Filter to show only unread notifications
          const unreadNotifications = response.data.filter(n => !n.isRead);
          setNotifications(unreadNotifications);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      // Remove from local state to hide it
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      // Clear all notifications from local state
      setNotifications([]);
      setShowNotifications(false);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <header className="bg-secondary-900 backdrop-blur-md border-b border-white/20 shadow-lg shadow-primary-900/10 flex-shrink-0 z-50 relative">
      <div className="flex items-center justify-between px-6 py-2">
        {/* Left: Welcome and Toggle Sidebar */}
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Hamburger button clicked!');
              onToggleSidebar && onToggleSidebar();
            }}
            className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 
                       text-white cursor-pointer z-50 relative
                       transition-all duration-200 hover:scale-105
                       shadow-lg"
            title="Toggle Sidebar"
            type="button"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-white text-base font-bold flex items-center gap-2">
                  Welcome, {user?.fullName || 'Admin'} <span className="text-lg">👋</span>
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1.5 rounded-lg bg-white/10 hover:bg-white/20 
                             backdrop-blur-md border border-white/20 text-white
                             transition-all duration-200 hover:scale-105"
            >
              <Bell size={16} />
              {notifications.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full 
                               bg-red-500 text-white text-[9px] flex items-center justify-center
                               animate-pulse">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 origin-top-right animate-in fade-in zoom-in-95 duration-200">
                <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-700 text-sm">Notifications</h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-blue-600 cursor-pointer hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {loading ? (
                    <div className="p-4 text-center text-gray-500 text-sm">Loading...</div>
                  ) : notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">No new notifications</div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif._id}
                        onClick={() => handleMarkAsRead(notif._id)}
                        className="p-3 border-b border-gray-50 hover:bg-blue-50/50 transition-colors flex gap-3 items-start cursor-pointer"
                      >
                        <div className={`mt-0.5 p-1 rounded-full flex-shrink-0 ${notif.type === 'success' ? 'bg-green-100 text-green-600' :
                            notif.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                              'bg-blue-100 text-blue-600'
                          }`}>
                          {notif.type === 'success' ? <CheckCircle size={12} /> :
                            notif.type === 'warning' ? <AlertCircle size={12} /> :
                              <Bell size={12} />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800 leading-tight">{notif.title || notif.message}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{formatTimeAgo(notif.createdAt)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-2 text-center bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={() => router.push('/admin/notifications')}
                    className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                  >
                    View all activity
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile & Logout */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 px-2 py-1 rounded-lg 
                             bg-white/10 hover:bg-white/20 backdrop-blur-md 
                             border border-white/20 text-white
                             transition-all duration-200"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 
                            flex items-center justify-center border border-white/30">
                <User size={14} />
              </div>
              <span className="hidden lg:block font-medium text-xs">{user?.fullName || 'Admin'}</span>
              <svg className={`w-3 h-3 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 origin-top-right animate-in fade-in zoom-in-95 duration-200">
                <div className="p-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">{user?.fullName || 'Administrator'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}





