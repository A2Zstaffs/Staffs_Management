const User = require('../models/User');
const RecruiterAssignment = require('../models/RecruiterAssignment');
const Profile = require('../models/Profile');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get Recruiter Manager dashboard stats
// @route   GET /api/recruiter-manager/dashboard
// @access  Recruiter Manager only
exports.getDashboard = async (req, res, next) => {
    try {
        const rmId = req.user._id;

        // Get assigned recruiters
        const assignments = await RecruiterAssignment.find({
            recruiterManager: rmId,
            isActive: true
        }).populate('recruiter', 'fullName email');

        const recruiterIds = assignments.map(a => a.recruiter._id);

        // Get stats
        const totalRecruiters = recruiterIds.length;
        const totalProfiles = await Profile.countDocuments({
            uploaded_by: { $in: recruiterIds }
        });
        const activeJobs = await Job.countDocuments({
            role_status: 'Active'
        });
        const totalApplications = await Profile.countDocuments({
            uploaded_by: { $in: recruiterIds },
            status: { $ne: 'Available' }
        });

        // Get profile count per recruiter using aggregation
        const profileCounts = await Profile.aggregate([
            {
                $match: {
                    uploaded_by: { $in: recruiterIds }
                }
            },
            {
                $group: {
                    _id: '$uploaded_by',
                    profileCount: { $sum: 1 }
                }
            }  
        ]);

        // Create a map for quick lookup
        const profileCountMap = {};
        profileCounts.forEach(pc => {
            profileCountMap[pc._id.toString()] = pc.profileCount;
        });

        res.status(200).json({
            success: true,
            data: {
                totalRecruiters,
                totalProfiles,
                activeJobs,
                totalApplications,
                recruiters: assignments.map(a => ({
                    ...a.recruiter.toObject(),
                    assignedAt: a.assignedAt,
                    profileCount: profileCountMap[a.recruiter._id.toString()] || 0
                }))
            }
        });
    } catch (error) {
        console.error('Error getting Recruiter Manager dashboard:', error);
        next(error);
    }
};

// @desc    Get recruiters assigned to logged-in Recruiter Manager
// @route   GET /api/recruiter-manager/recruiters
// @access  Recruiter Manager only
exports.getAssignedRecruiters = async (req, res, next) => {
    try {
        const rmId = req.user._id;

        const assignments = await RecruiterAssignment.find({
            recruiterManager: rmId,
            isActive: true
        })
            .populate('recruiter', 'fullName email company phoneNumber')
            .populate('assignedBy', 'fullName email')
            .sort({ assignedAt: -1 });

        // Get profile counts for each recruiter
        const recruitersWithStats = await Promise.all(
            assignments.map(async (assignment) => {
                const profileCount = await Profile.countDocuments({
                    uploaded_by: assignment.recruiter._id
                });
                const applicationCount = await Profile.countDocuments({
                    uploaded_by: assignment.recruiter._id,
                    status: { $ne: 'Available' }
                });

                return {
                    ...assignment.toObject(),
                    recruiter: {
                        ...assignment.recruiter.toObject(),
                        profileCount,
                        applicationCount
                    }
                };
            })
        );

        res.status(200).json({
            success: true,
            count: recruitersWithStats.length,
            data: recruitersWithStats
        });
    } catch (error) {
        console.error('Error getting assigned recruiters:', error);
        next(error);
    }
};

// @desc    Get specific recruiter details
// @route   GET /api/recruiter-manager/recruiters/:id
// @access  Recruiter Manager only
exports.getRecruiterById = async (req, res, next) => {
    try {
        const rmId = req.user._id;
        const recruiterId = req.params.id;

        // Verify RM has access to this recruiter
        const hasAccess = await RecruiterAssignment.hasRecruiterAccess(rmId, recruiterId);
        if (!hasAccess) {
            return res.status(403).json({
                success: false,
                message: 'You do not have access to this recruiter'
            });
        }

        const recruiter = await User.findById(recruiterId).select('-password');
        if (!recruiter) {
            return res.status(404).json({
                success: false,
                message: 'Recruiter not found'
            });
        }

        // Get recruiter stats
        const profileCount = await Profile.countDocuments({ uploaded_by: recruiterId });
        const applicationCount = await Profile.countDocuments({
            uploaded_by: recruiterId,
            status: { $ne: 'Available' }
        });

        res.status(200).json({
            success: true,
            data: {
                ...recruiter.toObject(),
                profileCount,
                applicationCount
            }
        });
    } catch (error) {
        console.error('Error getting recruiter details:', error);
        next(error);
    }
};

// @desc    Get all jobs (Recruiter Manager has access to all jobs like a recruiter)
// @route   GET /api/recruiter-manager/jobs
// @access  Recruiter Manager only
exports.getJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find({ role_status: 'Active' })
            .populate('postedBy', 'fullName email company')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        console.error('Error getting jobs:', error);
        next(error);
    }
};

// @desc    Get profiles uploaded by assigned recruiters
// @route   GET /api/recruiter-manager/profiles
// @access  Recruiter Manager only
exports.getProfiles = async (req, res, next) => {
    try {
        const rmId = req.user._id;

        // Get assigned recruiter IDs
        const recruiterIds = await RecruiterAssignment.getActiveRecruitersForRM(rmId);
        const recruiterIdArray = recruiterIds.map(r => r._id);

        const profiles = await Profile.find({
            uploaded_by: { $in: recruiterIdArray }
        })
            .populate('uploaded_by', 'fullName email')
            .populate('job_id', 'job_title company_name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: profiles.length,
            data: profiles
        });
    } catch (error) {
        console.error('Error getting profiles:', error);
        next(error);
    }
};

// @desc    Get applications by assigned recruiters
// @route   GET /api/recruiter-manager/applications
// @access  Recruiter Manager only
exports.getApplications = async (req, res, next) => {
    try {
        const rmId = req.user._id;

        // Get assigned recruiter IDs
        const recruiterIds = await RecruiterAssignment.getActiveRecruitersForRM(rmId);
        const recruiterIdArray = recruiterIds.map(r => r._id);

        const applications = await Profile.find({
            uploaded_by: { $in: recruiterIdArray },
            status: { $ne: 'Available' }
        })
            .populate('uploaded_by', 'fullName email')
            .populate('job_id', 'job_title company_name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        console.error('Error getting applications:', error);
        next(error);
    }
};
