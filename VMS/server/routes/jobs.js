const express = require('express');
const router = express.Router();
const { createJob, getJobs } = require('../controllers/jobController');

router.route('/')
    .get(getJobs)
    .post(createJob);

module.exports = router;
