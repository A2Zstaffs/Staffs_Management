'use client';

import GradientHeader from './components/GradientHeader';
import StatCard from './components/StatCard';
import AdminCharts from './components/AdminCharts';
import AdminFlow from './components/AdminFlow';
import { 
  adminStats, 
  recruiterClientPerformance, 
  commissionDistribution, 
  adminFlowSteps 
} from './data/adminData';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <GradientHeader />

      {/* Main Content */}
      <main className="p-4 lg:p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Recruiters"
            value={adminStats.totalRecruiters}
            icon="Users"
            color="from-blue-500 to-blue-600"
            delay={0}
          />
          <StatCard 
            title="Total Clients"
            value={adminStats.totalClients}
            icon="Building2"
            color="from-cyan-500 to-cyan-600"
            delay={0.1}
          />
          <StatCard 
            title="Active Jobs"
            value={adminStats.activeJobs}
            icon="Briefcase"
            color="from-indigo-500 to-indigo-600"
            delay={0.2}
          />
          <StatCard 
            title="Monthly Revenue"
            value={adminStats.monthlyRevenue}
            icon="DollarSign"
            color="from-green-500 to-green-600"
            delay={0.3}
          />
        </div>

        {/* Charts Section */}
        <div>
          <AdminCharts 
            barData={recruiterClientPerformance}
            pieData={commissionDistribution}
          />
        </div>

        {/* Admin Flow Section */}
        <div>
          <AdminFlow steps={adminFlowSteps} />
        </div>
      </main>
    </div>
  );
}








