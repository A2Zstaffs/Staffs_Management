const User = require('../models/User');
const ClientAssignment = require('../models/ClientAssignment');

// @desc    Create a new KAM user
// @route   POST /api/admin/kam/create
// @access  Admin only
exports.createKam = async (req, res, next) => {
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

        // Default KAM permissions
        const kamPermissions = [
            'client:view_assigned',
            'client:manage_assigned',
            'job:view_assigned',
            'cv:view_assigned',
            'cv:shortlist',
            'cv:share_with_client',
            'feedback:view'
        ];

        // Create new KAM user
        const kamUser = await User.create({
            fullName,
            email: email.toLowerCase(),
            password,
            phoneNumber: phoneNumber || '',
            role: 'kam',
            permissions: kamPermissions,
            isActive: true,
            isVerified: true, // Auto-verify since created by admin
            profileCompleted: true
        });

        // Remove password from response
        const kamUserResponse = kamUser.toObject();
        delete kamUserResponse.password;

        res.status(201).json({
            success: true,
            message: 'KAM user created successfully',
            data: kamUserResponse
        });
    } catch (error) {
        console.error('Error creating KAM user:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'A user with this email already exists'
            });
        }
        next(error);
    }
};

// @desc    Get all users with KAM role
// @route   GET /api/admin/kam/users
// @access  Admin only
exports.getAllKams = async (req, res, next) => {
    try {
        const kams = await User.find({ role: 'kam' })
            .select('-password')
            .sort({ createdAt: -1 });

        // Get client count for each KAM
        const kamsWithClientCount = await Promise.all(
            kams.map(async (kam) => {
                const clientCount = await ClientAssignment.countDocuments({
                    kam: kam._id,
                    isActive: true
                });
                return {
                    ...kam.toObject(),
                    assignedClientsCount: clientCount
                };
            })
        );

        res.status(200).json({
            success: true,
            count: kamsWithClientCount.length,
            data: kamsWithClientCount
        });
    } catch (error) {
        console.error('Error getting KAMs:', error);
        next(error);
    }
};

// @desc    Assign KAM role to a user
// @route   POST /api/admin/kam/assign-role
// @access  Admin only
exports.assignKamRole = async (req, res, next) => {
    try {
        const { userId, permissions } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        // Default KAM permissions if not provided
        const kamPermissions = permissions || [
            'client:view_assigned',
            'client:manage_assigned',
            'job:view_assigned',
            'cv:view_assigned',
            'cv:shortlist',
            'cv:share_with_client',
            'feedback:view'
        ];

        const user = await User.findByIdAndUpdate(
            userId,
            {
                role: 'kam',
                permissions: kamPermissions
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
            message: 'KAM role assigned successfully',
            data: user
        });
    } catch (error) {
        console.error('Error assigning KAM role:', error);
        next(error);
    }
};

// @desc    Revoke KAM role from a user
// @route   DELETE /api/admin/kam/:userId/revoke-role
// @access  Admin only
exports.revokeKamRole = async (req, res, next) => {
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

        // Deactivate all client assignments for this KAM
        await ClientAssignment.updateMany(
            { kam: userId, isActive: true },
            { isActive: false, deactivatedAt: new Date() }
        );

        res.status(200).json({
            success: true,
            message: 'KAM role revoked successfully',
            data: user
        });
    } catch (error) {
        console.error('Error revoking KAM role:', error);
        next(error);
    }
};

// @desc    Get clients assigned to a specific KAM
// @route   GET /api/admin/kam/:kamId/clients
// @access  Admin only
exports.getKamClients = async (req, res, next) => {
    try {
        const { kamId } = req.params;

        const assignments = await ClientAssignment.find({ kam: kamId, isActive: true })
            .populate('client', 'fullName email company businessDetails')
            .populate('assignedBy', 'fullName email')
            .sort({ assignedAt: -1 });

        res.status(200).json({
            success: true,
            count: assignments.length,
            data: assignments
        });
    } catch (error) {
        console.error('Error getting KAM clients:', error);
        next(error);
    }
};

// @desc    Assign client to KAM
// @route   POST /api/admin/kam/:kamId/assign-client
// @access  Admin only
exports.assignClientToKam = async (req, res, next) => {
    try {
        const { kamId } = req.params;
        const { clientId, notes } = req.body;

        if (!clientId) {
            return res.status(400).json({
                success: false,
                message: 'Client ID is required'
            });
        }

        // Verify KAM exists and has KAM role
        const kam = await User.findById(kamId);
        if (!kam || kam.role !== 'kam') {
            return res.status(400).json({
                success: false,
                message: 'Invalid KAM user'
            });
        }

        // Verify client exists and has client role
        const client = await User.findById(clientId);
        if (!client || client.role !== 'client') {
            return res.status(400).json({
                success: false,
                message: 'Invalid client user'
            });
        }

        // Check if assignment already exists
        const existingAssignment = await ClientAssignment.findOne({
            kam: kamId,
            client: clientId
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
                    message: 'Client assignment reactivated',
                    data: existingAssignment
                });
            }

            return res.status(400).json({
                success: false,
                message: 'Client is already assigned to this KAM'
            });
        }

        // Create new assignment
        const assignment = await ClientAssignment.create({
            kam: kamId,
            client: clientId,
            assignedBy: req.user._id,
            notes: notes || ''
        });

        await assignment.populate('client', 'fullName email company');
        await assignment.populate('kam', 'fullName email');

        res.status(201).json({
            success: true,
            message: 'Client assigned to KAM successfully',
            data: assignment
        });
    } catch (error) {
        console.error('Error assigning client to KAM:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Client is already assigned to this KAM'
            });
        }
        next(error);
    }
};

// @desc    Remove client from KAM
// @route   DELETE /api/admin/kam/:kamId/clients/:clientId
// @access  Admin only
exports.removeClientFromKam = async (req, res, next) => {
    try {
        const { kamId, clientId } = req.params;

        const assignment = await ClientAssignment.findOne({
            kam: kamId,
            client: clientId,
            isActive: true
        });

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Client assignment not found'
            });
        }

        assignment.isActive = false;
        assignment.deactivatedAt = new Date();
        await assignment.save();

        res.status(200).json({
            success: true,
            message: 'Client removed from KAM successfully'
        });
    } catch (error) {
        console.error('Error removing client from KAM:', error);
        next(error);
    }
};

// @desc    Get all KAM-Client assignments
// @route   GET /api/admin/kam/assignments
// @access  Admin only
exports.getAllAssignments = async (req, res, next) => {
    try {
        const { isActive } = req.query;

        const filter = {};
        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }

        const assignments = await ClientAssignment.find(filter)
            .populate('kam', 'fullName email')
            .populate('client', 'fullName email company')
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
