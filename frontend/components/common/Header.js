'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import Logo from './Logo';
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, Building2, Briefcase } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignupDropdownOpen, setIsSignupDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const { user, isAuthenticated, logout } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSignupDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsUserDropdownOpen(false);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white shadow-lg border-b border-secondary-200'
        : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-secondary-100'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Logo href="/" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 text-secondary-700 hover:text-primary-500 hover:bg-primary-50"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              /* User Dropdown */
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${isScrolled ? 'text-secondary-700' : 'text-white'
                    }`}
                >
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="font-medium">{user?.fullName || user?.email}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* User Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-secondary-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-secondary-100">
                      <p className="text-sm font-medium text-secondary-900">{user?.fullName}</p>
                      <p className="text-xs text-secondary-500 capitalize">{user?.role}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 hover:bg-primary-50 hover:text-primary-500 transition-colors"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <div className="border-t border-secondary-200 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium transition-colors duration-200 text-secondary-700 hover:text-primary-500"
                >
                  Login
                </Link>

                {/* Partner Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsSignupDropdownOpen(!isSignupDropdownOpen)}
                    className="flex items-center gap-1 px-5 py-2.5 text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 bg-primary-500 hover:bg-primary-600 text-white"
                  >
                    Get Started
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {isSignupDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-secondary-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-secondary-100">
                        <p className="text-xs text-secondary-500 font-medium">Join our network</p>
                      </div>
                      <Link
                        href="/signup/client"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-secondary-700 hover:bg-primary-50 hover:text-primary-500 transition-colors"
                        onClick={() => setIsSignupDropdownOpen(false)}
                      >
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium">I'm a Client</p>
                          <p className="text-xs text-secondary-400">Hire through A2Z</p>
                        </div>
                      </Link>
                      <Link
                        href="/signup/recruiter"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-secondary-700 hover:bg-primary-50 hover:text-primary-500 transition-colors"
                        onClick={() => setIsSignupDropdownOpen(false)}
                      >
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium">I'm a Recruiter</p>
                          <p className="text-xs text-secondary-400">Join as partner</p>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${isScrolled ? 'text-secondary-600 hover:bg-secondary-100' : 'text-white hover:bg-white/10'
                }`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-secondary-200 py-4 shadow-lg">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 text-secondary-700 hover:bg-primary-50 hover:text-primary-500 rounded-lg font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-secondary-200 pt-4 mt-4">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-3 text-secondary-700 hover:bg-primary-50 hover:text-primary-500 rounded-lg font-medium transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block px-4 py-3 text-secondary-700 hover:bg-primary-50 hover:text-primary-500 rounded-lg font-medium transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <div className="mt-3 space-y-2 px-4">
                      <p className="text-xs text-secondary-500 font-medium">Get Started</p>
                      <Link
                        href="/signup/client"
                        className="block py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium text-center transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        I'm a Client
                      </Link>
                      <Link
                        href="/signup/recruiter"
                        className="block py-3 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 rounded-lg font-medium text-center transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        I'm a Recruiter
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
