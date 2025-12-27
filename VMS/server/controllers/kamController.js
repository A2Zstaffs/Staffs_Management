const User = require('../models/User');
const Job = require('../models/Job');
const Profile = require('../models/Profile');
const ClientAssignment = require('../models/ClientAssignment');
const { getAssignedClientIds } = require('../middleware/rbac');

// @desc    Get KAM dashboard stats
// @route   GET /api/kam/dashboard
// @access  KAM only
exports.getDashboard = async (req, res, next) => {
    try {
        const kamId = req.user._id;
        const PendingStatusChange = require('../models/PendingStatusChange');

        // Get assigned clients
        const clientIds = await getAssignedClientIds(kamId);

        // Get stats
        const stats = {
            assignedClients: clientIds.length,
            activeJobs: await Job.countDocuments({
                postedBy: { $in: clientIds },
                role_status: 'Active'
            }),
            totalCVs: await Profile.countDocuments({
                job_id: {
                    $in: await Job.find({ postedBy: { $in: clientIds } }).distinct('_id')
                }
            }),
            shortlistedCVs: await Profile.countDocuments({
                job_id: {
                    $in: await Job.find({ postedBy: { $in: clientIds } }).distinct('_id')
                },
                status: { $in: ['shortlisted', 'interview_scheduled', 'interviewed'] }
            }),
            pendingApprovals: await PendingStatusChange.countDocuments({
                kam: kamId,
                status: 'pending'
            }),
            pendingJobApprovals: await Job.countDocuments({
                postedBy: { $in: clientIds },
                approval_status: 'Pending'
            })
        };

        // Get recent clients
        const recentClients = await ClientAssignment.find({ kam: kamId, isActive: true })
            .populate('client', 'fullName email company businessDetails')
            .sort({ assignedAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                stats,
                recentClients: recentClients.map(a => a.client)
            }
        });
    } catch (error) {
        console.error('Error getting KAM dashboard:', error);
        next(error);
    }
};

// @desc    Get assigned clients
// @route   GET /api/kam/clients
// @access  KAM only
exports.getClients = async (req, res, next) => {
    try {
        const kamId = req.user._id;

        const clients = await ClientAssignment.getActiveClientsForKam(kamId);

        // Get job counts for each client
        const clientsWithStats = await Promise.all(
            clients.map(async (client) => {
                const jobCount = await Job.countDocuments({
                    postedBy: client._id,
                    role_status: { $ne: 'Closed' }
                });

                return {
                    ...client.toObject(),
                    activeJobsCount: jobCount
                };
            })
        );

        res.status(200).json({
            success: true,
            count: clientsWithStats.length,
            data: clientsWithStats
        });
    } catch (error) {
        console.error('Error getting assigned clients:', error);
        next(error);
    }
};

// @desc    Get specific client details
// @route   GET /api/kam/clients/:clientId
// @access  KAM only (with client access check)
exports.getClientById = async (req, res, next) => {
    try {
        const { clientId } = req.params;

        const client = await User.findById(clientId).select('-password');

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        // Get client stats
        const stats = {
            totalJobs: await Job.countDocuments({ postedBy: clientId }),
            activeJobs: await Job.countDocuments({ postedBy: clientId, role_status: 'Active' }),
            totalApplications: await Profile.countDocuments({
                job_id: { $in: await Job.find({ postedBy: clientId }).distinct('_id') }
            })
        };

        res.status(200).json({
            success: true,
            data: {
                client,
                stats
            }
        });
    } catch (error) {
        console.error('Error getting client details:', error);
        next(error);
    }
};

// @desc    Get jobs from assigned clients
// @route   GET /api/kam/jobs
// @access  KAM only
exports.getJobs = async (req, res, next) => {
    try {
        const kamId = req.user._id;
        const { status, clientId } = req.query;

        // Get assigned clients
        const clientIds = await getAssignedClientIds(kamId);

        // Build filter
        const filter = { postedBy: { $in: clientIds } };
        if (status) {
            filter.role_status = status;
        }
        if (clientId && clientIds.includes(clientId)) {
            filter.postedBy = clientId;
        }

        const jobs = await Job.find(filter)
            .populate('postedBy', 'fullName email company')
            .sort({ posted_date: -1 });

        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        console.error('Error getting jobs:', error);
        next(error);
    }
};

// @desc    Get specific job details
// @route   GET /api/kam/jobs/:jobId
// @access  KAM only (with job access check)
exports.getJobById = async (req, res, next) => {
    try {
        // Job is already attached by checkJobAccess middleware
        const job = req.job;

        await job.populate('postedBy', 'fullName email company');

        // Get application stats
        const stats = {
            totalApplications: await Profile.countDocuments({ job_id: job._id }),
            shortlisted: await Profile.countDocuments({ job_id: job._id, status: 'shortlisted' }),
            interviewed: await Profile.countDocuments({ job_id: job._id, status: 'interviewed' }),
            selected: await Profile.countDocuments({ job_id: job._id, status: 'selected' })
        };

        res.status(200).json({
            success: true,
            data: {
                job,
                stats
            }
        });
    } catch (error) {
        console.error('Error getting job details:', error);
        next(error);
    }
};

// @desc    Get CVs/Profiles for assigned clients
// @route   GET /api/kam/cvs
// @access  KAM only
exports.getCVs = async (req, res, next) => {
    try {
        const kamId = req.user._id;
        const { status, jobId, clientId } = req.query;

        // Get assigned clients
        const clientIds = await getAssignedClientIds(kamId);

        // Get jobs from assigned clients
        let jobFilter = { postedBy: { $in: clientIds } };
        if (jobId) {
            jobFilter._id = jobId;
        }
        if (clientId && clientIds.includes(clientId)) {
            jobFilter.postedBy = clientId;
        }

        const jobIds = await Job.find(jobFilter).distinct('_id');

        // Build CV filter
        const cvFilter = { job_id: { $in: jobIds } };
        if (status) {
            cvFilter.status = status;
        }

        const cvs = await Profile.find(cvFilter)
            .populate('job_id', 'job_title company_name')
            .populate('uploaded_by', 'fullName email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: cvs.length,
            data: cvs
        });
    } catch (error) {
        console.error('Error getting CVs:', error);
        next(error);
    }
};

// @desc    Get specific CV details
// @route   GET /api/kam/cvs/:cvId
// @access  KAM only
exports.getCVById = async (req, res, next) => {
    try {
        const { cvId } = req.params;
        const kamId = req.user._id;

        const cv = await Profile.findById(cvId)
            .populate('job_id')
            .populate('uploaded_by', 'fullName email');

        if (!cv) {
            return res.status(404).json({
                success: false,
                message: 'CV not found'
            });
        }

        // Verify KAM has access to this CV's job's client
        const clientIds = await getAssignedClientIds(kamId);
        if (!clientIds.includes(cv.job_id.postedBy.toString())) {
            return res.status(403).json({
                success: false,
                message: 'You do not have access to this CV'
            });
        }

        res.status(200).json({
            success: true,
            data: cv
        });
    } catch (error) {
        console.error('Error getting CV details:', error);
        next(error);
    }
};

// @desc    Shortlist a CV
// @route   PATCH /api/kam/cvs/:cvId/shortlist
// @access  KAM only (with cv:shortlist permission)
exports.shortlistCV = async (req, res, next) => {
    try {
        const { cvId } = req.params;
        const { notes } = req.body;
        const kamId = req.user._id;

        const cv = await Profile.findById(cvId).populate('job_id');

        if (!cv) {
            return res.status(404).json({
                success: false,
                message: 'CV not found'
            });
        }

        // Verify KAM has access to this CV's job's client
        const clientIds = await getAssignedClientIds(kamId);
        if (!clientIds.includes(cv.job_id.postedBy.toString())) {
            return res.status(403).json({
                success: false,
                message: 'You do not have access to this CV'
            });
        }

        cv.status = 'shortlisted';
        if (notes) {
            cv.notes = (cv.notes ? cv.notes + '\n\n' : '') + `KAM Shortlist: ${notes}`;
        }
        await cv.save();

        res.status(200).json({
            success: true,
            message: 'CV shortlisted successfully',
            data: cv
        });
    } catch (error) {
        console.error('Error shortlisting CV:', error);
        next(error);
    }
};

// @desc    Share CV with client
// @route   POST /api/kam/cvs/:cvId/share
// @access  KAM only (with cv:share_with_client permission)
exports.shareCVWithClient = async (req, res, next) => {
    try {
        const { cvId } = req.params;
        const { message } = req.body;
        const kamId = req.user._id;

        const cv = await Profile.findById(cvId).populate('job_id');

        if (!cv) {
            return res.status(404).json({
                success: false,
                message: 'CV not found'
            });
        }

        // Verify KAM has access to this CV's job's client
        const clientIds = await getAssignedClientIds(kamId);
        if (!clientIds.includes(cv.job_id.postedBy.toString())) {
            return res.status(403).json({
                success: false,
                message: 'You do not have access to this CV'
            });
        }

        // Update CV status to shared
        cv.status = 'submitted'; // or 'shared_with_client' if you have this status
        if (message) {
            cv.notes = (cv.notes ? cv.notes + '\n\n' : '') + `Shared by KAM: ${message}`;
        }
        await cv.save();

        // TODO: Send notification to client (implement notification system)

        res.status(200).json({
            success: true,
            message: 'CV shared with client successfully',
            data: cv
        });
    } catch (error) {
        console.error('Error sharing CV with client:', error);
        next(error);
    }
};

// @desc    Get feedback for shared CVs
// @route   GET /api/kam/feedback
// @access  KAM only (with feedback:view permission)
exports.getFeedback = async (req, res, next) => {
    try {
        const kamId = req.user._id;

        // Get assigned clients
        const clientIds = await getAssignedClientIds(kamId);

        // Get jobs from assigned clients
        const jobIds = await Job.find({ postedBy: { $in: clientIds } }).distinct('_id');

        // Get CVs with feedback (status indicates client has reviewed)
        const cvs = await Profile.find({
            job_id: { $in: jobIds },
            status: { $in: ['shortlisted', 'interview_scheduled', 'interviewed', 'selected', 'hired', 'rejected'] },
            notes: { $exists: true, $ne: '' }
        })
            .populate('job_id', 'job_title company_name')
            .populate('uploaded_by', 'fullName email')
            .sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            count: cvs.length,
            data: cvs
        });
    } catch (error) {
        console.error('Error getting feedback:', error);
        next(error);
    }
};

// @desc    Create job on behalf of assigned client
// @route   POST /api/kam/clients/:clientId/jobs
// @access  KAM only (with client access check)
exports.createJobForClient = async (req, res, next) => {
    try {
        const { clientId } = req.params;
        const kamId = req.user._id;

        // Verify client exists
        const client = await User.findById(clientId);
        if (!client || client.role !== 'client') {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        // Generate unique job_id
        const jobCount = await Job.countDocuments();
        const job_id = `JOB${String(jobCount + 6716).padStart(4, '0')}`;

        // Prepare job data - job is posted by the client, not the KAM
        const jobData = {
            ...req.body,
            job_id,
            postedBy: clientId, // Job belongs to the client
            postedByRole: 'client',
            company_name: req.body.company_name || client.company || 'Company Name',
            posted_date: new Date(),
            role_status: 'Pending', // New jobs start as pending
            // Add audit trail - who created this on behalf of client
            createdByKam: kamId,
            kamCreatedAt: new Date()
        };

        const job = await Job.create(jobData);

        // Populate client details for response
        await job.populate('postedBy', 'fullName email company');

        res.status(201).json({
            success: true,
            message: 'Job created successfully on behalf of client',
            data: job
        });
    } catch (error) {
        console.error('Error creating job for client:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create job'
        });
    }
};

// @desc    Get all pending status change requests
// @route   GET /api/kam/pending-status-changes
// @access  KAM only
exports.getPendingStatusChanges = async (req, res, next) => {
    try {
        const kamId = req.user._id;
        const PendingStatusChange = require('../models/PendingStatusChange');
        const Application = require('../models/Application');

        // Get all pending requests for this KAM
        const pendingRequests = await PendingStatusChange.find({
            kam: kamId,
            status: 'pending'
        })
            .populate('client', 'fullName email company')
            .populate('job', 'job_title company_name')
            .sort({ requestedAt: -1 });

        // Populate the target (Application or Profile) for each request
        const populatedRequests = await Promise.all(
            pendingRequests.map(async (request) => {
                let targetDoc;
                if (request.targetType === 'Application') {
                    targetDoc = await Application.findById(request.targetId)
                        .populate('candidate', 'fullName email');
                } else {
                    targetDoc = await Profile.findById(request.targetId);
                }

                return {
                    ...request.toObject(),
                    targetDetails: targetDoc ? {
                        candidateName: targetDoc.candidate?.fullName || targetDoc.candidate_name || 'Unknown',
                        candidateEmail: targetDoc.candidate?.email || targetDoc.email || 'N/A'
                    } : null
                };
            })
        );

        res.status(200).json({
            success: true,
            count: populatedRequests.length,
            data: populatedRequests
        });
    } catch (error) {
        console.error('Error getting pending status changes:', error);
        next(error);
    }
};

// @desc    Get specific pending status change request
// @route   GET /api/kam/pending-status-changes/:id
// @access  KAM only
exports.getPendingStatusChangeById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const kamId = req.user._id;
        const PendingStatusChange = require('../models/PendingStatusChange');

        const request = await PendingStatusChange.findById(id)
            .populate('client', 'fullName email company')
            .populate('job', 'job_title company_name')
            .populate('kam', 'fullName email');

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Pending request not found'
            });
        }

        // Verify this request is for the current KAM
        if (request.kam._id.toString() !== kamId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this request'
            });
        }

        res.status(200).json({
            success: true,
            data: request
        });
    } catch (error) {
        console.error('Error getting pending status change:', error);
        next(error);
    }
};

// @desc    Approve pending status change
// @route   PATCH /api/kam/pending-status-changes/:id/approve
// @access  KAM only
exports.approvePendingStatusChange = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;
        const kamId = req.user._id;
        const PendingStatusChange = require('../models/PendingStatusChange');
        const Application = require('../models/Application');
        const Commission = require('../models/Commission');

        const pendingRequest = await PendingStatusChange.findById(id);

        if (!pendingRequest) {
            return res.status(404).json({
                success: false,
                message: 'Pending request not found'
            });
        }

        // Verify this request is for the current KAM
        if (pendingRequest.kam.toString() !== kamId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to approve this request'
            });
        }

        // Check if already processed
        if (pendingRequest.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `This request has already been ${pendingRequest.status}`
            });
        }

        // Find the target document
        let doc;
        if (pendingRequest.targetType === 'Application') {
            doc = await Application.findById(pendingRequest.targetId).populate('job');
        } else {
            doc = await Profile.findById(pendingRequest.targetId).populate('job_id');
        }

        if (!doc) {
            return res.status(404).json({
                success: false,
                message: 'Application or Profile not found'
            });
        }

        // Update the status
        doc.status = pendingRequest.requestedStatus;

        // Handle commission creation for hired/selected status
        if (pendingRequest.requestedStatus === 'selected' || pendingRequest.requestedStatus === 'hired') {
            doc.hiredAt = new Date();
            if (pendingRequest.targetType === 'Application') {
                doc.commissionEligible = true;
            }

            const job = pendingRequest.targetType === 'Application' ? doc.job : doc.job_id;
            const recruiterId = pendingRequest.targetType === 'Application' ? doc.recruiter : doc.uploaded_by;
            const candidateId = pendingRequest.targetType === 'Application' ? doc.candidate : (doc.candidate_id || null);

            if (recruiterId) {
                // Check if commission already exists
                const existingCommission = await Commission.findOne({
                    [pendingRequest.targetType.toLowerCase()]: doc._id
                });

                if (!existingCommission) {
                    const grossCommission = (job.commission_amount_min + job.commission_amount_max) / 2 || 0;
                    const joinDate = new Date();
                    joinDate.setDate(joinDate.getDate() + 30);

                    const commissionData = {
                        job: job._id,
                        recruiter: recruiterId,
                        client: pendingRequest.client,
                        candidate: candidateId,
                        grossCommission: grossCommission,
                        status: 'pending',
                        platformFee: {
                            percentage: 20,
                            amount: grossCommission * 0.2
                        },
                        netCommission: grossCommission * 0.8,
                        releaseConditions: {
                            candidateJoinDate: joinDate,
                            releasePeriodDays: 60
                        }
                    };

                    if (pendingRequest.targetType === 'Application') {
                        commissionData.application = doc._id;
                    } else {
                        commissionData.profile = doc._id;
                    }

                    const commission = new Commission(commissionData);
                    await commission.save();
                    console.log(`💰 Commission created via KAM approval for ${pendingRequest.targetType} ${doc._id}`);
                }
            }
        }

        await doc.save();

        // Update pending request
        pendingRequest.status = 'approved';
        pendingRequest.reviewedBy = kamId;
        pendingRequest.reviewedAt = new Date();
        pendingRequest.kamNotes = notes || '';
        await pendingRequest.save();

        res.status(200).json({
            success: true,
            message: 'Status change approved successfully',
            data: {
                pendingRequest,
                updatedDocument: doc
            }
        });
    } catch (error) {
        console.error('Error approving pending status change:', error);
        next(error);
    }
};

// @desc    Reject pending status change
// @route   PATCH /api/kam/pending-status-changes/:id/reject
// @access  KAM only
exports.rejectPendingStatusChange = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;
        const kamId = req.user._id;
        const PendingStatusChange = require('../models/PendingStatusChange');

        const pendingRequest = await PendingStatusChange.findById(id);

        if (!pendingRequest) {
            return res.status(404).json({
                success: false,
                message: 'Pending request not found'
            });
        }

        // Verify this request is for the current KAM
        if (pendingRequest.kam.toString() !== kamId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to reject this request'
            });
        }

        // Check if already processed
        if (pendingRequest.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `This request has already been ${pendingRequest.status}`
            });
        }

        // Update pending request (do not change the actual Application/Profile status)
        pendingRequest.status = 'rejected';
        pendingRequest.reviewedBy = kamId;
        pendingRequest.reviewedAt = new Date();
        pendingRequest.kamNotes = notes || '';
        await pendingRequest.save();

        res.status(200).json({
            success: true,
            message: 'Status change request rejected',
            data: pendingRequest
        });
    } catch (error) {
        console.error('Error rejecting pending status change:', error);
        next(error);
    }
};

// @desc    Get all applications for assigned clients' jobs
// @route   GET /api/kam/applications
// @access  KAM only
exports.getClientApplications = async (req, res, next) => {
    try {
        const kamId = req.user._id;
        const { status, jobId, clientId } = req.query;
        const Application = require('../models/Application');

        // Get assigned clients
        const clientIds = await getAssignedClientIds(kamId);

        // Build job filter
        let jobFilter = { postedBy: { $in: clientIds } };
        if (jobId) {
            jobFilter._id = jobId;
        }
        if (clientId && clientIds.includes(clientId)) {
            jobFilter.postedBy = clientId;
        }

        // Get job IDs
        const jobIds = await Job.find(jobFilter).distinct('_id');

        // Fetch Applications
        let appFilter = { job: { $in: jobIds } };
        if (status) {
            appFilter.status = status;
        }

        const applications = await Application.find(appFilter)
            .populate('candidate', 'fullName email')
            .populate('job', 'job_title company_name')
            .populate('recruiter', 'fullName email')
            .sort({ createdAt: -1 });

        // Fetch Profiles
        let profileFilter = { job_id: { $in: jobIds } };
        if (status) {
            profileFilter.status = status;
        }

        const profiles = await Profile.find(profileFilter)
            .populate('job_id', 'job_title company_name')
            .populate('uploaded_by', 'fullName email')
            .sort({ createdAt: -1 });

        // Combine and format
        const formattedApplications = applications.map(app => ({
            id: app._id,
            type: 'Application',
            candidateName: app.candidate?.fullName || 'Unknown',
            candidateEmail: app.candidate?.email || 'N/A',
            jobTitle: app.job?.job_title || 'Unknown Job',
            jobId: app.job?._id,
            status: app.status,
            recruitedBy: app.recruiter?.fullName || 'Direct Application',
            appliedAt: app.createdAt,
            resumeUrl: app.resume?.url
        }));

        const formattedProfiles = profiles.map(profile => ({
            id: profile._id,
            type: 'Profile',
            candidateName: profile.candidate_name || 'Unknown',
            candidateEmail: profile.email || 'N/A',
            jobTitle: profile.job_id?.job_title || 'Unknown Job',
            jobId: profile.job_id?._id,
            status: profile.status,
            recruitedBy: profile.uploaded_by?.fullName || 'Unknown Recruiter',
            appliedAt: profile.createdAt,
            resumeUrl: profile.resume_url
        }));

        const allApplications = [...formattedApplications, ...formattedProfiles]
            .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

        res.status(200).json({
            success: true,
            count: allApplications.length,
            data: allApplications
        });
    } catch (error) {
        console.error('Error getting client applications:', error);
        next(error);
    }
};
// Get pending jobs awaiting KAM approval
exports.getPendingJobs = async (req, res, next) => {
    try {
        const kamId = req.user._id;

        // Get assigned clients
        const clientIds = await getAssignedClientIds(kamId);

        // Get jobs pending approval from assigned clients
        const pendingJobs = await Job.find({
            postedBy: { $in: clientIds },
            approval_status: 'Pending'
        })
            .populate('postedBy', 'fullName email company')
            .sort({ posted_date: -1 });

        res.status(200).json({
            success: true,
            count: pendingJobs.length,
            data: pendingJobs
        });
    } catch (error) {
        console.error('Error fetching pending jobs:', error);
        next(error);
    }
};

// Approve a job
exports.approveJob = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const { notes } = req.body;
        const kamId = req.user._id;

        const job = await Job.findById(jobId).populate('postedBy', 'fullName email');

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Verify this job is from one of KAM's assigned clients
        const clientIds = await getAssignedClientIds(kamId);
        if (!clientIds.some(id => id.toString() === job.postedBy._id.toString())) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to approve this job'
            });
        }

        if (job.approval_status !== 'Pending') {
            return res.status(400).json({
                success: false,
                message: `Job is already ${job.approval_status.toLowerCase()}`
            });
        }

        // Approve the job
        job.approval_status = 'Approved';
        job.approved_by_kam = kamId;
        job.kam_approval_date = new Date();
        job.kam_notes = notes || '';
        job.role_status = 'Active'; // Make job active once approved

        await job.save();

        res.status(200).json({
            success: true,
            message: 'Job approved successfully',
            data: job
        });
    } catch (error) {
        console.error('Error approving job:', error);
        next(error);
    }
};

// Reject a job
exports.rejectJob = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const { notes } = req.body;
        const kamId = req.user._id;

        const job = await Job.findById(jobId).populate('postedBy', 'fullName email');

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Verify this job is from one of KAM's assigned clients
        const clientIds = await getAssignedClientIds(kamId);
        if (!clientIds.some(id => id.toString() === job.postedBy._id.toString())) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to reject this job'
            });
        }

        if (job.approval_status !== 'Pending') {
            return res.status(400).json({
                success: false,
                message: `Job is already ${job.approval_status.toLowerCase()}`
            });
        }

        // Reject the job
        job.approval_status = 'Rejected';
        job.approved_by_kam = kamId;
        job.kam_approval_date = new Date();
        job.kam_notes = notes || '';
        job.role_status = 'Closed'; // Close job when rejected

        await job.save();

        res.status(200).json({
            success: true,
            message: 'Job rejected',
            data: job
        });
    } catch (error) {
        console.error('Error rejecting job:', error);
        next(error);
    }
};
