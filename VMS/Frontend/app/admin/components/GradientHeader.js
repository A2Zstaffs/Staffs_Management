'use client';

import { Search, Bell, User } from 'lucide-react';

export default function GradientHeader() {
  return (
    <header className="bg-secondary-900 backdrop-blur-md border-b border-white/20 shadow-lg shadow-primary-900/10 flex-shrink-0 z-30">
      <div className="flex items-center justify-between px-6 py-2">
        {/* Left: Welcome & Search */}
        <div className="flex-1 max-w-2xl">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-white text-base font-bold flex items-center gap-2">
                Welcome, Admin <span className="text-lg">👋</span>
              </h2>
            </div>
          </div>
        </div>

        {/* Right: Search & Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400"
              size={14}
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-48 pl-8 pr-3 py-1 rounded-lg bg-white/10 backdrop-blur-md 
                       border border-white/20 text-white text-xs placeholder-secondary-400
                       focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent
                       transition-all duration-200"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-1.5 rounded-lg bg-white/10 hover:bg-white/20 
                           backdrop-blur-md border border-white/20 text-white
                           transition-all duration-200 hover:scale-105">
            <Bell size={16} />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full 
                           bg-red-500 text-white text-[9px] flex items-center justify-center
                           animate-pulse">
              3
            </span>
          </button>

          {/* Profile */}
          <button className="flex items-center gap-2 px-2 py-1 rounded-lg 
                           bg-white/10 hover:bg-white/20 backdrop-blur-md 
                           border border-white/20 text-white
                           transition-all duration-200">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 
                          flex items-center justify-center">
              <User size={14} />
            </div>
            <span className="hidden lg:block font-medium text-xs">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );





}
