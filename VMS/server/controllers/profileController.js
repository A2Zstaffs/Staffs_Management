const Profile = require('../models/Profile');
const Job = require('../models/Job');
const { uploadToS3 } = require('../utils/s3Upload');

// @desc    Upload a new profile
// @route   POST /api/profiles
// @access  Protected (Recruiter)
exports.uploadProfile = async (req, res, next) => {
    try {
        // Handle resume upload if file is present
        let resumeUrl = '';
        if (req.file) {
            console.log('📁 File received:', req.file.originalname);
            resumeUrl = await uploadToS3(req.file, 'resumes');
            console.log('✅ Resume uploaded to S3:', resumeUrl);
        }

        // Generate unique ID
        const uniqueId = `PID${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

        // Create profile with resume URL
        const profileData = {
            ...req.body,
            unique_id: uniqueId,
            resume_url: resumeUrl || req.body.resume_url || '',
            uploaded_by: req.user.id // Ensure this is set from the authenticated user
        };

        const profile = await Profile.create(profileData);

        // Populate job and recruiter details
        await profile.populate('job_id', 'job_title company_name');
        await profile.populate('uploaded_by', 'fullName email');

        // Update Job application count
        await Job.findByIdAndUpdate(profile.job_id._id, {
            $inc: {
                in_process_applications: 1,
                applicationsCount: 1
            }
        });

        res.status(201).json({
            success: true,
            data: profile,
            message: 'Profile uploaded successfully'
        });
    } catch (err) {
        console.error('Profile upload error:', err);
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

        // Decrement Job application count
        await Job.findByIdAndUpdate(profile.job_id, {
            $inc: {
                in_process_applications: -1,
                applicationsCount: -1
            }
        });

        res.status(200).json({
            success: true,
            message: 'Profile deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};
