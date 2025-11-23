'use client';

import { Search, Bell, User } from 'lucide-react';

export default function GradientHeader() {
  return (
    <header className="bg-gradient-to-r from-blue-900/80 via-blue-800/80 to-blue-900/80 backdrop-blur-md border-b border-white/20 shadow-lg shadow-blue-900/20">
      <div className="flex items-center justify-between p-4 lg:p-6">
        {/* Left: Welcome & Search */}
        <div className="flex-1 max-w-2xl">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-white text-xl lg:text-2xl font-bold">
                Welcome, Admin <span className="text-2xl lg:text-3xl">👋</span>
              </h2>
              <p className="text-blue-200 text-sm mt-1">
                Here's what's happening on your platform today
              </p>
            </div>
          </div>
        </div>

        {/* Right: Search & Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" 
              size={20} 
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 rounded-lg bg-white/10 backdrop-blur-md 
                       border border-white/20 text-white placeholder-blue-300
                       focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                       transition-all duration-200"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 
                           backdrop-blur-md border border-white/20 text-white
                           transition-all duration-200 hover:scale-110">
            <Bell size={22} />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full 
                           bg-red-500 text-white text-xs flex items-center justify-center
                           animate-pulse">
              3
            </span>
          </button>

          {/* Profile */}
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg 
                           bg-white/10 hover:bg-white/20 backdrop-blur-md 
                           border border-white/20 text-white
                           transition-all duration-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 
                          flex items-center justify-center">
              <User size={18} />
            </div>
            <span className="hidden lg:block font-medium">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
}









