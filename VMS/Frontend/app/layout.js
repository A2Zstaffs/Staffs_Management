'use client';

import './globals.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '../contexts/AuthContext'
import { DashboardProvider } from '../contexts/DashboardContext'
import ConditionalLayout from '../components/common/ConditionalLayout'

export default function RootLayout({ children }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <GoogleOAuthProvider clientId={googleClientId}>
          <AuthProvider>
            <DashboardProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
            </DashboardProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
