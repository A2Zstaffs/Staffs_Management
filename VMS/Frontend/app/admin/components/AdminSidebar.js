'use client';

import { useState, useEffect } from 'react';
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
  { icon: UserCheck, label: 'KAM Management', href: '/admin/kam' },
  { icon: Users, label: 'Recruiter Manager', href: '/admin/recruiter-manager' },
  { icon: Briefcase, label: 'Jobs', href: '/admin/jobs' },
  { icon: GitPullRequest, label: 'CV Pipeline', href: '/admin/pipeline' },
  { icon: Wallet, label: 'Payouts', href: '/admin/payouts' },
  { icon: BarChart3, label: 'Reports', href: '/admin/reports' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' }
];

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  // Close sidebar when route changes - REMOVE this redundant effect
  // useEffect(() => {
  //   onClose();
  // }, [pathname, onClose]);

  return (
    <>
      {/* Overlay for when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[100] w-64
        bg-gradient-to-b from-blue-600 via-indigo-600 to-indigo-700
        shadow-2xl transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex flex-col justify-center px-6 border-b border-white/20 bg-white/5">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              A2Z <span className="text-blue-200">Admin</span>
            </h1>
            <p className="text-blue-200 text-xs mt-0.5 font-medium">Management Portal</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200 group
                    ${isActive
                      ? 'bg-white text-blue-600 shadow-lg font-semibold'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <Icon
                    size={20}
                    className={`
                      transition-transform duration-200
                      ${isActive ? 'scale-110' : 'group-hover:scale-110'}
                    `}
                  />
                  <span className="font-medium text-sm">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/20 bg-white/5">
            <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-white/10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
                <span className="text-white font-bold">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">Admin User</p>
                <p className="text-blue-200 text-xs truncate">admin@a2z.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );






}
