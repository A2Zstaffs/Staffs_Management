'use client';

import { useState } from 'react';
import RecruiterManagerSidebar from './components/RecruiterManagerSidebar';
import RecruiterManagerTopbar from './components/RecruiterManagerTopbar';

export default function RecruiterManagerLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-blue-50/30 to-purple-50/20">
            <RecruiterManagerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="ml-0 min-h-screen transition-all duration-300">
                <RecruiterManagerTopbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                <main className="px-4 md:px-8 py-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
