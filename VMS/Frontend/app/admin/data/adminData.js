// Admin Dashboard Mock Data
export const adminStats = {
  totalRecruiters: 156,
  totalClients: 89,
  activeJobs: 342,
  monthlyRevenue: 125000
};

export const recruiterClientPerformance = [
  { name: 'Jan', recruiters: 45, clients: 23 },
  { name: 'Feb', recruiters: 52, clients: 28 },
  { name: 'Mar', recruiters: 48, clients: 31 },
  { name: 'Apr', recruiters: 65, clients: 35 },
  { name: 'May', recruiters: 78, clients: 42 },
  { name: 'Jun', recruiters: 82, clients: 48 }
];

export const commissionDistribution = [
  { name: 'Recruiters', value: 80, color: '#3b82f6' },
  { name: 'A2Z Staffs', value: 20, color: '#0ea5e9' }
];

export const adminFlowSteps = [
  {
    id: 1,
    title: 'Oversees Entire Platform',
    description: 'Manages recruiters, clients, and job postings across the system',
    icon: 'Users',
    color: 'from-blue-500 to-blue-600',
    borderColor: 'border-blue-400/50'
  },
  {
    id: 2,
    title: 'Handles Onboarding Calls',
    description: 'Conducts platform overview and commission structure training',
    icon: 'PhoneCall',
    color: 'from-orange-500 to-orange-600',
    borderColor: 'border-orange-400/50'
  },
  {
    id: 3,
    title: 'Manages Commission System',
    description: 'Tracks and processes 80/20 commission split',
    icon: 'DollarSign',
    color: 'from-green-500 to-green-600',
    borderColor: 'border-green-400/50'
  },
  {
    id: 4,
    title: 'Generates Reports',
    description: 'Creates analytics and performance reports for stakeholders',
    icon: 'BarChart3',
    color: 'from-purple-500 to-purple-600',
    borderColor: 'border-purple-400/50'
  }
];









