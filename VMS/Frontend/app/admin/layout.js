'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from './components/AdminSidebar';
import '../globals.css';
import GradientHeader from './components/GradientHeader';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check if current page is login page
  const isLoginPage = pathname === '/admin/login';

  // Auto-close sidebar on route change & Check Auth
  useEffect(() => {
    setIsSidebarOpen(false);

    // Protected route check
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [pathname, isLoading, isAuthenticated, isLoginPage, router]);

  // Callbacks must be defined before any conditional returns
  const handleToggleSidebar = useCallback(() => {
    console.log('Toggle sidebar clicked, current state:', isSidebarOpen);
    setIsSidebarOpen(prev => !prev);
  }, [isSidebarOpen]);

  const handleCloseSidebar = useCallback(() => {
    console.log('Closing sidebar');
    setIsSidebarOpen(false);
  }, []);

  // Show loading spinner while checking auth (except on login page)
  if (isLoading && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If it's the login page, render without sidebar and header
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-sky-50">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <GradientHeader onToggleSidebar={handleToggleSidebar} />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
