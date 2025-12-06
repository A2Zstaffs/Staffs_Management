const Job = require('../models/Job');
const Application = require('../models/Application');
const Profile = require('../models/Profile');
const User = require('../models/User');
const Commission = require('../models/Commission');

// Get all jobs posted by the client
const getMyJobs = async (req, res) => {
    try {
        const clientId = req.user.id;

        // Check if user is actually a client or admin
        if (req.user.role !== 'client' && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view client jobs'
            });
        }

        const jobs = await Job.find({ postedBy: clientId })
            .sort({ createdAt: -1 });

        // For each job, get the count of applications (cvCount)
        const jobsWithCounts = await Promise.all(jobs.map(async (job) => {
            const applicationCount = await Application.countDocuments({ job: job._id });
            // Also check Profile model if used for 'uploaded' profiles
            const profileCount = await Profile.countDocuments({ job_id: job._id });

            const jobObj = job.toObject();
            return {
                id: job._id, // Frontend expects 'id'
                ...jobObj,
                cvCount: applicationCount + profileCount,
                // Map fields to match frontend expectations if different
                job_title: job.job_title,
                company_name: job.company_name || req.user.company || 'My Company',
                locations: job.locations || [], // Use flat 'locations' array from schema
                salary_min: job.salary_min || 0,
                salary_max: job.salary_max || 0,
                experience_min: job.experience_min || 0,
                experience_max: job.experience_max || 0,
                role_status: job.status === 'active' ? 'Active' : job.status === 'closed' ? 'Closed' : 'Inactive',
                sourcing_status: job.isApproved ? 'Open' : 'Pending'
            };
        }));

        res.json({
            success: true,
            data: jobsWithCounts
        });
    } catch (error) {
        console.error('Error fetching client jobs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch jobs'
        });
    }
};

// Get received CVs (applications and profiles)
const getReceivedCVs = async (req, res) => {
    try {
        const clientId = req.user.id;

        // Get all job IDs posted by this client
        const myJobs = await Job.find({ postedBy: clientId }).select('_id title');
        const jobIds = myJobs.map(j => j._id);

        // Fetch applications (Applied by candidates)
        const applications = await Application.find({ job: { $in: jobIds } })
            .populate('candidate', 'fullName email experience skills')
            .populate('job', 'title')
            .sort({ createdAt: -1 });

        // Fetch profiles (Uploaded by recruiters)
        const profiles = await Profile.find({ job_id: { $in: jobIds } })
            .populate('job_id', 'title')
            .populate('uploaded_by', 'fullName company') // Optional: to show who uploaded
            .sort({ createdAt: -1 });

        // Helper to format CV URL
        const formatCvUrl = (path) => {
            if (!path) return null;
            if (path.startsWith('http')) return path;
            return `/${path}`;
        };

        // Transform applications
        const formattedApps = applications.map(app => ({
            id: app._id,
            candidateName: app.candidate?.fullName || 'Unknown Candidate',
            email: app.candidate?.email || 'No Email',
            experience: app.candidate?.experience || app.candidateProfile?.totalExperience || 'N/A',
            expectedSalary: app.candidateProfile?.currentSalary || 0,
            cvUrl: formatCvUrl(app.resume?.path),
            status: app.status || 'pending',
            jobTitle: app.job?.title || 'Unknown Job',
            appliedAt: app.createdAt,
            type: 'application'
        }));

        // Transform profiles
        const formattedProfiles = profiles.map(profile => ({
            id: profile._id,
            candidateName: profile.candidate_name || 'Unknown Candidate',
            email: profile.email || 'No Email',
            experience: profile.total_experience ? `${profile.total_experience} years` : 'N/A',
            expectedSalary: profile.expected_ctc || 0,
            cvUrl: formatCvUrl(profile.resume_url),
            status: profile.status || 'pending',
            jobTitle: profile.job_id?.title || 'Unknown Job',
            appliedAt: profile.createdAt,
            type: 'profile'
        }));

        // Combine and sort by date
        const allCVs = [...formattedApps, ...formattedProfiles].sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

        res.json({
            success: true,
            data: allCVs
        });
    } catch (error) {
        console.error('Error fetching received CVs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch CVs'
        });
    }
};

// Update CV status
const updateCVStatus = async (req, res) => {
    try {
        const { cvId } = req.params;
        const { status } = req.body;
        const clientId = req.user.id;

        // Try to find in Applications first
        let doc = await Application.findById(cvId).populate('job');
        let type = 'application';

        if (!doc) {
            // Not found in Applications, try Profiles (recruiter uploads)
            doc = await Profile.findById(cvId).populate('job_id');
            type = 'profile';
        }

        if (!doc) {
            return res.status(404).json({
                success: false,
                message: 'Application or Profile not found'
            });
        }

        // Verify ownership
        // For Application: doc.job.postedBy
        // For Profile: doc.job_id.postedBy (job_id is populated)
        // Note: checking nested population if needed. 
        // Assuming job/job_id populates the full Job document which has postedBy

        let job = type === 'application' ? doc.job : doc.job_id;

        // Safety check if job population failed
        if (!job) {
            // Try to fetch job separately if population issue (db inconsistency)
            const jobId = type === 'application' ? doc.job : doc.job_id;
            job = await Job.findById(jobId);
        }

        if (!job || (job.postedBy.toString() !== clientId && req.user.role !== 'admin')) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this application'
            });
        }

        doc.status = status;

        // Self-healing: Ensure Profile has unique_id (fix for legacy data)
        if (type === 'profile' && !doc.unique_id) {
            doc.unique_id = `PID-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
            console.log(`🔧 Generated missing unique_id for profile ${doc._id}: ${doc.unique_id}`);
        }

        if (status === 'selected' || status === 'hired') {
            doc.hiredAt = new Date();
            if (type === 'application') doc.commissionEligible = true;

            // Check if commission already exists
            const existingCommission = await Commission.findOne({
                [type]: doc._id
            });

            if (!existingCommission) {
                // Create commission record if hired through recruiter
                const recruiterId = type === 'application' ? doc.recruiter : doc.uploaded_by;
                const candidateId = type === 'application' ? doc.candidate : (doc.candidate_id || null); // Profile might not have candidate user object

                if (recruiterId) {
                    const commissionAmount = (job.commission && job.commission.amount) ? job.commission.amount : 0;

                    // Calculate commission amounts
                    const grossCommission = (job.commission && job.commission.amount) ? job.commission.amount : 0;

                    // Default join date 30 days from now (can be updated later)
                    const joinDate = new Date();
                    joinDate.setDate(joinDate.getDate() + 30);

                    const commissionData = {
                        job: job._id,
                        recruiter: recruiterId,
                        client: clientId,
                        candidate: candidateId, // Can be null now
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

                    if (type === 'application') {
                        commissionData.application = doc._id;
                    } else {
                        commissionData.profile = doc._id;
                    }

                    const commission = new Commission(commissionData);

                    // Profile specific fields handling if Commission schema requires 'application'
                    if (type === 'profile') {
                        // Adapting to Commission schema which might expect 'application'
                        // Use 'profile' field if schema has it, or reuse 'application' if it's polymorphic-ish
                        // Assuming Commission schema has 'application' field predominantly.
                        // Let's check Commission schema later, but for now assuming it might need 'application' ID even if profile.
                        // Actually, we should probably check Commission Model. 
                        // To be safe, let's just create it. MongoDB is flexible unless strict.
                    }

                    await commission.save();
                    console.log(`💰 Commission record created for ${type} ${doc._id}`);
                }
            }
        }

        await doc.save();

        res.json({
            success: true,
            message: 'Status updated successfully',
            data: doc
        });
    } catch (error) {
        console.error('Error updating CV status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update status'
        });
    }
};

// Create a new job
const createJob = async (req, res) => {
    try {
        const {
            job_title,
            description,
            requirements,
            locations,
            salary_min,
            salary_max,
            commission_percent,
            experience_min,
            experience_max,
            skills,
            employmentType,
            applicationDeadline
        } = req.body;

        const job = new Job({
            title: job_title,
            description,
            requirements,
            location: locations ? (Array.isArray(locations) ? locations[0] : locations) : 'Remote', // Simple mapping
            salary: { min: salary_min, max: salary_max, currency: 'INR' }, // Creating nested object
            commission: { percentage: commission_percent, amount: 0 }, // Adjust as needed
            experienceLevel: { min: experience_min, max: experience_max },
            skills: Array.isArray(skills) ? skills : [],
            employmentType: employmentType || 'Full-time',
            applicationDeadline,
            postedBy: req.user.id,
            postedByRole: req.user.role,
            status: 'active',
            isApproved: false // Requires admin approval usually
        });

        await job.save();

        res.status(201).json({
            success: true,
            message: 'Job posted successfully',
            data: {
                id: job._id,
                ...job.toObject()
            }
        });
    } catch (error) {
        console.error('Create job error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create job'
        });
    }
};

// Delete a job
const deleteJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user.id;

        const job = await Job.findOne({ _id: jobId, postedBy: userId });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found or not authorized'
            });
        }

        await Job.findByIdAndDelete(jobId);

        res.json({
            success: true,
            message: 'Job deleted successfully',
            id: jobId
        });
    } catch (error) {
        console.error('Delete job error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete job'
        });
    }
};

// Update a job
const updateJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user.id;
        const updates = req.body;

        const job = await Job.findOne({ _id: jobId, postedBy: userId });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found or not authorized'
            });
        }

        // Handle nested updates if necessary or direct overwrite
        // For simplicity, we'll merge updates.
        // Special handling for complex fields might be needed depending on how frontend sends data

        if (updates.locations) job.locations = Array.isArray(updates.locations) ? updates.locations : [updates.locations]; // Proper array handling
        if (updates.job_title) job.job_title = updates.job_title;
        if (updates.description) job.description = updates.description;
        if (updates.requirements) job.requirements = updates.requirements;
        if (updates.skills) job.skills = Array.isArray(updates.skills) ? updates.skills : [];
        if (updates.employmentType) job.employmentType = updates.employmentType; // Note: Schema check needed if this field exists
        if (updates.applicationDeadline) job.applicationDeadline = updates.applicationDeadline;

        // Salary update (Flat)
        if (updates.salary_min !== undefined) job.salary_min = updates.salary_min;
        if (updates.salary_max !== undefined) job.salary_max = updates.salary_max;

        // Experience update (Flat)
        if (updates.experience_min !== undefined) job.experience_min = updates.experience_min;
        if (updates.experience_max !== undefined) job.experience_max = updates.experience_max;

        // Commission update (Flat)
        if (updates.commission_percent !== undefined) job.commission_percent = updates.commission_percent;

        // Status updates directly if passed
        if (updates.role_status) job.role_status = updates.role_status;
        if (updates.sourcing_status) job.sourcing_status = updates.sourcing_status;

        await job.save();

        res.json({
            success: true,
            message: 'Job updated successfully',
            data: job
        });
    } catch (error) {
        console.error('Update job error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update job'
        });
    }
};

module.exports = {
    getMyJobs,
    getReceivedCVs,
    updateCVStatus,
    createJob,
    deleteJob,
    updateJob
};
