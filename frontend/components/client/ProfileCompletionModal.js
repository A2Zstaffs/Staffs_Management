'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function ProfileCompletionModal({ isOpen, onClose, onComplete }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        phoneNumber: '',
        company: '',
        businessType: '',
        businessSize: '',
        industry: '',
        budget: '',
        country: '',
        city: '',
        state: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Check sessionStorage first (default), then localStorage (rememberMe)
            const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

            const profileData = {
                phoneNumber: formData.phoneNumber,
                company: formData.company,
                businessDetails: {
                    type: formData.businessType,
                    size: formData.businessSize,
                    industry: formData.industry
                },
                financials: {
                    budget: formData.budget
                },
                location: {
                    country: formData.country,
                    city: formData.city,
                    state: formData.state
                },
                profileCompleted: true
            };

            const response = await fetch(`${apiUrl}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update profile');
            }

            if (data.success) {
                onComplete();
            } else {
                setError(data.message || 'Failed to update profile');
            }
        } catch (err) {
            console.error('Profile update error:', err);
            setError(err.message || 'An error occurred while updating your profile');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-[#1A73FF] to-[#0047CC] text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Complete Your Profile</h2>
                            <p className="text-blue-100 text-sm mt-1">Please provide additional information to get started</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Contact Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="+1234567890"
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Business Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Business Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">
                                    Company Name *
                                </label>
                                <input
                                    type="text"
                                    id="company"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    placeholder="Your company name"
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="businessType" className="block text-sm font-medium text-slate-700 mb-2">
                                    Business Type *
                                </label>
                                <select
                                    id="businessType"
                                    name="businessType"
                                    value={formData.businessType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                                    required
                                >
                                    <option value="">Select type</option>
                                    <option value="startup">Startup</option>
                                    <option value="small-business">Small Business</option>
                                    <option value="enterprise">Enterprise</option>
                                    <option value="non-profit">Non-Profit</option>
                                    <option value="government">Government</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="businessSize" className="block text-sm font-medium text-slate-700 mb-2">
                                    Business Size *
                                </label>
                                <select
                                    id="businessSize"
                                    name="businessSize"
                                    value={formData.businessSize}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                                    required
                                >
                                    <option value="">Select size</option>
                                    <option value="1-10">1-10 employees</option>
                                    <option value="11-50">11-50 employees</option>
                                    <option value="51-200">51-200 employees</option>
                                    <option value="201-500">201-500 employees</option>
                                    <option value="500+">500+ employees</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="industry" className="block text-sm font-medium text-slate-700 mb-2">
                                    Industry *
                                </label>
                                <input
                                    type="text"
                                    id="industry"
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    placeholder="e.g., Technology, Healthcare"
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="budget" className="block text-sm font-medium text-slate-700 mb-2">
                                    Hiring Budget *
                                </label>
                                <select
                                    id="budget"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                                    required
                                >
                                    <option value="">Select budget</option>
                                    <option value="<10k">&lt;$10k</option>
                                    <option value="10k-50k">$10k-$50k</option>
                                    <option value="50k-100k">$50k-$100k</option>
                                    <option value="100k-500k">$100k-$500k</option>
                                    <option value="500k+">$500k+</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Location Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Location</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="country" className="block text-sm font-medium text-slate-700 mb-2">
                                    Country *
                                </label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    placeholder="e.g., USA"
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-2">
                                    City
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="e.g., New York"
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="state" className="block text-sm font-medium text-slate-700 mb-2">
                                    State/Province
                                </label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="e.g., NY"
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2.5 bg-gradient-to-r from-[#1A73FF] to-[#0047CC] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Saving...' : 'Complete Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
