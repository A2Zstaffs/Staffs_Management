'use client';

import { Users, Building2, Briefcase, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
  Users: Users,
  Building2: Building2,
  Briefcase: Briefcase,
  DollarSign: DollarSign
};

export default function StatCard({ title, value, icon, color, delay = 0, isLoading = false }) {
  const Icon = iconMap[icon] || Users;

  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val >= 1000) {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0
        }).format(val);
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.03, y: -5 }}
      className="group relative overflow-hidden rounded-xl bg-white/50 backdrop-blur-md 
               border border-white/60 p-4 shadow-xl shadow-blue-900/5
               hover:border-blue-400/50 transition-all duration-300"
    >
      {/* Gradient glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon & Title */}
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2.5 rounded-lg bg-gradient-to-br ${color} shadow-lg`}>
            <Icon className="text-white" size={20} />
          </div>
          <div className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse" />
        </div>

        {/* Value */}
        <div className="mb-1">
          {isLoading ? (
            <div className="h-8 w-24 bg-gray-200/50 rounded animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-secondary-900 tracking-tight">
              {formatValue(value)}
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <p className="text-secondary-600 text-xs font-medium uppercase tracking-wide">
            {title}
          </p>
        </div>

        {/* Decorative accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r 
                      from-transparent via-blue-400 to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
}









