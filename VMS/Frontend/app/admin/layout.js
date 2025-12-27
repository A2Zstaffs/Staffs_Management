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

  // Auto-close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // If it's the login page, render without sidebar and header
  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleToggleSidebar = useCallback(() => {
    console.log('Toggle sidebar clicked, current state:', isSidebarOpen);
    setIsSidebarOpen(prev => !prev);
  }, [isSidebarOpen]);

  const handleCloseSidebar = useCallback(() => {
    console.log('Closing sidebar');
    setIsSidebarOpen(false);
  }, []);

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
