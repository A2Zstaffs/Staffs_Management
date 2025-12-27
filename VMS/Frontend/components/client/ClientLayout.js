'use client';

import { useState } from 'react';
import ClientSidebar from './ClientSidebar';
import ClientTopbar from './ClientTopbar';

export default function ClientLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1e293b] to-[#0F172A]">
      <ClientSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="ml-0 min-h-screen transition-all duration-300">
        <ClientTopbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="px-4 md:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}



