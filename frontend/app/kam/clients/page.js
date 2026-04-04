'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { kamAPI } from '@/lib/api';
import { Building2, Mail, Briefcase } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function KAMClientsPage() {
    const router = useRouter();
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await kamAPI.getClients();
            if (response.success) {
                setClients(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch clients:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-8">
                <LoadingSpinner size="lg" message="Loading clients..." />
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Clients</h1>
                <p className="text-gray-600 mt-2">Manage your assigned client accounts</p>
            </div>

            {clients.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Clients Assigned</h3>
                    <p className="text-gray-600">Contact your admin to get client assignments.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clients.map((client) => (
                        <div key={client._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{client.fullName}</h3>
                                    {client.company && (
                                        <p className="text-sm text-gray-600 mb-2">{client.company}</p>
                                    )}
                                </div>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                    {client.activeJobsCount || 0} Jobs
                                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Mail className="w-4 h-4" />
                                    {client.email}
                                </div>
                                {client.businessDetails?.industry && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Briefcase className="w-4 h-4" />
                                        {client.businessDetails.industry}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => router.push(`/kam/clients/${client._id}`)}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded -lg hover:bg-blue-700 transition-colors"
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
