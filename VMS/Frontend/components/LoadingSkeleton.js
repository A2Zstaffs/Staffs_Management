'use client';

import React from 'react';

/**
 * LoadingSkeleton Component
 * 
 * Provides skeleton loading states for different content types:
 * - 'card': Job card or general card skeleton
 * - 'stats': Dashboard stats skeleton
 * - 'table': Table row skeleton
 * - 'list': List item skeleton
 */

export default function LoadingSkeleton({ type = 'card', count = 3 }) {
    const skeletonBase = "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse";

    // Job Card Skeleton
    const CardSkeleton = () => (
        <div className="bg-white rounded-lg border border-secondary-100 p-6 space-y-4">
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 flex-1">
                    <div className={`w-10 h-10 rounded ${skeletonBase}`}></div>
                    <div className="flex-1 space-y-2">
                        <div className={`h-4 ${skeletonBase} rounded w-3/4`}></div>
                        <div className={`h-3 ${skeletonBase} rounded w-1/2`}></div>
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <div className={`h-3 ${skeletonBase} rounded w-2/3`}></div>
                <div className={`h-3 ${skeletonBase} rounded w-1/2`}></div>
                <div className={`h-3 ${skeletonBase} rounded w-3/4`}></div>
            </div>
            <div className="flex justify-between items-center pt-2">
                <div className={`h-3 ${skeletonBase} rounded w-1/4`}></div>
                <div className={`h-8 ${skeletonBase} rounded w-24`}></div>
            </div>
        </div>
    );

    // Stats Card Skeleton
    const StatsSkeleton = () => (
        <div className="bg-white rounded-xl border border-secondary-200 p-5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${skeletonBase} w-12 h-12`}></div>
                <div className={`h-6 ${skeletonBase} rounded w-16`}></div>
            </div>
            <div className="space-y-2">
                <div className={`h-8 ${skeletonBase} rounded w-20`}></div>
                <div className={`h-4 ${skeletonBase} rounded w-32`}></div>
            </div>
        </div>
    );

    // Table Row Skeleton
    const TableSkeleton = () => (
        <tr className="border-b border-gray-100">
            <td className="px-6 py-4">
                <div className={`h-4 ${skeletonBase} rounded w-32`}></div>
            </td>
            <td className="px-6 py-4">
                <div className={`h-4 ${skeletonBase} rounded w-24`}></div>
            </td>
            <td className="px-6 py-4">
                <div className={`h-4 ${skeletonBase} rounded w-20`}></div>
            </td>
            <td className="px-6 py-4">
                <div className={`h-8 ${skeletonBase} rounded w-20`}></div>
            </td>
        </tr>
    );

    // List Item Skeleton
    const ListSkeleton = () => (
        <div className="flex items-center space-x-4 p-4 border-b border-gray-100">
            <div className={`w-12 h-12 rounded-full ${skeletonBase}`}></div>
            <div className="flex-1 space-y-2">
                <div className={`h-4 ${skeletonBase} rounded w-3/4`}></div>
                <div className={`h-3 ${skeletonBase} rounded w-1/2`}></div>
            </div>
        </div>
    );

    const renderSkeleton = () => {
        switch (type) {
            case 'stats':
                return <StatsSkeleton />;
            case 'table':
                return <TableSkeleton />;
            case 'list':
                return <ListSkeleton />;
            case 'card':
            default:
                return <CardSkeleton />;
        }
    };

    // For table type, return ONLY tbody (parent already has <table>)
    if (type === 'table') {
        return (
            <tbody>
                {Array.from({ length: count }).map((_, i) => (
                    <React.Fragment key={i}>{renderSkeleton()}</React.Fragment>
                ))}
            </tbody>
        );
    }

    // For stats, use grid layout
    if (type === 'stats') {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i}>{renderSkeleton()}</div>
                ))}
            </div>
        );
    }

    // For cards, use grid layout
    if (type === 'card') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i}>{renderSkeleton()}</div>
                ))}
            </div>
        );
    }

    // For lists, use simple stacking
    return (
        <div className="space-y-0">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i}>{renderSkeleton()}</div>
            ))}
        </div>
    );
}
