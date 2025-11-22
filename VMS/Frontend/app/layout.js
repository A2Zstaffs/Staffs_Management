'use client';

import './globals.css'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import { AuthProvider } from '../contexts/AuthContext'
import { DashboardProvider } from '../contexts/DashboardContext'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <AuthProvider>
          <DashboardProvider>
            <Header />
            <main className="flex-1 pt-16">
              {children}
            </main>
            <Footer />
          </DashboardProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
