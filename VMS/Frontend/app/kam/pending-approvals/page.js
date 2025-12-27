'use client';

import { useState, useEffect } from 'react';
import { getPendingStatusChanges, approvePendingStatusChange, rejectPendingStatusChange } from '@/lib/kamApi';

export default function PendingApprovalsPage() {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState(''); // 'approve' or 'reject'
    const [kamNotes, setKamNotes] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        loadPendingRequests();
    }, []);

    const loadPendingRequests = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await getPendingStatusChanges();
            if (response.success) {
                setPendingRequests(response.data || []);
            } else {
                setError('Failed to load pending requests');
            }
        } catch (err) {
            console.error('Error loading pending requests:', err);
            setError(err.message || 'An error occurred while loading pending requests');
        } finally {
            setIsLoading(false);
        }
    };

    const handleActionClick = (request, action) => {
        setSelectedRequest(request);
        setModalAction(action);
        setKamNotes('');
        setShowModal(true);
    };

    const handleConfirmAction = async () => {
        if (!selectedRequest) return;

        setIsProcessing(true);
        try {
            let response;
            if (modalAction === 'approve') {
                response = await approvePendingStatusChange(selectedRequest._id, kamNotes);
            } else {
                response = await rejectPendingStatusChange(selectedRequest._id, kamNotes);
            }

            if (response.success) {
                // Remove the processed request from the list
                setPendingRequests(prevRequests =>
                    prevRequests.filter(req => req._id !== selectedRequest._id)
                );
                setShowModal(false);
                setSelectedRequest(null);
            } else {
                alert(response.message || `Failed to ${modalAction} request`);
            }
        } catch (error) {
            console.error(`Error ${modalAction}ing request:`, error);
            alert(error.message || `An error occurred while ${modalAction}ing the request`);
        } finally {
            setIsProcessing(false);
        }
    };

    const getStatusBadgeColor = (currentStatus, requestedStatus) => {
        const statusColors = {
            'shortlisted': 'bg-indigo-100 text-indigo-800 border-indigo-200',
            'interview_scheduled': 'bg-blue-100 text-blue-800 border-blue-200',
            'interviewed': 'bg-purple-100 text-purple-800 border-purple-200',
            'rejected': 'bg-red-100 text-red-800 border-red-200',
            'hired': 'bg-green-100 text-green-800 border-green-200',
            'selected': 'bg-emerald-100 text-emerald-800 border-emerald-200'
        };

        const currentColor = statusColors[currentStatus] || 'bg-gray-100 text-gray-800 border-gray-200';
        const requestedColor = statusColors[requestedStatus] || 'bg-gray-100 text-gray-800 border-gray-200';

        return { currentColor, requestedColor };
    };

    const formatStatus = (status) => {
        return status.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Page Header */}
            <div className="mb-6 bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Pending Approvals <span className="text-blue-400">.</span>
                </h1>
                <p className="text-slate-300">
                    Review and approve status change requests from clients
                </p>
                {!isLoading && (
                    <div className="mt-4">
                        <span className="inline-flex items-center px-4 py-2 bg-blue-500/20 text-blue-200 rounded-lg font-semibold">
                            {pendingRequests.length} Pending {pendingRequests.length === 1 ? 'Request' : 'Requests'}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-gray-600">Loading pending requests...</p>
                    </div>
                ) : error ? (
                    <div className="p-12 text-center">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                        <button
                            onClick={loadPendingRequests}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : pendingRequests.length === 0 ? (
                    <div className="p-12 text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">All caught up!</h3>
                        <p className="text-gray-600">No pending approval requests at the moment</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Client
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Job & Candidate
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Status Change
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Requested
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Client Notes
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {pendingRequests.map((request) => {
                                    const { currentColor, requestedColor } = getStatusBadgeColor(
                                        request.currentStatus,
                                        request.requestedStatus
                                    );

                                    return (
                                        <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {request.client?.fullName || 'Unknown Client'}
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    {request.client?.company || request.client?.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {request.job?.job_title || 'Unknown Job'}
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    {request.targetDetails?.candidateName || 'Unknown Candidate'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${currentColor}`}>
                                                        {formatStatus(request.currentStatus)}
                                                    </span>
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${requestedColor}`}>
                                                        {formatStatus(request.requestedStatus)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-700">
                                                    {formatDate(request.requestedAt)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600 max-w-xs truncate">
                                                    {request.clientNotes || <span className="text-gray-400 italic">No notes</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleActionClick(request, 'approve')}
                                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleActionClick(request, 'reject')}
                                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-colors"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Action Confirmation Modal */}
            {showModal && selectedRequest && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            {modalAction === 'approve' ? 'Approve' : 'Reject'} Status Change
                        </h3>
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600 mb-2">
                                <strong>Client:</strong> {selectedRequest.client?.fullName}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                                <strong>Candidate:</strong> {selectedRequest.targetDetails?.candidateName}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                                <strong>Job:</strong> {selectedRequest.job?.job_title}
                            </div>
                            <div className="text-sm text-gray-600">
                                <strong>Requested Change:</strong> {formatStatus(selectedRequest.currentStatus)} → {formatStatus(selectedRequest.requestedStatus)}
                            </div>
                            {selectedRequest.clientNotes && (
                                <div className="text-sm text-gray-600 mt-2">
                                    <strong>Client Notes:</strong> {selectedRequest.clientNotes}
                                </div>
                            )}
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Your Notes (Optional)
                            </label>
                            <textarea
                                value={kamNotes}
                                onChange={(e) => setKamNotes(e.target.value)}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder={`Add notes about this ${modalAction}...`}
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedRequest(null);
                                }}
                                disabled={isProcessing}
                                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmAction}
                                disabled={isProcessing}
                                className={`px-6 py-2 ${modalAction === 'approve'
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-red-500 hover:bg-red-600'
                                    } text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center`}
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    `Confirm ${modalAction === 'approve' ? 'Approval' : 'Rejection'}`
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
