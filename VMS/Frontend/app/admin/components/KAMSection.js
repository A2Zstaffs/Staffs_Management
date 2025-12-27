'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import { Users, UserCheck, Building2, ChevronDown, ChevronUp, Plus, X, UserPlus } from 'lucide-react';

export default function KAMSection() {
    const [kams, setKams] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [allClients, setAllClients] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [expandedKam, setExpandedKam] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modals
    const [showCreateKamModal, setShowCreateKamModal] = useState(false);
    const [showAssignRoleModal, setShowAssignRoleModal] = useState(false);
    const [showAssignClientModal, setShowAssignClientModal] = useState(false);
    const [selectedKamForClient, setSelectedKamForClient] = useState(null);

    // Create KAM form state
    const [createKamForm, setCreateKamForm] = useState({
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
            const [kamsRes, clientsRes, assignmentsRes] = await Promise.all([
                adminAPI.getAllKams(),
                adminAPI.getClients(),
                adminAPI.getAllKamAssignments(true)
            ]);

            if (kamsRes.success) setKams(kamsRes.data);
            if (clientsRes.success) setAllClients(clientsRes.data);
            if (assignmentsRes.success) setAssignments(assignmentsRes.data);

            // Fetch all users for role assignment
            try {
                const usersRes = await adminAPI.getAllUsers();
                if (usersRes.success) {
                    // Filter out users who already have KAM role
                    const availableUsers = usersRes.data.filter(
                        u => !kamsRes.data?.find(k => k._id === u._id)
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

    const handleCreateKam = async (e) => {
        e.preventDefault();

        if (!createKamForm.fullName || !createKamForm.email || !createKamForm.password) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            setIsCreating(true);
            const response = await adminAPI.createKam(createKamForm);

            if (response.success) {
                await fetchData();
                setShowCreateKamModal(false);
                setCreateKamForm({
                    fullName: '',
                    email: '',
                    password: '',
                    phoneNumber: ''
                });
                alert('KAM user created successfully!');
            }
        } catch (err) {
            alert('Error creating KAM: ' + err.message);
        } finally {
            setIsCreating(false);
        }
    };

    const handleAssignKamRole = async (userId) => {
        try {
            const response = await adminAPI.assignKamRole(userId);
            if (response.success) {
                await fetchData();
                setShowAssignRoleModal(false);
                alert('KAM role assigned successfully!');
            }
        } catch (err) {
            alert('Error assigning KAM role: ' + err.message);
        }
    };

    const handleRevokeKamRole = async (userId) => {
        if (!confirm('Are you sure you want to revoke KAM role? This will deactivate all client assignments.')) {
            return;
        }

        try {
            const response = await adminAPI.revokeKamRole(userId);
            if (response.success) {
                await fetchData();
                alert('KAM role revoked successfully!');
            }
        } catch (err) {
            alert('Error revoking KAM role: ' + err.message);
        }
    };

    const handleAssignClient = async (kamId, clientId) => {
        try {
            const response = await adminAPI.assignClientToKam(kamId, clientId);
            if (response.success) {
                await fetchData();
                setShowAssignClientModal(false);
                alert('Client assigned successfully!');
            }
        } catch (err) {
            alert('Error assigning client: ' + err.message);
        }
    };

    const handleRemoveClient = async (kamId, clientId) => {
        if (!confirm('Are you sure you want to remove this client assignment?')) {
            return;
        }

        try {
            const response = await adminAPI.removeClientFromKam(kamId, clientId);
            if (response.success) {
                await fetchData();
                alert('Client removed successfully!');
            }
        } catch (err) {
            alert('Error removing client: ' + err.message);
        }
    };

    const getKamAssignments = (kamId) => {
        return assignments.filter(a => a.kam._id === kamId);
    };

    const getAssignedClientIds = (kamId) => {
        return assignments.filter(a => a.kam._id === kamId).map(a => a.client._id);
    };

    const getAvailableClients = (kamId) => {
        const assignedIds = getAssignedClientIds(kamId);
        return allClients.filter(c => !assignedIds.includes(c._id));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">KAM Management</h3>
                    <p className="text-gray-600 text-sm mt-1">Manage Key Account Managers and client assignments</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowCreateKamModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
                    >
                        <UserPlus className="w-4 h-4" />
                        Create KAM
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
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    Loading KAMs...
                </div>
            ) : error ? (
                <div className="p-8 text-center text-red-600">{error}</div>
            ) : (
                <div className="rounded-xl bg-white border border-gray-200 shadow-lg overflow-hidden">
                    {kams.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <UserCheck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="font-medium">No KAMs assigned yet</p>
                            <p className="text-sm">Click "Create KAM" or "Assign Role" to get started</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {kams.map((kam) => {
                                const kamAssignments = getKamAssignments(kam._id);
                                const isExpanded = expandedKam === kam._id;

                                return (
                                    <div key={kam._id} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                                                        {kam.fullName?.charAt(0) || 'K'}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{kam.fullName}</h4>
                                                        <p className="text-sm text-gray-600">{kam.email}</p>
                                                    </div>
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                                        {kam.assignedClientsCount || 0} Clients
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedKamForClient(kam);
                                                        setShowAssignClientModal(true);
                                                    }}
                                                    className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                                                >
                                                    Assign Client
                                                </button>
                                                <button
                                                    onClick={() => setExpandedKam(isExpanded ? null : kam._id)}
                                                    className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
                                                >
                                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                    {isExpanded ? 'Hide' : 'Show'}
                                                </button>
                                                <button
                                                    onClick={() => handleRevokeKamRole(kam._id)}
                                                    className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                                                >
                                                    Revoke
                                                </button>
                                            </div>
                                        </div>

                                        {/* Expanded Client List */}
                                        {isExpanded && (
                                            <div className="mt-4 ml-4 pl-4 border-l-2 border-gray-200 space-y-2">
                                                {kamAssignments.length === 0 ? (
                                                    <p className="text-sm text-gray-500 italic">No clients assigned yet</p>
                                                ) : (
                                                    kamAssignments.map((assignment) => (
                                                        <div key={assignment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                            <div>
                                                                <p className="font-medium text-gray-900">{assignment.client.fullName}</p>
                                                                <p className="text-sm text-gray-600">{assignment.client.email}</p>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    Assigned: {new Date(assignment.assignedAt).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() => handleRemoveClient(kam._id, assignment.client._id)}
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

            {/* Create KAM Modal */}
            {showCreateKamModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Create New KAM User</h3>
                            <button onClick={() => setShowCreateKamModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateKam} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    value={createKamForm.fullName}
                                    onChange={(e) => setCreateKamForm({ ...createKamForm, fullName: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    value={createKamForm.email}
                                    onChange={(e) => setCreateKamForm({ ...createKamForm, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                                <input
                                    type="password"
                                    value={createKamForm.password}
                                    onChange={(e) => setCreateKamForm({ ...createKamForm, password: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Min. 8 characters"
                                    minLength={8}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    value={createKamForm.phoneNumber}
                                    onChange={(e) => setCreateKamForm({ ...createKamForm, phoneNumber: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="+1 234 567 8900"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateKamModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    disabled={isCreating}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isCreating}
                                >
                                    {isCreating ? 'Creating...' : 'Create KAM'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Assign KAM Role Modal */}
            {showAssignRoleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Assign KAM Role to Existing User</h3>
                            <button onClick={() => setShowAssignRoleModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">Select an existing user to assign the KAM role</p>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {allUsers.filter(u => !kams.find(k => k._id === u._id)).length === 0 ? (
                                <p className="text-center text-gray-500 py-4">No available users to assign</p>
                            ) : (
                                allUsers.filter(u => !kams.find(k => k._id === u._id)).map((user) => (
                                    <div
                                        key={user._id}
                                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center transition-colors"
                                        onClick={() => handleAssignKamRole(user._id)}
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900">{user.fullName}</p>
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                        </div>
                                        <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                                            Assign
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Client Modal */}
            {showAssignClientModal && selectedKamForClient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Assign Client to {selectedKamForClient.fullName}
                            </h3>
                            <button onClick={() => {
                                setShowAssignClientModal(false);
                                setSelectedKamForClient(null);
                            }} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">Select a client to assign</p>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {getAvailableClients(selectedKamForClient._id).map((client) => (
                                <div
                                    key={client._id}
                                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center transition-colors"
                                    onClick={() => handleAssignClient(selectedKamForClient._id, client._id)}
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">{client.fullName}</p>
                                        <p className="text-sm text-gray-600">{client.email}</p>
                                        {client.company && <p className="text-xs text-gray-500">{client.company}</p>}
                                    </div>
                                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                                        Assign
                                    </button>
                                </div>
                            ))}
                            {getAvailableClients(selectedKamForClient._id).length === 0 && (
                                <p className="text-center text-gray-500 py-4">All clients are already assigned to this KAM</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
