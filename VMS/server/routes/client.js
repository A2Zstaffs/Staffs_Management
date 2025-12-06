const express = require('express');
const router = express.Router();
const {
    getMyJobs,
    getReceivedCVs,
    updateCVStatus,
    createJob,
    deleteJob,
    updateJob
} = require('../controllers/clientController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and for clients only (or admin)
router.use(protect);
router.use(authorize('client', 'admin'));

router.get('/jobs', getMyJobs);
router.post('/jobs/create', createJob);
router.get('/cvs', getReceivedCVs);
router.put('/cv/update-status/:cvId', updateCVStatus);
router.delete('/jobs/:jobId', deleteJob);
router.put('/jobs/:jobId', updateJob);

module.exports = router;
