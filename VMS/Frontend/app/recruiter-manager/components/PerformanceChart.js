'use client';

export default function PerformanceChart({ recruiters }) {
    if (!recruiters || recruiters.length === 0) {
        return (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Performance</h3>
                <p className="text-gray-500 text-center py-8">No data available</p>
            </div>
        );
    }

    // Calculate max value for scaling
    const maxProfiles = Math.max(...recruiters.map(r => r.profileCount || 0));

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Team Performance Overview</h3>

            {/* Simple Bar Chart */}
            <div className="space-y-4">
                {recruiters.map((recruiter, index) => {
                    const profileCount = recruiter.profileCount || 0;
                    const barWidth = maxProfiles > 0 ? (profileCount / maxProfiles) * 100 : 0;

                    return (
                        <div key={recruiter._id || index} className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-gray-700">{recruiter.fullName}</span>
                                <span className="text-gray-600">{profileCount} profiles</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500"
                                    style={{ width: `${barWidth}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4">
                <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{recruiters.length}</p>
                    <p className="text-xs text-gray-500">Total Recruiters</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                        {recruiters.reduce((sum, r) => sum + (r.profileCount || 0), 0)}
                    </p>
                    <p className="text-xs text-gray-500">Total Profiles</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                        {Math.round(recruiters.reduce((sum, r) => sum + (r.profileCount || 0), 0) / recruiters.length) || 0}
                    </p>
                    <p className="text-xs text-gray-500">Avg per Recruiter</p>
                </div>
            </div>
        </div>
    );
}
