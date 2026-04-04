const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { checkPermission, checkClientAccess, checkJobAccess } = require('../middleware/rbac');
const {
    getDashboard,
    getClients,
    getClientById,
    getJobs,
    getJobById,
    getCVs,
    getCVById,
    shortlistCV,
    shareCVWithClient,
    getFeedback,
    createJobForClient,
    getPendingStatusChanges,
    getPendingStatusChangeById,
    approvePendingStatusChange,
    rejectPendingStatusChange,
    getClientApplications,
    getPendingJobs,
    approveJob,
    rejectJob,
    updateJobForClient
} = require('../controllers/kamController');

// All routes require authentication and KAM role
router.use(protect);
router.use(authorize('kam'));

// Dashboard
router.route('/dashboard')
    .get(checkPermission('client:view_assigned'), getDashboard);

// Clients
router.route('/clients')
    .get(checkPermission('client:view_assigned'), getClients);

router.route('/clients/:clientId')
    .get(checkPermission('client:view_assigned'), checkClientAccess, getClientById);

// Create job for specific client
router.route('/clients/:clientId/jobs')
    .post(checkPermission('client:manage_assigned'), checkClientAccess, createJobForClient);

// Update job for specific client
router.route('/clients/:clientId/jobs/:jobId')
    .put(checkPermission('client:manage_assigned'), checkClientAccess, updateJobForClient);

// Jobs
router.route('/jobs')
    .get(checkPermission('job:view_assigned'), getJobs);

router.route('/jobs/:jobId')
    .get(checkPermission('job:view_assigned'), checkJobAccess, getJobById);

// CVs/Profiles
router.route('/cvs')
    .get(checkPermission('cv:view_assigned'), getCVs);

router.route('/cvs/:cvId')
    .get(checkPermission('cv:view_assigned'), getCVById);

router.route('/cvs/:cvId/shortlist')
    .patch(checkPermission('cv:shortlist'), shortlistCV);

router.route('/cvs/:cvId/share')
    .post(checkPermission('cv:share_with_client'), shareCVWithClient);

// Feedback
router.route('/feedback')
    .get(checkPermission('feedback:view'), getFeedback);

// Pending Status Change Approvals
router.route('/pending-status-changes')
    .get(checkPermission('client:view_assigned'), getPendingStatusChanges);

router.route('/pending-status-changes/:id')
    .get(checkPermission('client:view_assigned'), getPendingStatusChangeById);

router.route('/pending-status-changes/:id/approve')
    .patch(checkPermission('client:manage_assigned'), approvePendingStatusChange);

router.route('/pending-status-changes/:id/reject')
    .patch(checkPermission('client:manage_assigned'), rejectPendingStatusChange);

// Client Applications
router.route('/applications')
    .get(checkPermission('cv:view_assigned'), getClientApplications);

// Job Approvals
router.route('/pending-jobs')
    .get(checkPermission('client:view_assigned'), getPendingJobs);

router.route('/jobs/:jobId/approve')
    .patch(checkPermission('client:manage_assigned'), approveJob);

router.route('/jobs/:jobId/reject')
    .patch(checkPermission('client:manage_assigned'), rejectJob);

module.exports = router;
