'use client';

import { Users, Building2, Briefcase, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
  Users: Users,
  Building2: Building2,
  Briefcase: Briefcase,
  DollarSign: DollarSign
};

export default function StatCard({ title, value, icon, color, delay = 0 }) {
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
      className="group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-md 
               border border-white/20 p-6 shadow-lg shadow-blue-900/20
               hover:border-blue-400/50 transition-all duration-300"
    >
      {/* Gradient glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Icon & Title */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg bg-gradient-to-br ${color} shadow-lg`}>
            <Icon className="text-white" size={24} />
          </div>
          <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />
        </div>

        {/* Value */}
        <div className="mb-2">
          <p className="text-3xl font-bold text-white tracking-tight">
            {formatValue(value)}
          </p>
        </div>

        {/* Title */}
        <div>
          <p className="text-blue-200 text-sm font-medium uppercase tracking-wide">
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








