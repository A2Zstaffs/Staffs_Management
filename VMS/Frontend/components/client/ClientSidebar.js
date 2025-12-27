'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { LayoutDashboard, UserPlus, Briefcase, FileText, BarChart3, Settings, List } from 'lucide-react';
import Logo from '@/components/common/Logo';

export default function ClientSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const [clientName, setClientName] = useState('');

  useEffect(() => {
    if (user?.fullName) {
      setClientName(user.fullName);
    } else if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('userName');
      if (storedName) {
        setClientName(storedName);
      } else if (user?.email) {
        setClientName(user.email);
      } else {
        setClientName('Client');
      }
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navItems = [
    {
      href: '/client/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/client/my-jobs',
      label: 'Active Jobs',
      icon: Briefcase,
    },
    {
      href: '/client/received-cvs',
      label: 'Applications',
      icon: FileText,
    },
    {
      href: '/client/reports',
      label: 'Reports',
      icon: BarChart3,
    },
    {
      href: '/client/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  const flowItems = [
    {
      href: '/client/post-job',
      label: 'Post Job',
      icon: List,
    },
  ];

  const isActive = (href) => {
    if (href === '/client/dashboard') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Mobile Overlay - Now visible on all screens when open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-[#0F172A] to-[#1e293b] text-white z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="px-6 py-5 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="mb-3">
                  <Logo href="/client/dashboard" />
                </div>
              </div>
              {/* Close button for mobile */}
              <button
                onClick={onClose}
                className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${active
                    ? 'bg-[#1A73FF] text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    }`}
                >
                  <IconComponent className="mr-3 w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}

            {/* Separator */}
            <div className="my-4 border-t border-gray-700/50"></div>

            {/* Flows Section */}
            <div className="px-4 py-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">FLOWS</h3>
              {flowItems.map((item) => {
                const active = isActive(item.href);
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${active
                      ? 'bg-[#1A73FF] text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                      }`}
                  >
                    <IconComponent className="mr-3 w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Logout Section */}
          <div className="px-4 py-4 border-t border-gray-700/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
