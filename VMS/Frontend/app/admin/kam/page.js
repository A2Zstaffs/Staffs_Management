'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminAPI } from '@/lib/api';
import { Users, UserCheck, Building2, ChevronDown, ChevronUp, Plus, X } from 'lucide-react';

export default function KAMManagementPage() {
    const [activeTab, setActiveTab] = useState('kams'); // 'kams' or 'assignments'
    const [kams, setKams] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [allClients, setAllClients] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [expandedKam, setExpandedKam] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modals
    const [showAssignRoleModal, setShowAssignRoleModal] = useState(false);
    const [showAssignClientModal, setShowAssignClientModal] = useState(false);
    const [showCreateKamModal, setShowCreateKamModal] = useState(false);
    const [selectedKamForClient, setSelectedKamForClient] = useState(null);

    // Form data for creating new KAM
    const [kamFormData, setKamFormData] = useState({
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

    const handleCreateKam = async (e) => {
        e.preventDefault();

        // Validate form
        if (!kamFormData.fullName || !kamFormData.email || !kamFormData.password) {
            alert('Please fill in all required fields (Full Name, Email, Password)');
            return;
        }

        try {
            const response = await adminAPI.createKam(kamFormData);
            if (response.success) {
                await fetchData();
                setShowCreateKamModal(false);
                // Reset form
                setKamFormData({
                    fullName: '',
                    email: '',
                    password: '',
                    phoneNumber: ''
                });
                alert('KAM account created successfully!');
            }
        } catch (err) {
            alert('Error creating KAM account: ' + err.message);
        }
    };

    return (
        <div className="">
            <main className="p-4 lg:p-8">
                {/* Header */}
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-secondary-900 text-2xl font-bold">KAM Management</h2>
                        <p className="text-secondary-600">Manage Key Account Managers and client assignments</p>
                    </div>
                    <Link href="/admin" className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-secondary-700 hover:bg-gray-50 transition-colors">
                        ← Back
                    </Link>
                </div>

                {/* Tabs */}
                <div className="mb-6 flex gap-2 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('kams')}
                        className={`px-6 py-3 font-medium transition-colors ${activeTab === 'kams'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-secondary-600 hover:text-secondary-900'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <UserCheck className="w-5 h-5" />
                            KAM Users ({kams.length})
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
                            <Building2 className="w-5 h-5" />
                            Client Assignments ({assignments.length})
                        </div>
                    </button>
                </div>

                {isLoading ? (
                    <div className="p-8 text-center text-secondary-600">Loading...</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-600">{error}</div>
                ) : (
                    <>
                        {/* KAM Users Tab */}
                        {activeTab === 'kams' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-secondary-900">Key Account Managers</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowCreateKamModal(true)}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Create New KAM
                                        </button>
                                        <button
                                            onClick={() => setShowAssignRoleModal(true)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Assign KAM Role
                                        </button>
                                    </div>
                                </div>

                                <div className="rounded-xl bg-white/50 backdrop-blur-md border border-white/60 shadow-xl overflow-hidden">
                                    {kams.length === 0 ? (
                                        <div className="p-8 text-center text-secondary-500">
                                            No KAMs assigned yet. Click "Assign KAM Role" to create one.
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-200">
                                            {kams.map((kam) => {
                                                const kamAssignments = getKamAssignments(kam._id);
                                                const isExpanded = expandedKam === kam._id;

                                                return (
                                                    <div key={kam._id} className="p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3">
                                                                    <div>
                                                                        <h4 className="font-semibold text-secondary-900">{kam.fullName}</h4>
                                                                        <p className="text-sm text-secondary-600">{kam.email}</p>
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
                                                                    className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                >
                                                                    Assign Client
                                                                </button>
                                                                <button
                                                                    onClick={() => setExpandedKam(isExpanded ? null : kam._id)}
                                                                    className="px-3 py-1 text-sm text-secondary-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
                                                                >
                                                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                                    {isExpanded ? 'Hide' : 'Show'} Clients
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRevokeKamRole(kam._id)}
                                                                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                >
                                                                    Revoke Role
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Expanded Client List */}
                                                        {isExpanded && (
                                                            <div className="mt-4 ml-4 pl-4 border-l-2 border-gray-200 space-y-2">
                                                                {kamAssignments.length === 0 ? (
                                                                    <p className="text-sm text-secondary-500">No clients assigned yet</p>
                                                                ) : (
                                                                    kamAssignments.map((assignment) => (
                                                                        <div key={assignment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                                            <div>
                                                                                <p className="font-medium text-secondary-900">{assignment.client.fullName}</p>
                                                                                <p className="text-sm text-secondary-600">{assignment.client.email}</p>
                                                                                <p className="text-xs text-secondary-500">
                                                                                    Assigned: {new Date(assignment.assignedAt).toLocaleDateString()}
                                                                                </p>
                                                                            </div>
                                                                            <button
                                                                                onClick={() => handleRemoveClient(kam._id, assignment.client._id)}
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
                                            <th className="p-4 text-left text-sm font-semibold text-secondary-600">KAM</th>
                                            <th className="p-4 text-left text-sm font-semibold text-secondary-600">Client</th>
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
                                                        <p className="font-medium text-secondary-900">{assignment.kam.fullName}</p>
                                                        <p className="text-sm text-secondary-600">{assignment.kam.email}</p>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div>
                                                        <p className="font-medium text-secondary-900">{assignment.client.fullName}</p>
                                                        <p className="text-sm text-secondary-600">{assignment.client.email}</p>
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
                                                        onClick={() => handleRemoveClient(assignment.kam._id, assignment.client._id)}
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

                {/* Assign KAM Role Modal */}
                {showAssignRoleModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-secondary-900">Assign KAM Role</h3>
                                <button onClick={() => setShowAssignRoleModal(false)} className="text-secondary-400 hover:text-secondary-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <p className="text-sm text-secondary-600 mb-4">Select a user to assign the KAM role</p>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {allUsers.filter(u => !kams.find(k => k._id === u._id)).map((user) => (
                                    <div
                                        key={user._id}
                                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                                        onClick={() => handleAssignKamRole(user._id)}
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

                {/* Assign Client Modal */}
                {showAssignClientModal && selectedKamForClient && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-secondary-900">
                                    Assign Client to {selectedKamForClient.fullName}
                                </h3>
                                <button onClick={() => {
                                    setShowAssignClientModal(false);
                                    setSelectedKamForClient(null);
                                }} className="text-secondary-400 hover:text-secondary-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <p className="text-sm text-secondary-600 mb-4">Select a client to assign</p>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {getAvailableClients(selectedKamForClient._id).map((client) => (
                                    <div
                                        key={client._id}
                                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                                        onClick={() => handleAssignClient(selectedKamForClient._id, client._id)}
                                    >
                                        <div>
                                            <p className="font-medium text-secondary-900">{client.fullName}</p>
                                            <p className="text-sm text-secondary-600">{client.email}</p>
                                            {client.company && <p className="text-xs text-secondary-500">{client.company}</p>}
                                        </div>
                                        <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                                            Assign
                                        </button>
                                    </div>
                                ))}
                                {getAvailableClients(selectedKamForClient._id).length === 0 && (
                                    <p className="text-center text-secondary-500 py-4">All clients are already assigned to this KAM</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Create New KAM Modal */}
                {showCreateKamModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-secondary-900">Create New KAM Account</h3>
                                <button
                                    onClick={() => {
                                        setShowCreateKamModal(false);
                                        setKamFormData({
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
                            <form onSubmit={handleCreateKam} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={kamFormData.fullName}
                                        onChange={(e) => setKamFormData({ ...kamFormData, fullName: e.target.value })}
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
                                        value={kamFormData.email}
                                        onChange={(e) => setKamFormData({ ...kamFormData, email: e.target.value })}
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
                                        value={kamFormData.password}
                                        onChange={(e) => setKamFormData({ ...kamFormData, password: e.target.value })}
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
                                        value={kamFormData.phoneNumber}
                                        onChange={(e) => setKamFormData({ ...kamFormData, phoneNumber: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter phone number (optional)"
                                    />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCreateKamModal(false);
                                            setKamFormData({
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
                                        Create KAM
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
