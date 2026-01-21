'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();

  // Pages that should not have header/footer (authentication pages)
  const authPages = [
    '/login',
    '/signup',
    '/forgot-password',
    '/verify-otp',
    '/reset-password'
  ];

  // Define routes where Navbar and Footer should not appear
  // These are typically dashboard-like routes that have their own navigation
  const dashboardRoutes = [
    '/admin',
    '/recruiter',
    '/client',
    '/candidate',
    '/consultancy',
    '/kam',
    '/recruiter-manager' // Added based on the new logic in the instruction
  ];

  // Determine if the layout (Header/Footer) should be shown
  // It should NOT be shown if the path starts with any auth page or any dashboard route.
  const shouldHideLayout = authPages.some(page => pathname?.startsWith(page)) ||
    dashboardRoutes.some(route => pathname?.startsWith(route));

  if (shouldHideLayout) {
    // These routes use their own layout without Navbar/Footer
    return <>{children}</>;
  }

  // Public routes use Header and Footer
  return (
    <>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}




