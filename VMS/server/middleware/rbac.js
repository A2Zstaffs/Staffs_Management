const ClientAssignment = require('../models/ClientAssignment');

/**
 * Check if user has a specific permission
 * @param {Object} user - User object with permissions array
 * @param {String} permission - Permission string to check
 * @returns {Boolean}
 */
const hasPermission = (user, permission) => {
    if (!user) return false;

    // Admin has all permissions
    if (user.role === 'admin') return true;

    // Check if user has the specific permission
    return user.permissions && user.permissions.includes(permission);
};

/**
 * Middleware to check if user has specific permission
 * Usage: checkPermission('client:view_assigned')
 */
const checkPermission = (permission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!hasPermission(req.user, permission)) {
            return res.status(403).json({
                success: false,
                message: `Permission denied. Required permission: ${permission}`
            });
        }

        next();
    };
};

/**
 * Middleware to check if KAM has access to specific client
 * Usage: checkClientAccess('clientId')
 * Note: clientId can be in req.params or req.body
 */
const checkClientAccess = async (req, res, next) => {
    try {
        const { user } = req;

        // Admin has access to all clients
        if (user.role === 'admin') {
            return next();
        }

        // Only KAMs need this check
        if (user.role !== 'kam') {
            return res.status(403).json({
                success: false,
                message: 'Only KAMs can access client-specific resources'
            });
        }

        // Get clientId from params or body
        const clientId = req.params.clientId || req.body.clientId || req.query.clientId;

        if (!clientId) {
            return res.status(400).json({
                success: false,
                message: 'Client ID is required'
            });
        }

        // Check if KAM has access to this client
        const hasAccess = await /** @type {any} */ (ClientAssignment).hasClientAccess(user._id, clientId);

        if (!hasAccess) {
            return res.status(403).json({
                success: false,
                message: 'You do not have access to this client'
            });
        }

        next();
    } catch (error) {
        console.error('Error in checkClientAccess middleware:', error);
        return res.status(500).json({
            success: false,
            message: 'Error checking client access'
        });
    }
};

/**
 * Middleware to check if KAM can access a job
 * Jobs are associated with clients, so we check if KAM has access to the job's client
 */
const checkJobAccess = async (req, res, next) => {
    try {
        const { user } = req;
        const Job = require('../models/Job');

        // Admin has access to all jobs
        if (user.role === 'admin') {
            return next();
        }

        // Only KAMs need this check
        if (user.role !== 'kam') {
            return res.status(403).json({
                success: false,
                message: 'Only KAMs can access this resource'
            });
        }

        // Get jobId from params
        const jobId = req.params.jobId || req.params.id;

        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: 'Job ID is required'
            });
        }

        // Get job and check if KAM has access to the client who posted it
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        const hasAccess = await /** @type {any} */ (ClientAssignment).hasClientAccess(user._id, job.postedBy);

        if (!hasAccess) {
            return res.status(403).json({
                success: false,
                message: 'You do not have access to this job'
            });
        }

        // Attach job to request for controller use
        req.job = job;
        next();
    } catch (error) {
        console.error('Error in checkJobAccess middleware:', error);
        return res.status(500).json({
            success: false,
            message: 'Error checking job access'
        });
    }
};

/**
 * Get list of client IDs assigned to a KAM
 * Helper function for controllers
 */
const getAssignedClientIds = async (kamId) => {
    try {
        const assignments = await ClientAssignment.find({ kam: kamId, isActive: true }).select('client');
        return assignments.map(a => a.client);
    } catch (error) {
        console.error('Error getting assigned clients:', error);
        return [];
    }
};

module.exports = {
    hasPermission,
    checkPermission,
    checkClientAccess,
    checkJobAccess,
    getAssignedClientIds
};
