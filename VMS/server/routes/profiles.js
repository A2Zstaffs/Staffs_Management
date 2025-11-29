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

// Profile routes
router.route('/')
    .get(getProfiles)
    .post(uploadProfile);

router.route('/:id')
    .get(getProfileById)
    .put(updateProfile)
    .delete(deleteProfile);

router.patch('/:id/status', updateProfileStatus);

module.exports = router;
