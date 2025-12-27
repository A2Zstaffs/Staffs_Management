'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();

  // Define routes where Navbar and Footer should not appear
  const excludedRoutes = [
    '/admin',
    '/recruiter',
    '/client',
    '/candidate',
    '/consultancy',
    '/kam',  // Exclude KAM routes
    '/login',
    '/signup'
  ];

  // Check if current path matches any excluded route
  const shouldHideLayout = excludedRoutes.some(route => pathname?.startsWith(route));

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




