const express = require('express');
const router = express.Router();
const {
    uploadProfile,
    getProfiles,
    getProfileById,
    updateProfileStatus,
    updateProfile,
    deleteProfile
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const { uploadS3 } = require('../utils/s3Upload');

// Profile routes
// Apply protect middleware to all routes if they require authentication
router.use(protect);

router.route('/')
    .get(getProfiles)
    .post(uploadS3.single('resume'), uploadProfile); // Add multer middleware for resume upload

router.route('/:id')
    .get(getProfileById)
    .put(updateProfile)
    .delete(deleteProfile);

router.patch('/:id/status', updateProfileStatus);

module.exports = router;
