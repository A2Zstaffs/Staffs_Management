'use client';

import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
         Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export default function AdminCharts({ barData, pieData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-xl bg-white/5 backdrop-blur-md border border-white/20 
                 p-6 shadow-lg shadow-blue-900/20"
      >
        <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full" />
          Performance Overview
        </h3>
        <p className="text-blue-200 text-sm mb-6">Recruiters vs Clients Growth</p>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              stroke="#93c5fd"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#93c5fd"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(59, 130, 246, 0.5)',
                borderRadius: '8px',
                color: '#fff'
              }}
              cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
            />
            <Legend 
              wrapperStyle={{ color: '#93c5fd', fontSize: '12px' }}
              iconType="circle"
            />
            <Bar 
              dataKey="recruiters" 
              fill="url(#colorRecruiters)" 
              radius={[8, 8, 0, 0]}
              animationDuration={1000}
            />
            <Bar 
              dataKey="clients" 
              fill="url(#colorClients)" 
              radius={[8, 8, 0, 0]}
              animationDuration={1000}
            />
            <defs>
              <linearGradient id="colorRecruiters" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
              <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Pie Chart */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="rounded-xl bg-white/5 backdrop-blur-md border border-white/20 
                 p-6 shadow-lg shadow-blue-900/20"
      >
        <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full" />
          Commission Distribution
        </h3>
        <p className="text-blue-200 text-sm mb-6">Revenue Share Split</p>
        
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              animationDuration={1000}
            >
              {pieData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(59, 130, 246, 0.5)',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Legend 
              wrapperStyle={{ color: '#93c5fd', fontSize: '12px' }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}









