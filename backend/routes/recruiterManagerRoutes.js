const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getDashboard,
    getAssignedRecruiters,
    getRecruiterById,
    getJobs,
    getProfiles,
    getApplications
} = require('../controllers/recruiterManagerController');

// Middleware to ensure user is a recruiter manager
const authorizeRM = (req, res, next) => {
    if (req.user && req.user.role === 'recruiter_manager') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Recruiter Manager role required.'
        });
    }
};

// All routes require authentication and recruiter manager role
router.use(protect, authorizeRM);

// Dashboard
router.get('/dashboard', getDashboard);

// Assigned Recruiters
router.get('/recruiters', getAssignedRecruiters);
router.get('/recruiters/:id', getRecruiterById);

// Jobs (full access like a recruiter)
router.get('/jobs', getJobs);

// Profiles
router.get('/profiles', getProfiles);

// Applications
router.get('/applications', getApplications);

module.exports = router;
