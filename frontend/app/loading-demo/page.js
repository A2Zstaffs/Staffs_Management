'use client';

import { useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import LoadingSkeleton from '@/components/LoadingSkeleton';

/**
 * Demo page showcasing all loading states
 * Navigate to /loading-demo to view this page
 */
export default function LoadingDemoPage() {
    const [activeDemo, setActiveDemo] = useState('all');

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Loading States Demo
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Preview all available loading components and their variants
                    </p>
                </div>

                {/* Navigation */}
                <div className="flex justify-center gap-3 mb-12 flex-wrap">
                    {['all', 'spinners', 'skeletons'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveDemo(tab)}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${activeDemo === tab
                                    ? 'bg-primary-600 text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Spinner Variants */}
                {(activeDemo === 'all' || activeDemo === 'spinners') && (
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">LoadingSpinner Variants</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Logo Variant */}
                            <div className="bg-white rounded-xl p-8 shadow-md">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Logo (Brand)</h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    Best for: Full-page loads, dashboards, initial app loading
                                </p>
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8">
                                    <LoadingSpinner
                                        variant="logo"
                                        size="lg"
                                        message="Loading your dashboard..."
                                    />
                                </div>
                            </div>

                            {/* Spinner Variant */}
                            <div className="bg-white rounded-xl p-8 shadow-md">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Spinner (Default)</h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    Best for: General loading, API calls, form submissions
                                </p>
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8">
                                    <LoadingSpinner
                                        variant="spinner"
                                        size="lg"
                                        message="Processing your request..."
                                    />
                                </div>
                            </div>

                            {/* Dots Variant */}
                            <div className="bg-white rounded-xl p-8 shadow-md">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Dots</h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    Best for: Inline loading, subtle actions, button states
                                </p>
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8">
                                    <LoadingSpinner
                                        variant="dots"
                                        message="Saving changes..."
                                    />
                                </div>
                            </div>

                            {/* Pulse Variant */}
                            <div className="bg-white rounded-xl p-8 shadow-md">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Pulse</h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    Best for: Minimal loading states, status indicators
                                </p>
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8">
                                    <LoadingSpinner
                                        variant="pulse"
                                        size="md"
                                        message="Syncing..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Size Comparison */}
                        <div className="mt-8 bg-white rounded-xl p-8 shadow-md">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6">Size Variants</h3>
                            <div className="flex items-end justify-around gap-4">
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 mb-3">Small</p>
                                    <LoadingSpinner variant="spinner" size="sm" message="" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 mb-3">Medium</p>
                                    <LoadingSpinner variant="spinner" size="md" message="" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 mb-3">Large</p>
                                    <LoadingSpinner variant="spinner" size="lg" message="" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 mb-3">Extra Large</p>
                                    <LoadingSpinner variant="spinner" size="xl" message="" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Skeleton Variants */}
                {(activeDemo === 'all' || activeDemo === 'skeletons') && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">LoadingSkeleton Variants</h2>

                        {/* Card Skeleton */}
                        <div className="mb-8 bg-white rounded-xl p-8 shadow-md">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Card Skeleton</h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Best for: Job listings, content cards, product cards
                            </p>
                            <LoadingSkeleton type="card" count={3} />
                        </div>

                        {/* Stats Skeleton */}
                        <div className="mb-8 bg-white rounded-xl p-8 shadow-md">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Stats Skeleton</h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Best for: Dashboard statistics, metrics cards
                            </p>
                            <LoadingSkeleton type="stats" count={4} />
                        </div>

                        {/* List Skeleton */}
                        <div className="mb-8 bg-white rounded-xl p-8 shadow-md">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">List Skeleton</h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Best for: User lists, notification feeds, activity logs
                            </p>
                            <div className="border rounded-lg overflow-hidden">
                                <LoadingSkeleton type="list" count={5} />
                            </div>
                        </div>

                        {/* Table Skeleton */}
                        <div className="mb-8 bg-white rounded-xl p-8 shadow-md">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Table Skeleton</h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Best for: Data tables, spreadsheets, tabular data
                            </p>
                            <div className="border rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <LoadingSkeleton type="table" count={4} />
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Code Examples */}
                <div className="mt-12 bg-gray-900 rounded-xl p-8 text-white">
                    <h2 className="text-2xl font-bold mb-4">Quick Usage Guide</h2>
                    <div className="space-y-4 text-sm font-mono">
                        <div>
                            <p className="text-gray-400 mb-2">// LoadingSpinner - Logo variant</p>
                            <code className="text-green-400">
                                {'<LoadingSpinner variant="logo" size="xl" message="Loading..." fullScreen />'}
                            </code>
                        </div>
                        <div>
                            <p className="text-gray-400 mb-2">// LoadingSkeleton - Cards</p>
                            <code className="text-green-400">
                                {'<LoadingSkeleton type="card" count={6} />'}
                            </code>
                        </div>
                        <div>
                            <p className="text-gray-400 mb-2">// LoadingSkeleton - Stats</p>
                            <code className="text-green-400">
                                {'<LoadingSkeleton type="stats" count={4} />'}
                            </code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
