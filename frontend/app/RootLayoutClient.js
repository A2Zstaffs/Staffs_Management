'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '../contexts/AuthContext';
import { DashboardProvider } from '../contexts/DashboardContext';
import ConditionalLayout from '../components/common/ConditionalLayout';

export default function RootLayoutClient({ children }) {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <AuthProvider>
                <DashboardProvider>
                    <ConditionalLayout>
                        {children}
                    </ConditionalLayout>
                </DashboardProvider>
            </AuthProvider>
        </GoogleOAuthProvider>
    );
}
