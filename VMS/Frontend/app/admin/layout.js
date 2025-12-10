'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from './components/AdminSidebar';
import '../globals.css';

import GradientHeader from './components/GradientHeader';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Auth checks (commented out as per previous state)
  // useEffect(() => {
  //   if (!isLoading) {
  //     if (!isAuthenticated) {
  //       router.push('/login');
  //     } else if (user?.role !== 'admin') {
  //       router.push('/dashboard');
  //     }
  //   }
  // }, [user, isAuthenticated, isLoading, router]);

  // Show loading spinner while checking auth
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
  //     </div>
  //   );
  // }

  // Don't render if not authenticated or not admin
  // if (!isAuthenticated || user?.role !== 'admin') {
  //   return null;
  // }

  return (
    <div className="flex h-screen overflow-hidden bg-[radial-gradient(ellipse_at_center,_#E6EDF7_0%,_#DDE7F5_100%)]">
      {/* Sidebar - Fixed width, full height */}
      <AdminSidebar />

      {/* Main Content Area - Flexible width, full height, flex column */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header - Fixed at top */}
        <GradientHeader />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
