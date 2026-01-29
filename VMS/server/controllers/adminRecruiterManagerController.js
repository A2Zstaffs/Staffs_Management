const User = require('../models/User');
const RecruiterAssignment = require('../models/RecruiterAssignment');

// @desc    Create a new Recruiter Manager user
// @route   POST /api/admin/recruiter-manager/create
// @access  Admin only
exports.createRecruiterManager = async (req, res, next) => {
    try {
        const { fullName, email, password, phoneNumber } = req.body;

        // Validate required fields
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Full name, email, and password are required'
            });
        }

        // Check if user with this email already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'A user with this email already exists'
            });
        }

        // Default Recruiter Manager permissions (all recruiter permissions + RM-specific)
        const rmPermissions = [
            'recruiter:view_assigned',
            'recruiter:manage_assigned',
            'job:view_all',
            'profile:view_all',
            'profile:upload',
            'application:manage'
        ];

        // Create new Recruiter Manager user
        const rmUser = await User.create({
            fullName,
            email: email.toLowerCase(),
            password,
            phoneNumber: phoneNumber || '',
            role: 'recruiter_manager',
            permissions: rmPermissions,
            isActive: true,
            isEmailVerified: true, // Auto-verify since created by admin
            profileCompleted: true
        });

        // Remove password from response
        const rmUserResponse = rmUser.toObject();
        delete rmUserResponse.password;

        res.status(201).json({
            success: true,
            message: 'Recruiter Manager user created successfully',
            data: rmUserResponse
        });
    } catch (error) {
        console.error('Error creating Recruiter Manager user:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'A user with this email already exists'
            });
        }
        next(error);
    }
};

// @desc    Get all users with Recruiter Manager role
// @route   GET /api/admin/recruiter-manager/users
// @access  Admin only
exports.getAllRecruiterManagers = async (req, res, next) => {
    try {
        const rms = await User.find({ role: 'recruiter_manager' })
            .select('-password')
            .sort({ createdAt: -1 });

        // Get recruiter count for each RM
        const rmsWithRecruiterCount = await Promise.all(
            rms.map(async (rm) => {
                const recruiterCount = await RecruiterAssignment.countDocuments({
                    recruiterManager: rm._id,
                    isActive: true
                });
                return {
                    ...rm.toObject(),
                    assignedRecruitersCount: recruiterCount
                };
            })
        );

        res.status(200).json({
            success: true,
            count: rmsWithRecruiterCount.length,
            data: rmsWithRecruiterCount
        });
    } catch (error) {
        console.error('Error getting Recruiter Managers:', error);
        next(error);
    }
};

// @desc    Assign Recruiter Manager role to a user
// @route   POST /api/admin/recruiter-manager/assign-role
// @access  Admin only
exports.assignRecruiterManagerRole = async (req, res, next) => {
    try {
        const { userId, permissions } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        // Default RM permissions if not provided
        const rmPermissions = permissions || [
            'recruiter:view_assigned',
            'recruiter:manage_assigned',
            'job:view_all',
            'profile:view_all',
            'profile:upload',
            'application:manage'
        ];

        const user = await User.findByIdAndUpdate(
            userId,
            {
                role: 'recruiter_manager',
                permissions: rmPermissions,
                isEmailVerified: true // Auto-verify since assigned by admin
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Recruiter Manager role assigned successfully',
            data: user
        });
    } catch (error) {
        console.error('Error assigning Recruiter Manager role:', error);
        next(error);
    }
};

// @desc    Revoke Recruiter Manager role from a user
// @route   DELETE /api/admin/recruiter-manager/:userId/revoke-role
// @access  Admin only
exports.revokeRecruiterManagerRole = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const user = await User.findByIdAndUpdate(
            userId,
            {
                role: 'candidate', // Revert to candidate
                permissions: []
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Deactivate all recruiter assignments for this RM
        await RecruiterAssignment.updateMany(
            { recruiterManager: userId, isActive: true },
            { isActive: false, deactivatedAt: new Date() }
        );

        res.status(200).json({
            success: true,
            message: 'Recruiter Manager role revoked successfully',
            data: user
        });
    } catch (error) {
        console.error('Error revoking Recruiter Manager role:', error);
        next(error);
    }
};

// @desc    Get recruiters assigned to a specific Recruiter Manager
// @route   GET /api/admin/recruiter-manager/:rmId/recruiters
// @access  Admin only
exports.getRecruiterManagerRecruiters = async (req, res, next) => {
    try {
        const { rmId } = req.params;

        const assignments = await RecruiterAssignment.find({ recruiterManager: rmId, isActive: true })
            .populate('recruiter', 'fullName email company')
            .populate('assignedBy', 'fullName email')
            .sort({ assignedAt: -1 });

        res.status(200).json({
            success: true,
            count: assignments.length,
            data: assignments
        });
    } catch (error) {
        console.error('Error getting Recruiter Manager recruiters:', error);
        next(error);
    }
};

// @desc    Assign recruiter to Recruiter Manager
// @route   POST /api/admin/recruiter-manager/:rmId/assign-recruiter
// @access  Admin only
exports.assignRecruiterToRM = async (req, res, next) => {
    try {
        const { rmId } = req.params;
        const { recruiterId, notes } = req.body;

        if (!recruiterId) {
            return res.status(400).json({
                success: false,
                message: 'Recruiter ID is required'
            });
        }

        // Verify RM exists and has recruiter_manager role
        const rm = await User.findById(rmId);
        if (!rm || rm.role !== 'recruiter_manager') {
            return res.status(400).json({
                success: false,
                message: 'Invalid Recruiter Manager user'
            });
        }

        // Verify recruiter exists and has recruiter role
        const recruiter = await User.findById(recruiterId);
        if (!recruiter || recruiter.role !== 'recruiter') {
            return res.status(400).json({
                success: false,
                message: 'Invalid recruiter user'
            });
        }

        // Check if assignment already exists
        const existingAssignment = await RecruiterAssignment.findOne({
            recruiterManager: rmId,
            recruiter: recruiterId
        });

        if (existingAssignment) {
            // Reactivate if exists but inactive
            if (!existingAssignment.isActive) {
                existingAssignment.isActive = true;
                existingAssignment.assignedBy = req.user._id;
                existingAssignment.assignedAt = new Date();
                existingAssignment.notes = notes || existingAssignment.notes;
                await existingAssignment.save();

                return res.status(200).json({
                    success: true,
                    message: 'Recruiter assignment reactivated',
                    data: existingAssignment
                });
            }

            return res.status(400).json({
                success: false,
                message: 'Recruiter is already assigned to this Recruiter Manager'
            });
        }

        // Create new assignment
        const assignment = await RecruiterAssignment.create({
            recruiterManager: rmId,
            recruiter: recruiterId,
            assignedBy: req.user._id,
            notes: notes || ''
        });

        await assignment.populate('recruiter', 'fullName email company');
        await assignment.populate('recruiterManager', 'fullName email');

        res.status(201).json({
            success: true,
            message: 'Recruiter assigned to Recruiter Manager successfully',
            data: assignment
        });
    } catch (error) {
        console.error('Error assigning recruiter to Recruiter Manager:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Recruiter is already assigned to this Recruiter Manager'
            });
        }
        next(error);
    }
};

// @desc    Remove recruiter from Recruiter Manager
// @route   DELETE /api/admin/recruiter-manager/:rmId/recruiters/:recruiterId
// @access  Admin only
exports.removeRecruiterFromRM = async (req, res, next) => {
    try {
        const { rmId, recruiterId } = req.params;

        const assignment = await RecruiterAssignment.findOne({
            recruiterManager: rmId,
            recruiter: recruiterId,
            isActive: true
        });

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Recruiter assignment not found'
            });
        }

        assignment.isActive = false;
        assignment.deactivatedAt = new Date();
        await assignment.save();

        res.status(200).json({
            success: true,
            message: 'Recruiter removed from Recruiter Manager successfully'
        });
    } catch (error) {
        console.error('Error removing recruiter from Recruiter Manager:', error);
        next(error);
    }
};

// @desc    Get all Recruiter Manager - Recruiter assignments
// @route   GET /api/admin/recruiter-manager/assignments
// @access  Admin only
exports.getAllAssignments = async (req, res, next) => {
    try {
        const { isActive } = req.query;

        const filter = {};
        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }

        const assignments = await RecruiterAssignment.find(filter)
            .populate('recruiterManager', 'fullName email')
            .populate('recruiter', 'fullName email company')
            .populate('assignedBy', 'fullName email')
            .sort({ assignedAt: -1 });

        res.status(200).json({
            success: true,
            count: assignments.length,
            data: assignments
        });
    } catch (error) {
        console.error('Error getting assignments:', error);
        next(error);
    }
};
