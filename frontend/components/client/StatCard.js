'use client';

export default function StatCard({ title, value, icon, isLoading = false }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-[#1A73FF]/30 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 mb-2 leading-tight">{title}</p>
          {isLoading ? (
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          )}
        </div>
        <div className="ml-3 flex-shrink-0 text-[#1A73FF]">
          {icon}
        </div>
      </div>
    </div>
  );
}


