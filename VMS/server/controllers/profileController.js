const Profile = require('../models/Profile');

// @desc    Upload a new profile
// @route   POST /api/profiles
// @access  Protected (Recruiter)
exports.uploadProfile = async (req, res, next) => {
    try {
        const profile = await Profile.create(req.body);

        // Populate job and recruiter details
        await profile.populate('job_id', 'job_title company_name');
        await profile.populate('uploaded_by', 'name email');

        res.status(201).json({
            success: true,
            data: profile
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all profiles
// @route   GET /api/profiles
// @access  Protected
exports.getProfiles = async (req, res, next) => {
    try {
        const { job_id, status, uploaded_by } = req.query;

        // Build filter object
        const filter = {};
        if (job_id) filter.job_id = job_id;
        if (status) filter.status = status;
        if (uploaded_by) filter.uploaded_by = uploaded_by;

        const profiles = await Profile.find(filter)
            .populate('job_id', 'job_title company_name job_id')
            .populate('uploaded_by', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: profiles.length,
            data: profiles
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single profile by ID
// @route   GET /api/profiles/:id
// @access  Protected
exports.getProfileById = async (req, res, next) => {
    try {
        const profile = await Profile.findById(req.params.id)
            .populate('job_id')
            .populate('uploaded_by', 'name email');

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update profile status
// @route   PATCH /api/profiles/:id/status
// @access  Protected
exports.updateProfileStatus = async (req, res, next) => {
    try {
        const { status, notes } = req.body;

        const profile = await Profile.findById(req.params.id);

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        profile.status = status || profile.status;
        if (notes) profile.notes = notes;

        await profile.save();

        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update profile details
// @route   PUT /api/profiles/:id
// @access  Protected
exports.updateProfile = async (req, res, next) => {
    try {
        const profile = await Profile.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate('job_id', 'job_title company_name')
            .populate('uploaded_by', 'name email');

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete profile
// @route   DELETE /api/profiles/:id
// @access  Protected
exports.deleteProfile = async (req, res, next) => {
    try {
        const profile = await Profile.findByIdAndDelete(req.params.id);

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};
