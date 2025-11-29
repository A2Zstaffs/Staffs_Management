const Job = require('../models/Job');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Public (for now, or Protected)
exports.createJob = async (req, res, next) => {
    try {
        const job = await Job.create(req.body);
        res.status(201).json({
            success: true,
            data: job
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (err) {
        next(err);
    }
};
