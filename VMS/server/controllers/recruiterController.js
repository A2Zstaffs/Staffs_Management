const Application = require('../models/Application');
const Profile = require('../models/Profile');

/**
 * @desc    Get recruiter submissions (optimized for track-status page)
 * @route   GET /api/dashboard/recruiter/submissions
 * @access  Private (Recruiter)
 */
const getSubmissions = async (req, res) => {
    try {
        const recruiterId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        console.log(`📊 [getSubmissions] Fetching for recruiter: ${recruiterId}`);
        const startTime = Date.now();

        // Run both queries in parallel for better performance
        const [applications, profiles] = await Promise.all([
            // Query 1: Applications submitted by this recruiter
            Application.find({ recruiter: recruiterId })
                .populate('candidate', 'fullName email') // Only fields we need
                .populate({
                    path: 'job',
                    select: 'title postedBy',
                    populate: {
                        path: 'postedBy',
                        select: 'company'
                    }
                })
                .select('status createdAt') // Only fields we need
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(), // Use lean() for faster reads

            // Query 2: Profiles uploaded by this recruiter
            Profile.find({ uploaded_by: recruiterId })
                .populate('job_id', 'job_title company_name')
                .select('candidate_name email status createdAt')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean()
        ]);

        // Format data on server side to reduce frontend processing
        const submissions = [
            ...applications.map(app => {
                // Cast populated fields (TypeScript doesn't understand Mongoose populate)
                const candidate = /** @type {any} */ (app.candidate);
                const job = /** @type {any} */ (app.job);
                return {
                    id: app._id,
                    name: candidate?.fullName || 'Unknown',
                    email: candidate?.email || 'N/A',
                    jobTitle: job?.title || 'N/A',
                    company: job?.postedBy?.company || 'N/A',
                    status: app.status,
                    date: app.createdAt,
                    type: 'Application'
                };
            }),
            ...profiles.map(p => {
                const job = /** @type {any} */ (p.job_id);
                return {
                    id: p._id,
                    name: p.candidate_name || 'Unknown',
                    email: p.email || 'N/A',
                    jobTitle: job?.job_title || 'N/A',
                    company: job?.company_name || 'N/A',
                    status: p.status,
                    date: p.createdAt,
                    type: 'Uploaded Profile'
                };
            })
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // Calculate stats
        const stats = {
            total: submissions.length,
            shortlisted: submissions.filter(s =>
                ['shortlisted', 'interview_scheduled'].includes(s.status?.toLowerCase())
            ).length,
            interview: submissions.filter(s =>
                ['interview_scheduled', 'interviewed'].includes(s.status?.toLowerCase())
            ).length,
            hired: submissions.filter(s =>
                ['hired', 'placed', 'joined', 'selected'].includes(s.status?.toLowerCase())
            ).length,
            rejected: submissions.filter(s =>
                ['rejected'].includes(s.status?.toLowerCase())
            ).length
        };

        const duration = Date.now() - startTime;
        console.log(`✅ [getSubmissions] Completed in ${duration}ms - Found ${submissions.length} submissions`);

        res.status(200).json({
            success: true,
            data: {
                submissions,
                stats,
                pagination: {
                    page,
                    limit,
                    total: submissions.length
                }
            }
        });
    } catch (error) {
        console.error('❌ [getSubmissions] Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch submissions',
            error: error.message
        });
    }
};

module.exports = {
    getSubmissions
};
