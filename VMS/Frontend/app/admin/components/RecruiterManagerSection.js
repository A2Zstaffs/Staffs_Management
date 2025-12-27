'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import { Users, UserCheck, Briefcase, ChevronDown, ChevronUp, Plus, X, UserPlus } from 'lucide-react';

export default function RecruiterManagerSection() {
    const [rms, setRms] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [allRecruiters, setAllRecruiters] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [expandedRM, setExpandedRM] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modals
    const [showCreateRMModal, setShowCreateRMModal] = useState(false);
    const [showAssignRoleModal, setShowAssignRoleModal] = useState(false);
    const [showAssignRecruiterModal, setShowAssignRecruiterModal] = useState(false);
    const [selectedRMForRecruiter, setSelectedRMForRecruiter] = useState(null);

    // Create RM form state
    const [createRMForm, setCreateRMForm] = useState({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: ''
    });
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);

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

    const handleCreateRM = async (e) => {
        e.preventDefault();

        if (!createRMForm.fullName || !createRMForm.email || !createRMForm.password) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            setIsCreating(true);
            const response = await adminAPI.createRecruiterManager(createRMForm);

            if (response.success) {
                await fetchData();
                setShowCreateRMModal(false);
                setCreateRMForm({
                    fullName: '',
                    email: '',
                    password: '',
                    phoneNumber: ''
                });
                alert('Recruiter Manager created successfully!');
            }
        } catch (err) {
            alert('Error creating Recruiter Manager: ' + err.message);
        } finally {
            setIsCreating(false);
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
        if (!confirm('Are you sure you want to revoke Recruiter Manager role? This will de activate all recruiter assignments.')) {
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Recruiter Manager Management</h3>
                    <p className="text-gray-600 text-sm mt-1">Manage Recruiter Managers and recruiter assignments</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowCreateRMModal(true)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-md"
                    >
                        <UserPlus className="w-4 h-4" />
                        Create RM
                    </button>
                    <button
                        onClick={() => setShowAssignRoleModal(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-md"
                    >
                        <Plus className="w-4 h-4" />
                        Assign Role
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="p-8 text-center text-gray-600">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                    Loading RMs...
                </div>
            ) : error ? (
                <div className="p-8 text-center text-red-600">{error}</div>
            ) : (
                <div className="rounded-xl bg-white border border-gray-200 shadow-lg overflow-hidden">
                    {rms.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="font-medium">No Recruiter Managers yet</p>
                            <p className="text-sm">Click "Create RM" or "Assign Role" to get started</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {rms.map((rm) => {
                                const rmAssignments = getRMAssignments(rm._id);
                                const isExpanded = expandedRM === rm._id;

                                return (
                                    <div key={rm._id} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold">
                                                        {rm.fullName?.charAt(0) || 'R'}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{rm.fullName}</h4>
                                                        <p className="text-sm text-gray-600">{rm.email}</p>
                                                    </div>
                                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
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
                                                    className="px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-medium"
                                                >
                                                    Assign Recruiter
                                                </button>
                                                <button
                                                    onClick={() => setExpandedRM(isExpanded ? null : rm._id)}
                                                    className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
                                                >
                                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                    {isExpanded ? 'Hide' : 'Show'}
                                                </button>
                                                <button
                                                    onClick={() => handleRevokeRMRole(rm._id)}
                                                    className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                                                >
                                                    Revoke
                                                </button>
                                            </div>
                                        </div>

                                        {/* Expanded Recruiter List */}
                                        {isExpanded && (
                                            <div className="mt-4 ml-4 pl-4 border-l-2 border-gray-200 space-y-2">
                                                {rmAssignments.length === 0 ? (
                                                    <p className="text-sm text-gray-500 italic">No recruiters assigned yet</p>
                                                ) : (
                                                    rmAssignments.map((assignment) => (
                                                        <div key={assignment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                            <div>
                                                                <p className="font-medium text-gray-900">{assignment.recruiter.fullName}</p>
                                                                <p className="text-sm text-gray-600">{assignment.recruiter.email}</p>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    Assigned: {new Date(assignment.assignedAt).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() => handleRemoveRecruiter(rm._id, assignment.recruiter._id)}
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
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
            )}

            {/* Create RM Modal */}
            {showCreateRMModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Create New Recruiter Manager</h3>
                            <button onClick={() => setShowCreateRMModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateRM} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    value={createRMForm.fullName}
                                    onChange={(e) => setCreateRMForm({ ...createRMForm, fullName: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    value={createRMForm.email}
                                    onChange={(e) => setCreateRMForm({ ...createRMForm, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                                <input
                                    type="password"
                                    value={createRMForm.password}
                                    onChange={(e) => setCreateRMForm({ ...createRMForm, password: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Min. 8 characters"
                                    minLength={8}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    value={createRMForm.phoneNumber}
                                    onChange={(e) => setCreateRMForm({ ...createRMForm, phoneNumber: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="+1 234 567 8900"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateRMModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    disabled={isCreating}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isCreating}
                                >
                                    {isCreating ? 'Creating...' : 'Create RM'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Assign RM Role Modal */}
            {showAssignRoleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Assign Recruiter Manager Role</h3>
                            <button onClick={() => setShowAssignRoleModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">Select an existing user to assign the Recruiter Manager role</p>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {allUsers.filter(u => !rms.find(r => r._id === u._id)).length === 0 ? (
                                <p className="text-center text-gray-500 py-4">No available users to assign</p>
                            ) : (
                                allUsers.filter(u => !rms.find(r => r._id === u._id)).map((user) => (
                                    <div
                                        key={user._id}
                                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center transition-colors"
                                        onClick={() => handleAssignRMRole(user._id)}
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900">{user.fullName}</p>
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                        </div>
                                        <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">
                                            Assign
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Recruiter Modal */}
            {showAssignRecruiterModal && selectedRMForRecruiter && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Assign Recruiter to {selectedRMForRecruiter.fullName}
                            </h3>
                            <button onClick={() => {
                                setShowAssignRecruiterModal(false);
                                setSelectedRMForRecruiter(null);
                            }} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">Select a recruiter to assign</p>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {getAvailableRecruiters(selectedRMForRecruiter._id).map((recruiter) => (
                                <div
                                    key={recruiter._id}
                                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center transition-colors"
                                    onClick={() => handleAssignRecruiter(selectedRMForRecruiter._id, recruiter._id)}
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">{recruiter.fullName}</p>
                                        <p className="text-sm text-gray-600">{recruiter.email}</p>
                                        {recruiter.company && <p className="text-xs text-gray-500">{recruiter.company}</p>}
                                    </div>
                                    <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">
                                        Assign
                                    </button>
                                </div>
                            ))}
                            {getAvailableRecruiters(selectedRMForRecruiter._id).length === 0 && (
                                <p className="text-center text-gray-500 py-4">All recruiters are already assigned to this RM</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
