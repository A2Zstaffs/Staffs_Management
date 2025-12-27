const express = require('express');
const router = express.Router();
const {
  getRecruiterDashboard,
  getClientDashboard,
  getCandidateDashboard,
  getConsultancyDashboard,
  createJob,
  updateApplicationStatus,
  applyToJob,
  upload // Import upload middleware
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

// Dashboard routes for different user types
router.get('/recruiter', protect, authorize('recruiter', 'admin'), getRecruiterDashboard);
router.get('/client', protect, authorize('client', 'admin'), getClientDashboard);
router.get('/candidate', protect, authorize('candidate', 'admin'), getCandidateDashboard);
router.get('/consultancy', protect, authorize('consultancy', 'admin'), getConsultancyDashboard);

// Job management routes
router.post('/jobs', protect, authorize('client', 'consultancy'), createJob);
router.put('/applications/:applicationId', protect, authorize('client', 'consultancy'), updateApplicationStatus);
router.post('/jobs/:jobId/apply', protect, authorize('candidate'), upload.single('resume'), applyToJob);
router.post('/candidate/resume', protect, authorize('candidate'), upload.single('resume'), require('../controllers/dashboardController').uploadResume);

module.exports = router;
