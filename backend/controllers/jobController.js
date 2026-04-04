const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Protected (Client only)
exports.createJob = async (req, res, next) => {
    try {
        // Check if user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Get client details
        const client = await User.findById(req.user.id);
        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Generate unique job_id
        const jobCount = await Job.countDocuments();
        const job_id = `JOB${String(jobCount + 6716).padStart(4, '0')}`; // Starting from 6716 as per your mock data

        // Prepare job data
        const jobData = {
            ...req.body,
            job_id,
            postedBy: req.user.id,
            postedByRole: req.user.role || 'client',
            company_name: req.body.company_name || client.company || 'Company Name',
            posted_date: new Date(),
            role_status: 'Pending' // Force pending status for new jobs
        };

        const job = await Job.create(jobData);

        res.status(201).json({
            success: true,
            data: job,
            message: 'Job posted successfully'
        });
    } catch (err) {
        console.error('Job creation error:', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Failed to create job'
        });
    }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res, next) => {
    try {
        // Only return Active jobs - recruiters should only see approved jobs
        const jobs = await Job.find({ role_status: 'Active' })
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (err) {
        next(err);
    }
};
