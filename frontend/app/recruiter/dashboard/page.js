'use client';

import RecruiterNavbar from '@/components/common/RecruiterNavbar';
import RecruiterHome from '@/components/recruiter/RecruiterHome';

export default function RecruiterDashboard() {
    return (
        <div className="min-h-screen bg-gray-50">
            <RecruiterNavbar />
            <RecruiterHome />
        </div>
    );
}
