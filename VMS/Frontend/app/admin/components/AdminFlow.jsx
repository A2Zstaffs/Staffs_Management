'use client';

import { Users, PhoneCall, DollarSign, BarChart3, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
  Users,
  PhoneCall,
  DollarSign,
  BarChart3
};

export default function AdminFlow({ steps }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="mb-6">
        <h3 className="text-white font-bold text-2xl flex items-center gap-3">
          <span className="w-1 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full" />
          Admin / Coordinator Flow
        </h3>
        <p className="text-blue-200 text-sm mt-2 ml-4">
          Manage the entire A2Z Staffs platform ecosystem
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step, index) => {
          const Icon = iconMap[step.icon] || Users;
          
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative"
            >
              {/* Card */}
              <div className={`
                h-full rounded-xl bg-white/5 backdrop-blur-md 
                border ${step.borderColor}
                p-6 shadow-lg shadow-blue-900/20
                hover:bg-white/10 transition-all duration-300
                overflow-hidden
              `}>
                {/* Gradient overlay on hover */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br ${step.color} 
                  opacity-0 group-hover:opacity-10 transition-opacity duration-300
                `} />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`
                    w-16 h-16 rounded-xl bg-gradient-to-br ${step.color}
                    flex items-center justify-center mb-4 shadow-lg
                    group-hover:scale-110 transition-transform duration-300
                  `}>
                    <Icon className="text-white" size={28} />
                  </div>

                  {/* Title */}
                  <h4 className="text-white font-bold text-lg mb-2">
                    {step.title}
                  </h4>

                  {/* Description */}
                  <p className="text-blue-200 text-sm leading-relaxed">
                    {step.description}
                  </p>

                  {/* Decorative arrow on hover */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 
                                transition-all duration-300 transform group-hover:translate-x-2">
                    <ArrowRight className="text-blue-400" size={24} />
                  </div>
                </div>

                {/* Border glow on hover */}
                <div className={`
                  absolute inset-0 rounded-xl 
                  border-2 ${step.borderColor}
                  opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300
                  pointer-events-none
                `} />
              </div>

              {/* Connecting line between cards (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-2 w-4 z-0">
                  <ArrowRight className="text-blue-400/50" size={20} />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}








