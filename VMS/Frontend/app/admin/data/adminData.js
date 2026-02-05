// Admin Dashboard Data - Static navigation only
// All dynamic data is fetched from APIs

// Quick Actions - Static navigation links
export const quickActions = [
  { id: 1, title: 'Manage Recruiters', description: 'View and manage all recruiters', href: '/admin/recruiters', icon: 'Users', color: 'from-blue-500 to-blue-600' },
  { id: 2, title: 'Manage KAMs', description: 'Key Account Manager operations', href: '/admin/kam', icon: 'UserCheck', color: 'from-orange-500 to-orange-600' },
  { id: 3, title: 'View Jobs', description: 'Browse all job postings', href: '/admin/jobs', icon: 'Briefcase', color: 'from-emerald-500 to-emerald-600' },
  { id: 4, title: 'CV Pipeline', description: 'Track candidate progress', href: '/admin/pipeline', icon: 'GitPullRequest', color: 'from-purple-500 to-purple-600' },
  { id: 5, title: 'Payouts', description: 'Manage commissions', href: '/admin/payouts', icon: 'Wallet', color: 'from-pink-500 to-pink-600' },
  { id: 6, title: 'Reports', description: 'Analytics & insights', href: '/admin/reports', icon: 'BarChart3', color: 'from-cyan-500 to-cyan-600' }
];


// Legacy exports
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

export const candidatesMock = [
  { id: 1, name: 'Alice Walker', role: 'Frontend Developer', status: 'Applied', date: '2024-03-15' },
  { id: 2, name: 'Bob Harris', role: 'Backend Engineer', status: 'Interview', date: '2024-03-12' },
  { id: 3, name: 'Charlie Kim', role: 'Product Manager', status: 'Rejected', date: '2024-03-10' },
  { id: 4, name: 'David Lee', role: 'UX Designer', status: 'Shortlisted', date: '2024-03-14' }
];

export const jobsMock = [
  { id: 101, title: 'Senior React Dev', company: 'Tech Corp', status: 'Active', applicants: 12 },
  { id: 102, title: 'Node.js Architect', company: 'Innovate Inc', status: 'Pending', applicants: 0 },
  { id: 103, title: 'Product Owner', company: 'StartUp Ltd', status: 'Closed', applicants: 45 }
];

export const pipelineMock = {
  internal_review: [
    { id: 201, candidate: 'Evan Wright', job: 'Senior React Dev' },
    { id: 202, candidate: 'Fiona Green', job: 'Node.js Architect' }
  ],
  shortlisted: [
    { id: 203, candidate: 'George Hall', job: 'Product Owner' }
  ],
  shared_with_client: [],
  interview: [
    { id: 204, candidate: 'Hannah Scott', job: 'Senior React Dev' }
  ],
  selected: [],
  rejected: []
};

export const payoutsMock = [
  { id: 301, recruiter: 'John Doe', candidate: 'Ian Black', amount: 5000, date: '2024-02-28', status: 'Paid' },
  { id: 302, recruiter: 'Mike Johnson', candidate: 'Jane Doe', amount: 3500, date: '2024-03-15', status: 'Pending' }
];

