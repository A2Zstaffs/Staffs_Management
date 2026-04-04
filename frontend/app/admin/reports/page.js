'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BarChart3, FileText, Download, Users, Briefcase,
  Building2, TrendingUp, Calendar, Loader2
} from 'lucide-react';
import { adminAPI } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [exporting, setExporting] = useState(null);

  // Real data state
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [clients, setClients] = useState([]);
  const [pipeline, setPipeline] = useState(null);
  const [performance, setPerformance] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const [
        statsRes, jobsRes, recruitersRes, clientsRes, pipelineRes, performanceRes
      ] = await Promise.allSettled([
        adminAPI.getStats(),
        adminAPI.getJobs(),
        adminAPI.getRecruiters(),
        adminAPI.getClients(),
        adminAPI.getPipeline(),
        adminAPI.getPerformance()
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.success) {
        setStats(statsRes.value.data);
      }
      if (jobsRes.status === 'fulfilled' && jobsRes.value?.success) {
        setJobs(jobsRes.value.data || []);
      }
      if (recruitersRes.status === 'fulfilled' && recruitersRes.value?.success) {
        setRecruiters(recruitersRes.value.data || []);
      }
      if (clientsRes.status === 'fulfilled' && clientsRes.value?.success) {
        setClients(clientsRes.value.data || []);
      }
      if (pipelineRes.status === 'fulfilled' && pipelineRes.value?.success) {
        setPipeline(pipelineRes.value.data);
      }
      if (performanceRes.status === 'fulfilled' && performanceRes.value?.success) {
        setPerformance(performanceRes.value.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch report data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Compute derived data
  const jobsByStatus = [
    { name: 'Active', value: jobs.filter(j => j.role_status === 'Active').length, color: '#10b981' },
    { name: 'Pending', value: jobs.filter(j => j.role_status === 'Pending').length, color: '#f59e0b' },
    { name: 'Paused', value: jobs.filter(j => j.role_status === 'Paused').length, color: '#6b7280' },
    { name: 'Closed', value: jobs.filter(j => j.role_status === 'Closed').length, color: '#ef4444' }
  ].filter(s => s.value > 0);

  const pipelineStats = pipeline ? [
    { name: 'Applied', value: pipeline.applied?.length || 0, color: '#3b82f6' },
    { name: 'In Review', value: pipeline.internal_review?.length || 0, color: '#8b5cf6' },
    { name: 'Shortlisted', value: pipeline.shortlisted?.length || 0, color: '#f59e0b' },
    { name: 'Interview', value: pipeline.interview?.length || 0, color: '#06b6d4' },
    { name: 'Selected', value: pipeline.selected?.length || 0, color: '#10b981' },
    { name: 'Rejected', value: pipeline.rejected?.length || 0, color: '#ef4444' }
  ] : [];

  // Top recruiters by profile count
  const topRecruiters = [...recruiters]
    .sort((a, b) => (b.profileCount || 0) - (a.profileCount || 0))
    .slice(0, 5);

  // Jobs by client
  const jobsByClient = clients
    .map(c => ({ name: c.fullName || c.company || 'Unknown', jobs: c.jobCount || 0 }))
    .filter(c => c.jobs > 0)
    .sort((a, b) => b.jobs - a.jobs)
    .slice(0, 5);

  // Export CSV function
  const exportCSV = async () => {
    setExporting('csv');
    try {
      // Build CSV content
      let csv = '';

      // Summary Section
      csv += 'A2Z STAFFS - EXPORT REPORT\n';
      csv += `Generated:,${new Date().toLocaleDateString()}\n\n`;

      // Stats Summary
      csv += 'SUMMARY STATISTICS\n';
      csv += 'Metric,Value\n';
      csv += `Total Recruiters,${stats?.totalRecruiters || 0}\n`;
      csv += `Total Clients,${stats?.totalClients || 0}\n`;
      csv += `Active Jobs,${stats?.activeJobs || 0}\n`;
      csv += `Total CV Profiles,${stats?.totalProfiles || 0}\n`;
      csv += `Pipeline Value,${stats?.pipelineValue || 0}\n\n`;

      // Jobs by Status
      csv += 'JOBS BY STATUS\n';
      csv += 'Status,Count\n';
      jobsByStatus.forEach(item => {
        csv += `${item.name},${item.value}\n`;
      });
      csv += '\n';

      // Pipeline Stats
      csv += 'CV PIPELINE DISTRIBUTION\n';
      csv += 'Stage,Count\n';
      pipelineStats.forEach(item => {
        csv += `${item.name},${item.value}\n`;
      });
      csv += '\n';

      // Top Recruiters
      csv += 'TOP RECRUITERS BY SUBMISSIONS\n';
      csv += 'Recruiter,Email,Submissions\n';
      topRecruiters.forEach(r => {
        csv += `"${r.fullName || 'N/A'}","${r.email || 'N/A'}",${r.profileCount || 0}\n`;
      });
      csv += '\n';

      // Jobs by Client
      csv += 'JOBS BY CLIENT\n';
      csv += 'Client,Jobs Posted\n';
      jobsByClient.forEach(c => {
        csv += `"${c.name}",${c.jobs}\n`;
      });
      csv += '\n';

      // All Jobs Detail
      csv += 'ALL JOBS DETAIL\n';
      csv += 'Job Title,Company,Status,Posted By,Created Date\n';
      jobs.forEach(job => {
        csv += `"${job.job_title || ''}","${job.company_name || ''}","${job.role_status || ''}","${job.postedBy?.fullName || ''}","${new Date(job.createdAt).toLocaleDateString()}"\n`;
      });

      // Download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `A2Z_Staffs_Report_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } catch (error) {
      console.error('CSV export failed:', error);
    } finally {
      setExporting(null);
    }
  };

  // Export PDF function
  const exportPDF = async () => {
    setExporting('pdf');
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPos = 20;

      // Title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('A2Z STAFFS', pageWidth / 2, yPos, { align: 'center' });
      yPos += 8;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text('Monthly Report', pageWidth / 2, yPos, { align: 'center' });
      yPos += 6;
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric'
      })}`, pageWidth / 2, yPos, { align: 'center' });
      doc.setTextColor(0);
      yPos += 15;

      // Summary Section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Summary Statistics', 14, yPos);
      yPos += 8;

      autoTable(doc, {
        startY: yPos,
        head: [['Metric', 'Value']],
        body: [
          ['Total Recruiters', String(stats?.totalRecruiters || 0)],
          ['Total Clients', String(stats?.totalClients || 0)],
          ['Active Jobs', String(stats?.activeJobs || 0)],
          ['CV Profiles', String(stats?.totalProfiles || 0)],
          ['Pipeline Value', `₹${(stats?.pipelineValue || 0).toLocaleString('en-IN')}`]
        ],
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
        margin: { left: 14, right: 14 }
      });

      yPos = doc.lastAutoTable.finalY + 15;

      // Jobs by Status
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Jobs by Status', 14, yPos);
      yPos += 8;

      autoTable(doc, {
        startY: yPos,
        head: [['Status', 'Count']],
        body: jobsByStatus.map(s => [s.name, String(s.value)]),
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129] },
        margin: { left: 14, right: 14 }
      });

      yPos = doc.lastAutoTable.finalY + 15;

      // CV Pipeline
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('CV Pipeline Distribution', 14, yPos);
      yPos += 8;

      autoTable(doc, {
        startY: yPos,
        head: [['Stage', 'Count']],
        body: pipelineStats.map(s => [s.name, String(s.value)]),
        theme: 'striped',
        headStyles: { fillColor: [139, 92, 246] },
        margin: { left: 14, right: 14 }
      });

      yPos = doc.lastAutoTable.finalY + 15;

      // Check if we need a new page
      if (yPos > 230) {
        doc.addPage();
        yPos = 20;
      }

      // Top Recruiters
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Top Recruiters by Submissions', 14, yPos);
      yPos += 8;

      autoTable(doc, {
        startY: yPos,
        head: [['Recruiter', 'Email', 'Submissions']],
        body: topRecruiters.map(r => [
          r.fullName || 'N/A',
          r.email || 'N/A',
          String(r.profileCount || 0)
        ]),
        theme: 'striped',
        headStyles: { fillColor: [245, 158, 11] },
        margin: { left: 14, right: 14 }
      });

      yPos = doc.lastAutoTable.finalY + 15;

      // Jobs by Client
      if (jobsByClient.length > 0) {
        if (yPos > 230) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Jobs Posted by Client', 14, yPos);
        yPos += 8;

        autoTable(doc, {
          startY: yPos,
          head: [['Client', 'Jobs Posted']],
          body: jobsByClient.map(c => [c.name, String(c.jobs)]),
          theme: 'striped',
          headStyles: { fillColor: [6, 182, 212] },
          margin: { left: 14, right: 14 }
        });
      }

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Page ${i} of ${pageCount} | A2Z Staffs Confidential`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }

      // Save
      doc.save(`A2Z_Staffs_Monthly_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div>
      <main className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-secondary-900 text-2xl font-bold">Analytics & Reports</h2>
            <p className="text-secondary-600">Performance metrics and downloadable reports</p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-secondary-700 hover:bg-gray-50 transition-colors"
          >
            ← Back
          </Link>
        </div>

        {isLoading ? (
          <LoadingSpinner variant="logo" size="lg" message="Loading reports..." />
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white"
              >
                <Users className="w-6 h-6 mb-2 opacity-80" />
                <p className="text-2xl font-bold">{stats?.totalRecruiters || 0}</p>
                <p className="text-sm opacity-80">Total Recruiters</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl text-white"
              >
                <Building2 className="w-6 h-6 mb-2 opacity-80" />
                <p className="text-2xl font-bold">{stats?.totalClients || 0}</p>
                <p className="text-sm opacity-80">Total Clients</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white"
              >
                <Briefcase className="w-6 h-6 mb-2 opacity-80" />
                <p className="text-2xl font-bold">{stats?.activeJobs || 0}</p>
                <p className="text-sm opacity-80">Active Jobs</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white"
              >
                <FileText className="w-6 h-6 mb-2 opacity-80" />
                <p className="text-2xl font-bold">{stats?.totalProfiles || 0}</p>
                <p className="text-sm opacity-80">CV Profiles</p>
              </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Jobs by Status */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm"
              >
                <h3 className="font-semibold text-gray-800 mb-4">Jobs by Status</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={jobsByStatus.length > 0 ? jobsByStatus : [{ name: 'No Data', value: 1, color: '#e5e7eb' }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {(jobsByStatus.length > 0 ? jobsByStatus : [{ name: 'No Data', value: 1, color: '#e5e7eb' }]).map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>

              {/* CV Pipeline */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm"
              >
                <h3 className="font-semibold text-gray-800 mb-4">CV Pipeline Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={pipelineStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Monthly Performance */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm"
              >
                <h3 className="font-semibold text-gray-800 mb-4">Monthly Signups</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={performance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="recruiters" name="Recruiters" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="clients" name="Clients" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Top Recruiters */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm"
              >
                <h3 className="font-semibold text-gray-800 mb-4">Top Recruiters by Submissions</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={topRecruiters.map(r => ({
                      name: r.fullName?.split(' ')[0] || 'Unknown',
                      submissions: r.profileCount || 0
                    }))}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="submissions" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Export Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Download className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-bold text-gray-800">Export Data</h3>
              </div>
              <p className="text-gray-500 mb-4">
                Download comprehensive reports with real platform data including jobs, recruiters, clients, and CV statistics.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={exportPDF}
                  disabled={exporting !== null}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {exporting === 'pdf' ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                  ) : (
                    <><FileText className="w-4 h-4" /> Download Monthly Report (PDF)</>
                  )}
                </button>
                <button
                  onClick={exportCSV}
                  disabled={exporting !== null}
                  className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {exporting === 'csv' ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Exporting...</>
                  ) : (
                    <><BarChart3 className="w-4 h-4" /> Export CSV (All Data)</>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
