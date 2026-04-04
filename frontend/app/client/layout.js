'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { DashboardProvider } from '@/contexts/DashboardContext';
import ClientLayout from '@/components/client/ClientLayout';

export default function ClientLayoutWrapper({ children }) {
  return (
    <AuthProvider>
      <DashboardProvider>
        <ClientLayout>
          {children}
        </ClientLayout>
      </DashboardProvider>
    </AuthProvider>
  );
}




