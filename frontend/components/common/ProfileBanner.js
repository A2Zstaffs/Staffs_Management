'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings } from 'lucide-react';

export default function ProfileBanner() {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const checkProfileStatus = async () => {
            try {
                // Check sessionStorage first (default), then localStorage (rememberMe)
                const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
                if (!token) {
                    console.log('ProfileBanner: No auth token found');
                    return;
                }

                // Fetch user data from API
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data) {
                        const userData = result.data;
                        setUserRole(userData.role);

                        console.log('ProfileBanner check:', {
                            user: userData.fullName,
                            role: userData.role,
                            profileCompleted: userData.profileCompleted,
                            shouldShow: !userData.profileCompleted
                        });

                        // Show banner if profile is NOT completed
                        if (!userData.profileCompleted) {
                            setIsVisible(true);
                        }
                    }
                } else {
                    console.log('ProfileBanner: Failed to fetch user data');
                }
            } catch (error) {
                console.error('ProfileBanner error:', error);
            }
        };

        checkProfileStatus();
    }, []); // Run once on mount

    const handleGoToSettings = () => {
        const settingsPath = userRole === 'client' ? '/client/settings' : '/recruiter/settings';
        router.push(settingsPath);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 mb-6 rounded-lg shadow-sm">
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                    <Settings className="w-5 h-5 text-blue-600 mt-0.5" />
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-semibold text-blue-900 mb-1">
                        Complete Your Profile
                    </h3>
                    <p className="text-sm text-blue-700">
                        Please complete your profile details in Settings to unlock all features and improve your experience.
                    </p>
                    <button
                        onClick={handleGoToSettings}
                        className="mt-3 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                        <Settings className="w-4 h-4 mr-2" />
                        Go to Settings
                    </button>
                </div>
            </div>
        </div>
    );
}
