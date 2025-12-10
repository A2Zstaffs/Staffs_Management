'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  GitPullRequest,
  Wallet,
  BarChart3,
  Settings,
  Menu,
  X,
  UserCheck
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Users, label: 'Recruiters', href: '/admin/recruiters' },
  { icon: UserCheck, label: 'Candidates', href: '/admin/candidates' },
  { icon: Building2, label: 'Clients', href: '/admin/clients' },
  { icon: Briefcase, label: 'Jobs', href: '/admin/jobs' },
  { icon: GitPullRequest, label: 'CV Pipeline', href: '/admin/pipeline' },
  { icon: Wallet, label: 'Payouts', href: '/admin/payouts' },
  { icon: BarChart3, label: 'Reports', href: '/admin/reports' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' }
];

export default function AdminSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-900/80 backdrop-blur-md text-white"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-56 bg-secondary-900 flex-shrink-0
        shadow-2xl shadow-blue-900/50
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-[60px] flex flex-col justify-center px-4 border-b border-white/20">
            <h1 className="text-xl font-bold text-white tracking-wide">
              A2Z <span className="text-secondary-300">Admin</span>
            </h1>
            <p className="text-secondary-400 text-xs mt-0.5">Management Portal</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-200 group
                    ${isActive
                      ? 'bg-white/20 text-white shadow-lg shadow-blue-500/30'
                      : 'text-secondary-400 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <Icon
                    size={18}
                    className={`
                      transition-transform duration-200
                      ${isActive ? 'scale-110' : 'group-hover:scale-110'}
                    `}
                  />
                  <span className="font-medium tracking-wide uppercase text-xs">
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-white/20">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-xs truncate">Admin User</p>
                <p className="text-secondary-400 text-[10px] truncate">admin@a2z.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}









