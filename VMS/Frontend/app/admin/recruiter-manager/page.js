'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminAPI } from '@/lib/api';
import { Users, UserCheck, Briefcase, ChevronDown, ChevronUp, Plus, X } from 'lucide-react';

export default function RecruiterManagerManagementPage() {
    const [activeTab, setActiveTab] = useState('rms'); // 'rms' or 'assignments'
    const [rms, setRms] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [allRecruiters, setAllRecruiters] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [expandedRM, setExpandedRM] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modals
    const [showAssignRoleModal, setShowAssignRoleModal] = useState(false);
    const [showAssignRecruiterModal, setShowAssignRecruiterModal] = useState(false);
    const [showCreateRMModal, setShowCreateRMModal] = useState(false);
    const [selectedRMForRecruiter, setSelectedRMForRecruiter] = useState(null);

    // Form data for creating new RM
    const [rmFormData, setRmFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);

            // Fetch all data concurrently
            const [rmsRes, recruitersRes, assignmentsRes] = await Promise.all([
                adminAPI.getAllRecruiterManagers(),
                adminAPI.getRecruiters(),
                adminAPI.getAllRMAssignments(true)
            ]);

            if (rmsRes.success) setRms(rmsRes.data);
            if (recruitersRes.success) setAllRecruiters(recruitersRes.data);
            if (assignmentsRes.success) setAssignments(assignmentsRes.data);

            // Fetch all users for role assignment
            try {
                const usersRes = await adminAPI.getAllUsers();
                if (usersRes.success) {
                    // Filter out users who already have RM role
                    const availableUsers = usersRes.data.filter(
                        u => !rmsRes.data?.find(r => r._id === u._id)
                    );
                    setAllUsers(availableUsers);
                } else {
                    setAllUsers([]);
                }
            } catch (userError) {
                console.error('Error fetching users:', userError);
                setAllUsers([]);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAssignRMRole = async (userId) => {
        try {
            const response = await adminAPI.assignRecruiterManagerRole(userId);
            if (response.success) {
                await fetchData();
                setShowAssignRoleModal(false);
                alert('Recruiter Manager role assigned successfully!');
            }
        } catch (err) {
            alert('Error assigning Recruiter Manager role: ' + err.message);
        }
    };

    const handleRevokeRMRole = async (userId) => {
        if (!confirm('Are you sure you want to revoke Recruiter Manager role? This will deactivate all recruiter assignments.')) {
            return;
        }

        try {
            const response = await adminAPI.revokeRecruiterManagerRole(userId);
            if (response.success) {
                await fetchData();
                alert('Recruiter Manager role revoked successfully!');
            }
        } catch (err) {
            alert('Error revoking Recruiter Manager role: ' + err.message);
        }
    };

    const handleAssignRecruiter = async (rmId, recruiterId) => {
        try {
            const response = await adminAPI.assignRecruiterToRM(rmId, recruiterId);
            if (response.success) {
                await fetchData();
                setShowAssignRecruiterModal(false);
                alert('Recruiter assigned successfully!');
            }
        } catch (err) {
            alert('Error assigning recruiter: ' + err.message);
        }
    };

    const handleRemoveRecruiter = async (rmId, recruiterId) => {
        if (!confirm('Are you sure you want to remove this recruiter assignment?')) {
            return;
        }

        try {
            const response = await adminAPI.removeRecruiterFromRM(rmId, recruiterId);
            if (response.success) {
                await fetchData();
                alert('Recruiter removed successfully!');
            }
        } catch (err) {
            alert('Error removing recruiter: ' + err.message);
        }
    };

    const getRMAssignments = (rmId) => {
        return assignments.filter(a => a.recruiterManager._id === rmId);
    };

    const getAssignedRecruiterIds = (rmId) => {
        return assignments.filter(a => a.recruiterManager._id === rmId).map(a => a.recruiter._id);
    };

    const getAvailableRecruiters = (rmId) => {
        const assignedIds = getAssignedRecruiterIds(rmId);
        return allRecruiters.filter(r => !assignedIds.includes(r._id));
    };

    const handleCreateRM = async (e) => {
        e.preventDefault();

        // Validate form
        if (!rmFormData.fullName || !rmFormData.email || !rmFormData.password) {
            alert('Please fill in all required fields (Full Name, Email, Password)');
            return;
        }

        try {
            const response = await adminAPI.createRecruiterManager(rmFormData);
            if (response.success) {
                await fetchData();
                setShowCreateRMModal(false);
                // Reset form
                setRmFormData({
                    fullName: '',
                    email: '',
                    password: '',
                    phoneNumber: ''
                });
                alert('Recruiter Manager account created successfully!');
            }
        } catch (err) {
            alert('Error creating Recruiter Manager account: ' + err.message);
        }
    };

    return (
        <div className="">
            <main className="p-4 lg:p-8">
                {/* Header */}
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-secondary-900 text-2xl font-bold">Recruiter Manager Management</h2>
                        <p className="text-secondary-600">Manage Recruiter Managers and recruiter assignments</p>
                    </div>
                    <Link href="/admin" className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-secondary-700 hover:bg-gray-50 transition-colors">
                        ← Back
                    </Link>
                </div>

                {/* Tabs */}
                <div className="mb-6 flex gap-2 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('rms')}
                        className={`px-6 py-3 font-medium transition-colors ${activeTab === 'rms'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-secondary-600 hover:text-secondary-900'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <UserCheck className="w-5 h-5" />
                            RM Users ({rms.length})
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('assignments')}
                        className={`px-6 py-3 font-medium transition-colors ${activeTab === 'assignments'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-secondary-600 hover:text-secondary-900'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-5 h-5" />
                            Recruiter Assignments ({assignments.length})
                        </div>
                    </button>
                </div>

                {isLoading ? (
                    <div className="p-8 text-center text-secondary-600">Loading...</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-600">{error}</div>
                ) : (
                    <>
                        {/* RM Users Tab */}
                        {activeTab === 'rms' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-secondary-900">Recruiter Managers</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowCreateRMModal(true)}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Create New RM
                                        </button>
                                        <button
                                            onClick={() => setShowAssignRoleModal(true)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Assign RM Role
                                        </button>
                                    </div>
                                </div>

                                <div className="rounded-xl bg-white/50 backdrop-blur-md border border-white/60 shadow-xl overflow-hidden">
                                    {rms.length === 0 ? (
                                        <div className="p-8 text-center text-secondary-500">
                                            No Recruiter Managers assigned yet. Click "Assign RM Role" to create one.
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-200">
                                            {rms.map((rm) => {
                                                const rmAssignments = getRMAssignments(rm._id);
                                                const isExpanded = expandedRM === rm._id;

                                                return (
                                                    <div key={rm._id} className="p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3">
                                                                    <div>
                                                                        <h4 className="font-semibold text-secondary-900">{rm.fullName}</h4>
                                                                        <p className="text-sm text-secondary-600">{rm.email}</p>
                                                                    </div>
                                                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                                                        {rm.assignedRecruitersCount || 0} Recruiters
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedRMForRecruiter(rm);
                                                                        setShowAssignRecruiterModal(true);
                                                                    }}
                                                                    className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                >
                                                                    Assign Recruiter
                                                                </button>
                                                                <button
                                                                    onClick={() => setExpandedRM(isExpanded ? null : rm._id)}
                                                                    className="px-3 py-1 text-sm text-secondary-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
                                                                >
                                                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                                    {isExpanded ? 'Hide' : 'Show'} Recruiters
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRevokeRMRole(rm._id)}
                                                                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                >
                                                                    Revoke Role
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Expanded Recruiter List */}
                                                        {isExpanded && (
                                                            <div className="mt-4 ml-4 pl-4 border-l-2 border-gray-200 space-y-2">
                                                                {rmAssignments.length === 0 ? (
                                                                    <p className="text-sm text-secondary-500">No recruiters assigned yet</p>
                                                                ) : (
                                                                    rmAssignments.map((assignment) => (
                                                                        <div key={assignment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                                            <div>
                                                                                <p className="font-medium text-secondary-900">{assignment.recruiter.fullName}</p>
                                                                                <p className="text-sm text-secondary-600">{assignment.recruiter.email}</p>
                                                                                <p className="text-xs text-secondary-500">
                                                                                    Assigned: {new Date(assignment.assignedAt).toLocaleDateString()}
                                                                                </p>
                                                                            </div>
                                                                            <button
                                                                                onClick={() => handleRemoveRecruiter(rm._id, assignment.recruiter._id)}
                                                                                className="text-red-600 hover:text-red-700"
                                                                            >
                                                                                <X className="w-4 h-4" />
                                                                            </button>
                                                                        </div>
                                                                    ))
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Assignments Tab */}
                        {activeTab === 'assignments' && (
                            <div className="rounded-xl bg-white/50 backdrop-blur-md border border-white/60 shadow-xl overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-white/50 border-b border-gray-200">
                                        <tr>
                                            <th className="p-4 text-left text-sm font-semibold text-secondary-600">RM</th>
                                            <th className="p-4 text-left text-sm font-semibold text-secondary-600">Recruiter</th>
                                            <th className="p-4 text-left text-sm font-semibold text-secondary-600">Assigned By</th>
                                            <th className="p-4 text-left text-sm font-semibold text-secondary-600">Assigned Date</th>
                                            <th className="p-4 text-right text-sm font-semibold text-secondary-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {assignments.map((assignment) => (
                                            <tr key={assignment._id} className="hover:bg-white/60 transition-colors">
                                                <td className="p-4">
                                                    <div>
                                                        <p className="font-medium text-secondary-900">{assignment.recruiterManager.fullName}</p>
                                                        <p className="text-sm text-secondary-600">{assignment.recruiterManager.email}</p>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div>
                                                        <p className="font-medium text-secondary-900">{assignment.recruiter.fullName}</p>
                                                        <p className="text-sm text-secondary-600">{assignment.recruiter.email}</p>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-secondary-600">
                                                    {assignment.assignedBy?.fullName || 'Admin'}
                                                </td>
                                                <td className="p-4 text-secondary-600">
                                                    {new Date(assignment.assignedAt).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => handleRemoveRecruiter(assignment.recruiterManager._id, assignment.recruiter._id)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}

                {/* Assign RM Role Modal */}
                {showAssignRoleModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-secondary-900">Assign Recruiter Manager Role</h3>
                                <button onClick={() => setShowAssignRoleModal(false)} className="text-secondary-400 hover:text-secondary-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <p className="text-sm text-secondary-600 mb-4">Select a user to assign the Recruiter Manager role</p>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {allUsers.filter(u => !rms.find(r => r._id === u._id)).map((user) => (
                                    <div
                                        key={user._id}
                                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                                        onClick={() => handleAssignRMRole(user._id)}
                                    >
                                        <div>
                                            <p className="font-medium text-secondary-900">{user.fullName}</p>
                                            <p className="text-sm text-secondary-600">{user.email}</p>
                                        </div>
                                        <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                                            Assign
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Assign Recruiter Modal */}
                {showAssignRecruiterModal && selectedRMForRecruiter && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-secondary-900">
                                    Assign Recruiter to {selectedRMForRecruiter.fullName}
                                </h3>
                                <button onClick={() => {
                                    setShowAssignRecruiterModal(false);
                                    setSelectedRMForRecruiter(null);
                                }} className="text-secondary-400 hover:text-secondary-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <p className="text-sm text-secondary-600 mb-4">Select a recruiter to assign</p>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {getAvailableRecruiters(selectedRMForRecruiter._id).map((recruiter) => (
                                    <div
                                        key={recruiter._id}
                                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                                        onClick={() => handleAssignRecruiter(selectedRMForRecruiter._id, recruiter._id)}
                                    >
                                        <div>
                                            <p className="font-medium text-secondary-900">{recruiter.fullName}</p>
                                            <p className="text-sm text-secondary-600">{recruiter.email}</p>
                                            {recruiter.company && <p className="text-xs text-secondary-500">{recruiter.company}</p>}
                                        </div>
                                        <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                                            Assign
                                        </button>
                                    </div>
                                ))}
                                {getAvailableRecruiters(selectedRMForRecruiter._id).length === 0 && (
                                    <p className="text-center text-secondary-500 py-4">All recruiters are already assigned to this RM</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Create New RM Modal */}
                {showCreateRMModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-secondary-900">Create New Recruiter Manager</h3>
                                <button
                                    onClick={() => {
                                        setShowCreateRMModal(false);
                                        setRmFormData({
                                            fullName: '',
                                            email: '',
                                            password: '',
                                            phoneNumber: ''
                                        });
                                    }}
                                    className="text-secondary-400 hover:text-secondary-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateRM} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={rmFormData.fullName}
                                        onChange={(e) => setRmFormData({ ...rmFormData, fullName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter full name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={rmFormData.email}
                                        onChange={(e) => setRmFormData({ ...rmFormData, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter email address"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={rmFormData.password}
                                        onChange={(e) => setRmFormData({ ...rmFormData, password: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter password"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={rmFormData.phoneNumber}
                                        onChange={(e) => setRmFormData({ ...rmFormData, phoneNumber: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter phone number (optional)"
                                    />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCreateRMModal(false);
                                            setRmFormData({
                                                fullName: '',
                                                email: '',
                                                password: '',
                                                phoneNumber: ''
                                            });
                                        }}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-secondary-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        Create RM
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
