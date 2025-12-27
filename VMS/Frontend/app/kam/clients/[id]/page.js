'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { kamAPI } from '@/lib/api';
import { ArrowLeft, Mail, Building2, Phone, MapPin, Briefcase, Calendar } from 'lucide-react';

export default function ClientDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const clientId = params.id;

    const [client, setClient] = useState(null);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (clientId) {
            fetchClientDetails();
        }
    }, [clientId]);

    const fetchClientDetails = async () => {
        try {
            const response = await kamAPI.getClientById(clientId);
            if (response.success) {
                setClient(response.data.client);
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error('Failed to fetch client details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!client) {
        return (
            <div className="p-8">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Client Not Found</h2>
                    <button
                        onClick={() => router.push('/kam/clients')}
                        className="text-blue-600 hover:text-blue-700"
                    >
                        ← Back to Clients
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-6 flex items-center gap-4">
                <button
                    onClick={() => router.push('/kam/clients')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{client.fullName}</h1>
                    <p className="text-gray-600 mt-1">Client Details</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Jobs</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalJobs || 0}</p>
                        </div>
                        <Briefcase className="w-12 h-12 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Active Jobs</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.activeJobs || 0}</p>
                        </div>
                        <Briefcase className="w-12 h-12 text-green-500" />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Applications</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalApplications || 0}</p>
                        </div>
                        <Building2 className="w-12 h-12 text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Client Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="text-gray-900 font-medium">{client.email}</p>
                            </div>
                        </div>

                        {client.phoneNumber && (
                            <div className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-600">Phone</p>
                                    <p className="text-gray-900 font-medium">{client.phoneNumber}</p>
                                </div>
                            </div>
                        )}

                        {client.company && (
                            <div className="flex items-start gap-3">
                                <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-600">Company</p>
                                    <p className="text-gray-900 font-medium">{client.company}</p>
                                </div>
                            </div>
                        )}

                        {client.location?.city && (
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-600">Location</p>
                                    <p className="text-gray-900 font-medium">
                                        {[client.location.city, client.location.state, client.location.country]
                                            .filter(Boolean)
                                            .join(', ')}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-600">Member Since</p>
                                <p className="text-gray-900 font-medium">
                                    {new Date(client.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Business Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Information</h2>
                    <div className="space-y-4">
                        {client.businessDetails?.industry && (
                            <div>
                                <p className="text-sm text-gray-600">Industry</p>
                                <p className="text-gray-900 font-medium">{client.businessDetails.industry}</p>
                            </div>
                        )}

                        {client.businessDetails?.type && (
                            <div>
                                <p className="text-sm text-gray-600">Business Type</p>
                                <p className="text-gray-900 font-medium capitalize">{client.businessDetails.type}</p>
                            </div>
                        )}

                        {client.businessDetails?.size && (
                            <div>
                                <p className="text-sm text-gray-600">Company Size</p>
                                <p className="text-gray-900 font-medium">{client.businessDetails.size} employees</p>
                            </div>
                        )}

                        {client.financials?.budget && (
                            <div>
                                <p className="text-sm text-gray-600">Budget Range</p>
                                <p className="text-gray-900 font-medium">{client.financials.budget}</p>
                            </div>
                        )}

                        <div>
                            <p className="text-sm text-gray-600">Account Status</p>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${client.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                                }`}>
                                {client.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600">Profile Status</p>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${client.profileCompleted
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                {client.profileCompleted ? 'Complete' : 'Incomplete'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 flex flex-wrap gap-4">
                <button
                    onClick={() => router.push(`/kam/clients/${clientId}/post-job`)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                    📝 Post Job for Client
                </button>
                <button
                    onClick={() => router.push(`/kam/jobs?clientId=${clientId}`)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    View Client Jobs
                </button>
                <button
                    onClick={() => router.push(`/kam/cvs?clientId=${clientId}`)}
                    className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    View CVs for Client
                </button>
            </div>
        </div>
    );
}
