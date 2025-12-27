'use client';

import { useState, useEffect } from 'react';
import { getReceivedCVs, updateCVStatus } from '@/lib/clientApi';

export default function ReceivedCVsPage() {
  const [cvs, setCVs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCV, setSelectedCV] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');

  useEffect(() => {
    loadCVs();
  }, []);

  const loadCVs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getReceivedCVs();
      if (response.success) {
        setCVs(response.data || []);
      } else {
        setError('Failed to load CVs. Please try again.');
      }
    } catch (err) {
      console.error('Error loading CVs:', err);
      setError(err.message || 'An error occurred while loading CVs.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (cv, action) => {
    setSelectedCV(cv);
    setActionType(action);
    setShowActionModal(true);
  };

  const confirmAction = async () => {
    if (!selectedCV) return;

    try {
      const response = await updateCVStatus(selectedCV.id, { status: actionType });
      if (response.success) {
        // Show success message - status change is pending KAM approval
        alert(response.message || 'Status change request submitted to your Key Account Manager for review.');

        // Reload CVs to reflect any updates
        await loadCVs();

        setShowActionModal(false);
        setSelectedCV(null);
      } else {
        alert(response.message || 'Failed to update CV status');
      }
    } catch (error) {
      console.error('Error updating CV status:', error);
      alert(error.message || 'An error occurred');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'shortlisted': { label: 'Shortlisted', class: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
      'rejected': { label: 'Rejected', class: 'bg-red-100 text-red-800 border-red-200' },
      'interview_scheduled': { label: 'Interview Scheduled', class: 'bg-warm-100 text-warm-800 border-warm-200' },
      'interviewed': { label: 'Interviewed', class: 'bg-warm-100 text-warm-800 border-warm-200' },
      'pending': { label: 'Pending', class: 'bg-secondary-100 text-secondary-800 border-secondary-200' },
      'hired': { label: 'Hired', class: 'bg-green-100 text-green-800 border-green-200' }
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.class}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6 bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">Received CVs <span className="text-blue-400">.</span></h1>
        <p className="text-slate-300">View and manage CVs received from candidates</p>
      </div>

      {/* CVs Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <svg className="animate-spin h-12 w-12 text-primary-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">Loading CVs...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
            <button
              onClick={loadCVs}
              className="px-6 py-2 bg-[#1A73FF] hover:bg-[#0047CC] text-white font-medium rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : cvs.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 text-secondary-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No CVs received yet</h3>
            <p className="text-gray-600">CVs will appear here once candidates apply to your jobs</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Candidate Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                    Expected Salary
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                    CV Download
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cvs.map((cv) => (
                  <tr key={cv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{cv.candidateName}</div>
                      <div className="text-xs text-gray-600">{cv.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{cv.experience || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {cv.expectedSalary ? `$${cv.expectedSalary.toLocaleString()}` : 'Not specified'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {cv.cvUrl ? (
                        <a
                          href={cv.cvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1A73FF] hover:text-[#0047CC] text-sm font-medium flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download CV
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">No CV available</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(cv.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleAction(cv, 'shortlisted')}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition-colors"
                        >
                          Shortlist
                        </button>
                        <button
                          onClick={() => handleAction(cv, 'interview_scheduled')}
                          className="px-3 py-1.5 bg-[#1A73FF] hover:bg-[#0047CC] text-white text-xs font-medium rounded-lg transition-colors"
                        >
                          Interview
                        </button>
                        <button
                          onClick={() => handleAction(cv, 'rejected')}
                          className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleAction(cv, 'hired')}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
                        >
                          Hired
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Confirmation Modal */}
      {showActionModal && selectedCV && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Confirm Action
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to mark <strong>{selectedCV.candidateName}</strong> as <strong>{actionType}</strong>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowActionModal(false);
                  setSelectedCV(null);
                }}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="px-6 py-2 bg-[#1A73FF] hover:bg-[#0047CC] text-white font-medium rounded-lg transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

