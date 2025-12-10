'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isClientRoute = pathname?.startsWith('/client');
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isClientRoute || isAdminRoute) {
    // Client and Admin routes use their own layout without Header/Footer
    return <>{children}</>;
  }

  // Public routes use Header and Footer
  return (
    <>
      <Header />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </>
  );
}




