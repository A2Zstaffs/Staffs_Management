'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    FileText,
    TrendingUp,
    LogOut
} from 'lucide-react';
import Logo from '@/components/common/Logo';

export default function RecruiterManagerSidebar({ isOpen, onClose }) {
    const pathname = usePathname();
    const router = useRouter();
    const { logout, user } = useAuth();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        if (user?.fullName) {
            setUserName(user.fullName);
        } else if (typeof window !== 'undefined') {
            const storedName = localStorage.getItem('userName');
            if (storedName) {
                setUserName(storedName);
            } else if (user?.email) {
                setUserName(user.email);
            } else {
                setUserName('Recruiter Manager');
            }
        }
    }, [user]);

    const handleLogout = async () => {
        if (confirm('Are you sure you want to logout?')) {
            await logout();
            router.push('/login');
        }
    };

    const navItems = [
        {
            href: '/recruiter-manager/dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
        },
        {
            href: '/recruiter-manager/recruiters',
            label: 'Recruiters',
            icon: Users,
        },
        {
            href: '/recruiter-manager/candidates',
            label: 'Candidates',
            icon: FileText,
        },
        {
            href: '/recruiter-manager/jobs',
            label: 'Jobs',
            icon: Briefcase,
        },
        {
            href: '/recruiter-manager/applications',
            label: 'Applications',
            icon: TrendingUp,
        },
    ];

    const isActive = (href) => {
        if (href === '/recruiter-manager/dashboard') {
            return pathname === href;
        }
        return pathname?.startsWith(href);
    };

    return (
        <>
            {/* Mobile Overlay - Visible on all screens when open */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-secondary-200 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="px-6 py-5 border-b border-secondary-200">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <div className="mb-3">
                                    <Logo href="/recruiter-manager/dashboard" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-secondary-900">Recruiter Manager</h3>
                                    <p className="text-xs text-secondary-500 truncate">{userName}</p>
                                </div>
                            </div>
                            {/* Close button for mobile */}
                            <button
                                onClick={onClose}
                                className="md:hidden p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-all duration-200"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const active = isActive(item.href);
                            const IconComponent = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClose}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${active
                                            ? 'bg-primary-500 text-white shadow-md'
                                            : 'text-secondary-700 hover:text-secondary-900 hover:bg-secondary-100'
                                        }`}
                                >
                                    <IconComponent className="mr-3 w-5 h-5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout Section */}
                    <div className="px-4 py-4 border-t border-secondary-200">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
