const express = require('express');
const router = express.Router();
const { createJob, getJobs } = require('../controllers/jobController');
const { protect } = require('../middleware/auth');

router.route('/')
    .get(getJobs)
    .post(protect, createJob); // Add auth middleware to POST

module.exports = router;
