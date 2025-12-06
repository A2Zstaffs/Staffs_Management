'use client';

import ClientSidebar from './ClientSidebar';
import ClientTopbar from './ClientTopbar';

export default function ClientLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1e293b] to-[#0F172A]">
      <ClientSidebar />
      <div className="ml-64 min-h-screen">
        <ClientTopbar />
        <main className="px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}



