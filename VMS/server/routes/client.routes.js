const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Job = require('../models/Job');
const Profile = require('../models/Profile');

// @desc    Get client's jobs
// @route   GET /api/client/jobs
// @access  Private/Client
router.get('/jobs', protect, authorize('client'), async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: /** @type {any} */ (req).user.id })
            .sort({ createdAt: -1 });

        // Add applicant count to each job
        const jobsWithStats = await Promise.all(jobs.map(async (job) => {
            const applicantCount = await Profile.countDocuments({ job_id: job._id });
            return {
                ...job.toObject(),
                applicantCount
            };
        }));

        res.json({
            success: true,
            data: jobsWithStats
        });
    } catch (error) {
        console.error('Get client jobs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching jobs'
        });
    }
});

// @desc    Create a new job
// @route   POST /api/client/jobs/create
// @access  Private/Client
router.post('/jobs/create', protect, authorize('client'), async (req, res) => {
    try {
        // Generate unique job_id
        const jobCount = await Job.countDocuments();
        const job_id = `JOB${String(jobCount + 6716).padStart(4, '0')}`;

        const jobData = {
            ...req.body,
            job_id,
            postedBy: /** @type {any} */ (req).user.id,
            postedByRole: 'client',
            role_status: 'Pending', // Default to Pending for admin approval
            posted_date: new Date()
        };

        const job = await Job.create(jobData);

        res.status(201).json({
            success: true,
            data: job,
            message: 'Job posted successfully and pending approval'
        });
    } catch (error) {
        console.error('Create job error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating job'
        });
    }
});

// @desc    Get received CVs with job details
// @route   GET /api/client/cvs
// @access  Private/Client
router.get('/cvs', protect, authorize('client'), async (req, res) => {
    try {
        // Find all jobs posted by this client
        const clientJobs = await Job.find({ postedBy: /** @type {any} */ (req).user.id }).select('_id');
        const jobIds = clientJobs.map(job => job._id);

        // Find profiles applied to these jobs
        const cvs = await Profile.find({ job_id: { $in: jobIds } })
            .populate('job_id', 'job_title')
            .populate('uploaded_by', 'fullName email') // Recruiter details
            .sort({ createdAt: -1 });

        // Format for frontend
        const formattedCVs = cvs.map(cv => ({
            id: cv._id,
            candidateName: cv.candidate_name,
            email: cv.email,
            jobTitle: /** @type {any} */ (cv.job_id)?.job_title || 'Unknown Job',
            experience: `${cv.total_experience} years`,
            currentCompany: cv.current_company,
            expectedSalary: cv.expected_ctc,
            noticePeriod: cv.notice_period,
            cvUrl: cv.resume_url,
            status: cv.status,
            appliedDate: cv.createdAt,
            recruiterName: /** @type {any} */ (cv.uploaded_by)?.fullName || cv.uploaded_by_name || 'Unknown'
        }));

        res.json({
            success: true,
            data: formattedCVs
        });
    } catch (error) {
        console.error('Get received CVs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching CVs'
        });
    }
});

// @desc    Update CV status (Shortlist/Reject/Interview)
// @route   PUT /api/client/cv/update-status/:id
// @access  Private/Client
router.put('/cv/update-status/:id', protect, authorize('client'), async (req, res) => {
    try {
        const { status } = req.body;
        const profileId = req.params.id;

        // Verify the profile belongs to a job posted by this client
        const profile = await Profile.findById(profileId).populate('job_id');

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        if (/** @type {any} */ (profile.job_id).postedBy.toString() !== /** @type {any} */ (req).user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this profile'
            });
        }

        // Update status
        profile.status = status;

        // Add minimal history tracking if desired (could be expanded)
        if (!profile.notes) profile.notes = '';
        profile.notes += `\nStatus changed to ${status} by Client on ${new Date().toLocaleDateString()}`;

        await profile.save();

        res.json({
            success: true,
            data: profile,
            message: `Candidate status updated to ${status}`
        });
    } catch (error) {
        console.error('Update CV status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating CV status'
        });
    }
});




// @desc    Delete a job
// @route   DELETE /api/client/jobs/:id
// @access  Private/Client
router.delete('/jobs/:id', protect, authorize('client'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Ensure user owns the job
        if (job.postedBy.toString() !== /** @type {any} */ (req).user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this job'
            });
        }

        await job.deleteOne();

        res.json({
            success: true,
            message: 'Job deleted successfully'
        });
    } catch (error) {
        console.error('Delete job error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting job'
        });
    }
});

// @desc    Update a job
// @route   PUT /api/client/jobs/:id
// @access  Private/Client
router.put('/jobs/:id', protect, authorize('client'), async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Ensure user owns the job
        if (job.postedBy.toString() !== /** @type {any} */ (req).user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this job'
            });
        }

        // Update fields
        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({
            success: true,
            data: job,
            message: 'Job updated successfully'
        });
    } catch (error) {
        console.error('Update job error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating job'
        });
    }
});

module.exports = router;
