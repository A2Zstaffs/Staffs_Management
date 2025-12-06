'use client';

import './globals.css'
import { AuthProvider } from '../contexts/AuthContext'
import { DashboardProvider } from '../contexts/DashboardContext'
import ConditionalLayout from '../components/common/ConditionalLayout'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <AuthProvider>
          <DashboardProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </DashboardProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
