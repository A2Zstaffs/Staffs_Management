const express = require('express');
const router = express.Router();
const { protect, authorizeAdmin } = require('../middleware/auth');
const User = require('../models/User');
const Job = require('../models/Job');
const Profile = require('../models/Profile');
const ClientAssignment = require('../models/ClientAssignment');
const RecruiterAssignment = require('../models/RecruiterAssignment');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', protect, authorizeAdmin, async (req, res) => {
    try {
        const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
        const totalClients = await User.countDocuments({ role: 'client' });
        const activeJobs = await Job.countDocuments({ role_status: 'Active' });
        const totalProfiles = await Profile.countDocuments();

        // Calculate Pipeline Value (Total Jobs Value) - Potential Revenue
        // Logic: Sum of (Max Commission * Number of Positions) for all Active jobs
        const activeJobsData = await Job.find({ role_status: 'Active' }).select('commission_amount_max num_positions');

        const pipelineValue = activeJobsData.reduce((sum, job) => {
            const commission = job.commission_amount_max || 0;
            const positions = job.num_positions || 1;
            return sum + (commission * positions);
        }, 0);

        res.json({
            success: true,
            data: {
                totalRecruiters,
                totalClients,
                activeJobs,
                totalProfiles,
                pipelineValue // Replaces monthlyRevenue
            }
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching admin stats'
        });
    }
});

// @desc    Get all recruiters
// @route   GET /api/admin/recruiters
// @access  Private/Admin
router.get('/recruiters', protect, authorizeAdmin, async (req, res) => {
    try {
        const recruiters = await User.find({ role: 'recruiter' })
            .select('-password')
            .sort({ createdAt: -1 });

        // Get profile counts and Recruiter Manager assignments for each recruiter
        const recruitersWithStats = await Promise.all(
            recruiters.map(async (recruiter) => {
                const profileCount = await Profile.countDocuments({ uploaded_by: recruiter._id });

                // Get assigned Recruiter Manager for this recruiter
                const rmAssignment = await RecruiterAssignment.findOne({
                    recruiter: recruiter._id,
                    isActive: true
                }).populate('recruiterManager', 'fullName email');

                return {
                    ...recruiter.toObject(),
                    profileCount,
                    assignedRM: rmAssignment ? {
                        _id: rmAssignment.recruiterManager._id,
                        fullName: /** @type {any} */ (rmAssignment.recruiterManager).fullName,
                        email: /** @type {any} */ (rmAssignment.recruiterManager).email,
                        assignedAt: rmAssignment.assignedAt
                    } : null
                };
            })
        );

        res.json({
            success: true,
            count: recruitersWithStats.length,
            data: recruitersWithStats
        });
    } catch (error) {
        console.error('Get recruiters error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching recruiters'
        });
    }
});

// @desc    Get all users (for KAM role assignment)
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, authorizeAdmin, async (req, res) => {
    try {
        // Get all users except admins and existing KAMs
        const users = await User.find({
            role: { $in: ['recruiter', 'candidate', 'client', 'consultancy'] }
        })
            .select('-password')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users'
        });
    }
});

// @desc    Get all clients
// @route   GET /api/admin/clients
// @access  Private/Admin
router.get('/clients', protect, authorizeAdmin, async (req, res) => {
    try {
        const clients = await User.find({ role: 'client' })
            .select('-password')
            .sort({ createdAt: -1 });

        // Get job counts and KAM assignments for each client
        const clientsWithStats = await Promise.all(
            clients.map(async (client) => {
                const jobCount = await Job.countDocuments({ postedBy: client._id });

                // Get assigned KAM for this client
                const kamAssignment = await ClientAssignment.findOne({
                    client: client._id,
                    isActive: true
                }).populate('kam', 'fullName email');

                return {
                    ...client.toObject(),
                    jobCount,
                    assignedKam: kamAssignment ? {
                        _id: kamAssignment.kam._id,
                        fullName: /** @type {any} */ (kamAssignment.kam).fullName,
                        email: /** @type {any} */ (kamAssignment.kam).email,
                        assignedAt: kamAssignment.assignedAt
                    } : null
                };
            })
        );

        res.json({
            success: true,
            count: clientsWithStats.length,
            data: clientsWithStats
        });
    } catch (error) {
        console.error('Get clients error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching clients'
        });
    }
});

// @desc    Get all jobs
// @route   GET /api/admin/jobs
// @access  Private/Admin
router.get('/jobs', protect, authorizeAdmin, async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate('postedBy', 'fullName email company')
            .populate('approved_by_kam', 'fullName email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        console.error('Get jobs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching jobs'
        });
    }
});

// @desc    Update job status and approval
// @route   PATCH /api/admin/jobs/:id/status
// @access  Private/Admin
router.patch('/jobs/:id/status', protect, authorizeAdmin, async (req, res) => {
    try {
        const { status, approval_status } = req.body;
        const updateData = {};

        // Handle Status Update
        if (status) {
            updateData.role_status = status;
        }

        // Handle Approval Logic
        if (approval_status) {
            updateData.approval_status = approval_status;

            // If approving, set the approver and timestamp
            if (approval_status === 'Approved') {
                updateData.approved_by_kam = /** @type {any} */ (req).user._id;
                updateData.kam_approval_date = Date.now();
                // Auto-activate if it was pending
                if (!status) {
                    updateData.role_status = 'Active';
                }
            }
        }

        const job = await Job.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        )
            .populate('postedBy', 'fullName email company')
            .populate('approved_by_kam', 'fullName email');

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        res.json({
            success: true,
            message: 'Job updated successfully',
            data: job
        });
    } catch (error) {
        console.error('Update job status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating job status'
        });
    }
});

// @desc    Get all profiles/candidates
// @route   GET /api/admin/profiles
// @access  Private/Admin
router.get('/profiles', protect, authorizeAdmin, async (req, res) => {
    try {
        const profiles = await Profile.find()
            .populate('uploaded_by', 'fullName email')
            .populate('job_id', 'job_title company_name')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: profiles.length,
            data: profiles
        });
    } catch (error) {
        console.error('Get profiles error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profiles'
        });
    }
});

// @desc    Get CV pipeline (profiles grouped by status)
// @route   GET /api/admin/pipeline
// @access  Private/Admin
router.get('/pipeline', protect, authorizeAdmin, async (req, res) => {
    try {
        const profiles = await Profile.find()
            .populate('uploaded_by', 'fullName email')
            .populate('job_id', 'job_title company_name')
            .sort({ createdAt: -1 });

        // Group profiles by status
        // Group profiles by status
        const pipeline = {
            applied: profiles.filter(p => ['applied', 'submitted', 'Available'].includes(p.status)),
            internal_review: profiles.filter(p => ['under_review', 'In Process'].includes(p.status)),
            shortlisted: profiles.filter(p => ['shortlisted', 'Shortlisted'].includes(p.status)),
            interview: profiles.filter(p => ['interview_scheduled', 'interviewed', 'Interview'].includes(p.status)),
            selected: profiles.filter(p => ['selected', 'hired', 'Placed', 'Selected'].includes(p.status)),
            rejected: profiles.filter(p => ['rejected', 'withdrawn', 'Rejected'].includes(p.status))
        };

        res.json({
            success: true,
            data: pipeline
        });
    } catch (error) {
        console.error('Get pipeline error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching pipeline'
        });
    }
});

// @desc    Get performance data (recruiters vs clients over time)
// @route   GET /api/admin/performance
// @access  Private/Admin
router.get('/performance', protect, authorizeAdmin, async (req, res) => {
    try {
        // Get user signups by month for the last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const recruiters = await User.find({
            role: 'recruiter',
            createdAt: { $gte: sixMonthsAgo }
        }).select('createdAt');

        const clients = await User.find({
            role: 'client',
            createdAt: { $gte: sixMonthsAgo }
        }).select('createdAt');

        // Group by month
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const performance = [];

        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthName = months[date.getMonth()];

            const recruiterCount = recruiters.filter(r => {
                const rDate = new Date(r.createdAt);
                return rDate.getMonth() === date.getMonth() && rDate.getFullYear() === date.getFullYear();
            }).length;

            const clientCount = clients.filter(c => {
                const cDate = new Date(c.createdAt);
                return cDate.getMonth() === date.getMonth() && cDate.getFullYear() === date.getFullYear();
            }).length;

            performance.push({
                name: monthName,
                recruiters: recruiterCount,
                clients: clientCount
            });
        }

        res.json({
            success: true,
            data: performance
        });
    } catch (error) {
        console.error('Get performance error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching performance data'
        });
    }
});

// @desc    Update user status (suspend/activate)
// @route   PATCH /api/admin/users/:id/status
// @access  Private/Admin
router.patch('/users/:id/status', protect, authorizeAdmin, async (req, res) => {
    try {
        const { status } = req.body; // 'active' or 'suspended'
        const isActive = status === 'active';

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Update user status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user status'
        });
    }
});

// @desc    Create a new admin user
// @route   POST /api/admin/create
// @access  Private/Admin
router.post('/create', protect, authorizeAdmin, async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create new admin user
        const user = await User.create({
            fullName,
            email,
            password, // Password hashing happens in User model pre-save hook
            role: 'admin',
            isActive: true,
            profileCompleted: true
        });

        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            },
            message: 'New admin created successfully'
        });
    } catch (error) {
        console.error('Create admin error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating admin user'
        });
    }
});

// @desc    Update job status (Approve/Pause/Close)
// @route   PATCH /api/admin/jobs/:id/status
// @access  Private/Admin
router.patch('/jobs/:id/status', protect, authorizeAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Active', 'Closed', 'Paused', 'Pending'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const job = await Job.findByIdAndUpdate(
            req.params.id,
            { role_status: status },
            { new: true }
        );

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        res.json({
            success: true,
            data: job
        });
    } catch (error) {
        console.error('Update job status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating job status'
        });
    }
});

// Mount KAM management routes
const kamRoutes = require('./admin/kamRoutes');
router.use('/kam', protect, authorizeAdmin, kamRoutes);

// Mount Recruiter Manager management routes
const recruiterManagerRoutes = require('./admin/recruiterManagerRoutes');
router.use('/recruiter-manager', protect, authorizeAdmin, recruiterManagerRoutes);

// ============= NOTIFICATION ROUTES =============
const Notification = require('../models/Notification');

// @desc    Create a new notification
// @route   POST /api/admin/notifications
// @access  Private/Admin
router.post('/notifications', protect, authorizeAdmin, async (req, res) => {
    try {
        const { title, message, targetAudience, priority, link, expiresAt } = req.body;

        if (!title || !message) {
            return res.status(400).json({
                success: false,
                message: 'Title and message are required'
            });
        }

        const notification = await Notification.create({
            title,
            message,
            targetAudience: targetAudience || 'all',
            priority: priority || 'normal',
            link: link || null,
            expiresAt: expiresAt || null,
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            data: notification,
            message: 'Notification created successfully'
        });
    } catch (error) {
        console.error('Create notification error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating notification'
        });
    }
});

// @desc    Get all notifications (admin view)
// @route   GET /api/admin/notifications
// @access  Private/Admin
router.get('/notifications', protect, authorizeAdmin, async (req, res) => {
    try {
        const notifications = await Notification.find()
            .populate('createdBy', 'fullName email')
            .sort({ createdAt: -1 });

        // Add read count for each notification
        const notificationsWithStats = notifications.map(n => ({
            ...n.toObject(),
            readCount: n.readBy.length
        }));

        res.json({
            success: true,
            count: notifications.length,
            data: notificationsWithStats
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching notifications'
        });
    }
});

// @desc    Delete a notification
// @route   DELETE /api/admin/notifications/:id
// @access  Private/Admin
router.delete('/notifications/:id', protect, authorizeAdmin, async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.json({
            success: true,
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting notification'
        });
    }
});

// @desc    Toggle notification active status
// @route   PATCH /api/admin/notifications/:id/toggle
// @access  Private/Admin
router.patch('/notifications/:id/toggle', protect, authorizeAdmin, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        notification.isActive = !notification.isActive;
        await notification.save();

        res.json({
            success: true,
            data: notification,
            message: `Notification ${notification.isActive ? 'activated' : 'deactivated'}`
        });
    } catch (error) {
        console.error('Toggle notification error:', error);
        res.status(500).json({
            success: false,
            message: 'Error toggling notification'
        });
    }
});

module.exports = router;
