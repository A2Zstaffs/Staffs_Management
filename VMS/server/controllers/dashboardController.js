const Job = require('../models/Job');
const Application = require('../models/Application');
const Commission = require('../models/Commission');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for CV uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/cvs';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cv-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
  }
});

// RECRUITER DASHBOARD CONTROLLER
const getRecruiterDashboard = async (req, res) => {
  try {
    console.log(' Recruiter Dashboard Request Started');
    console.log(' User from token:', req.user);
    
    const recruiterId = req.user.id;
    console.log(' Recruiter ID:', recruiterId);

    // Get recruiter profile with onboarding status
    console.log(' Fetching recruiter profile...');
    const recruiter = await User.findById(recruiterId)
      .select('fullName email recruiterStatus company companyDetails location');

    console.log(' Recruiter found:', recruiter ? 'Yes' : 'No');
    if (!recruiter) {
      console.log(' Recruiter not found in database');
      return res.status(404).json({
        success: false,
        message: 'Recruiter not found'
      });
    }

    console.log(' Recruiter role check:', recruiter.role);
    console.log(' RecruiterStatus exists:', !!recruiter.recruiterStatus);

    // Initialize recruiterStatus if it doesn't exist
    if (!recruiter.recruiterStatus) {
      console.log(' Initializing recruiterStatus for existing user...');
      recruiter.recruiterStatus = {
        onboardingCompleted: false,
        onboardingCallScheduled: false,
        platformTrainingCompleted: false,
        commissionRulesAcknowledged: false,
        earningCurveUnderstood: false,
        firstJobBrowsed: false,
        firstCandidateSubmitted: false,
        totalSubmissions: 0,
        totalEarnings: 0,
        currentMonthEarnings: 0,
        performanceRating: 3
      };
      await recruiter.save();
      console.log('✅ RecruiterStatus initialized');
    }

    // Check if onboarding is required
    const needsOnboarding = !recruiter.recruiterStatus.onboardingCompleted;
    console.log('🎯 Needs onboarding:', needsOnboarding);

    // Get available jobs with detailed information (only if onboarded)
    let availableJobs = [];
    if (!needsOnboarding) {
      console.log('💼 Fetching available jobs...');
      try {
        availableJobs = await Job.find({
          status: 'active'
        })
        .populate('postedBy', 'fullName company businessDetails location')
        .select('title description requirements location salary commission category experienceLevel skills createdAt applicationsCount')
        .sort({ createdAt: -1 })
        .limit(20);
        console.log('✅ Available jobs found:', availableJobs.length);
      } catch (jobError) {
        console.log('❌ Error fetching jobs:', jobError.message);
        availableJobs = [];
      }

      // Mark first job browsed
      if (!recruiter.recruiterStatus.firstJobBrowsed && availableJobs.length > 0) {
        await User.findByIdAndUpdate(recruiterId, {
          'recruiterStatus.firstJobBrowsed': true,
          'recruiterStatus.lastActivityDate': new Date()
        });
      }
    }

    // Get submitted candidates and their status
    console.log('📝 Fetching submitted candidates...');
    let submittedCandidates = [];
    try {
      submittedCandidates = await Application.find({
        recruiter: recruiterId
      })
      .populate('candidate', 'fullName email phoneNumber skills experience')
      .populate({
        path: 'job',
        select: 'title commission postedBy',
        populate: {
          path: 'postedBy',
          select: 'company fullName'
        }
      })
      .select('status appliedVia createdAt clientFeedback cvReviewStatus timeline candidateProfile')
      .sort({ createdAt: -1 });
      console.log('✅ Submitted candidates found:', submittedCandidates.length);
    } catch (appError) {
      console.log('❌ Error fetching applications:', appError.message);
      submittedCandidates = [];
    }

    // Get commission tracker with release information
    console.log('💰 Fetching commissions...');
    let commissions = [];
    try {
      commissions = await Commission.find({
        recruiter: recruiterId
      })
      .populate('job', 'title')
      .populate('client', 'fullName company')
      .populate('candidate', 'fullName')
      .sort({ createdAt: -1 });
      console.log('✅ Commissions found:', commissions.length);
    } catch (commError) {
      console.log('❌ Error fetching commissions:', commError.message);
      commissions = [];
    }

    // Calculate enhanced commission summary
    const commissionSummary = {
      totalEarned: commissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.netCommission, 0),
      pending: commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.netCommission, 0),
      readyForRelease: commissions.filter(c => c.status === 'released').reduce((sum, c) => sum + c.netCommission, 0),
      thisMonth: commissions.filter(c => {
        const thisMonth = new Date();
        thisMonth.setDate(1);
        return c.createdAt >= thisMonth && c.status === 'paid';
      }).reduce((sum, c) => sum + c.netCommission, 0),
      platformFeeDeducted: commissions.reduce((sum, c) => sum + (c.platformFee?.amount || 0), 0)
    };

    // Get performance metrics
    const performanceMetrics = {
      totalSubmissions: submittedCandidates.length,
      successfulPlacements: submittedCandidates.filter(app => app.status === 'joined').length,
      interviewRate: submittedCandidates.filter(app => ['interview_scheduled', 'interviewed', 'offer_made', 'offer_accepted', 'joined'].includes(app.status)).length,
      conversionRate: submittedCandidates.length > 0 ? 
        (submittedCandidates.filter(app => app.status === 'joined').length / submittedCandidates.length * 100).toFixed(2) : 0
    };

    console.log('🎉 Dashboard data compiled successfully');
    console.log('📊 Response summary:', {
      recruiterFound: !!recruiter,
      needsOnboarding,
      jobsCount: availableJobs.length,
      candidatesCount: submittedCandidates.length,
      commissionsCount: commissions.length
    });

    res.json({
      success: true,
      data: {
        recruiterProfile: recruiter,
        needsOnboarding,
        availableJobs,
        submittedCandidates,
        commissions,
        commissionSummary,
        performanceMetrics
      }
    });
  } catch (error) {
    console.error('❌ Recruiter dashboard error:', error);
    console.error('📋 Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recruiter dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get detailed job information for recruiters
const getJobDetails = async (req, res) => {
  try {
    const { jobId } = req.params;
    const recruiterId = req.user.id;

    // Check if recruiter is onboarded
    const recruiter = await User.findById(recruiterId).select('recruiterStatus');
    if (!recruiter.recruiterStatus.onboardingCompleted) {
      return res.status(403).json({
        success: false,
        message: 'Please complete onboarding to view job details'
      });
    }

    const job = await Job.findById(jobId)
      .populate('postedBy', 'fullName company businessDetails location companyDetails')
      .populate({
        path: 'postedBy',
        select: 'fullName company businessDetails location companyDetails'
      });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Calculate recruiter commission (80% of total commission)
    const recruiterCommission = job.commission.amount * 0.8;

    res.json({
      success: true,
      data: {
        ...job.toObject(),
        recruiterCommission,
        platformFee: job.commission.amount * 0.2,
        clientInfo: {
          company: job.postedBy.company,
          industry: job.postedBy.businessDetails?.industry || job.postedBy.companyDetails?.industry,
          location: job.postedBy.location,
          size: job.postedBy.businessDetails?.size || job.postedBy.companyDetails?.size
        }
      }
    });
  } catch (error) {
    console.error('Job details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job details'
    });
  }
};

// Submit candidate for a job
const submitCandidate = async (req, res) => {
  try {
    const { jobId } = req.params;
    const recruiterId = req.user.id;
    const {
      candidateEmail,
      candidateProfile,
      recruiterNotes
    } = req.body;

    // Check if recruiter is onboarded
    const recruiter = await User.findById(recruiterId).select('recruiterStatus');
    if (!recruiter.recruiterStatus.onboardingCompleted) {
      return res.status(403).json({
        success: false,
        message: 'Please complete onboarding to submit candidates'
      });
    }

    // Find or create candidate
    let candidate = await User.findOne({ email: candidateEmail });
    if (!candidate) {
      // Create basic candidate profile
      candidate = new User({
        fullName: candidateProfile.fullName,
        email: candidateEmail,
        phoneNumber: candidateProfile.phoneNumber,
        role: 'candidate',
        skills: candidateProfile.keySkills || [],
        experience: candidateProfile.totalExperience,
        password: 'temp123456' // Temporary password, candidate will reset
      });
      await candidate.save();
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: candidate._id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'Candidate has already been submitted for this job'
      });
    }

    // Create application
    const application = new Application({
      job: jobId,
      candidate: candidate._id,
      recruiter: recruiterId,
      status: 'submitted',
      appliedVia: 'recruiter',
      candidateProfile,
      recruiterNotes,
      resume: req.file ? {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimeType: req.file.mimetype,
        uploadedBy: recruiterId
      } : undefined
    });

    await application.save();

    // Update recruiter stats
    await User.findByIdAndUpdate(recruiterId, {
      $inc: { 'recruiterStatus.totalSubmissions': 1 },
      'recruiterStatus.firstCandidateSubmitted': true,
      'recruiterStatus.lastActivityDate': new Date()
    });

    // Update job application count
    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicationsCount: 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Candidate submitted successfully',
      data: {
        applicationId: application._id,
        status: application.status
      }
    });
  } catch (error) {
    console.error('Submit candidate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit candidate'
    });
  }
};

// Track CV status
const getCVStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const recruiterId = req.user.id;

    const application = await Application.findOne({
      _id: applicationId,
      recruiter: recruiterId
    })
    .populate('candidate', 'fullName email')
    .populate('job', 'title commission')
    .select('status cvReviewStatus timeline createdAt');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: {
        application,
        statusFlow: [
          'submitted',
          'internal_review',
          'client_review',
          'shortlisted',
          'interview_scheduled',
          'interviewed',
          'offer_made',
          'offer_accepted',
          'joined'
        ],
        currentStage: application.status
      }
    });
  } catch (error) {
    console.error('CV status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch CV status'
    });
  }
};

// CLIENT DASHBOARD CONTROLLERS
const getClientDashboard = async (req, res) => {
  try {
    const clientId = req.user.id;

    // Get client's posted jobs
    const postedJobs = await Job.find({
      postedBy: clientId,
      postedByRole: 'client'
    })
    .select('title status applicationsCount createdAt commission')
    .sort({ createdAt: -1 });

    // Get applications for client's jobs
    const applications = await Application.find({
      job: { $in: postedJobs.map(job => job._id) }
    })
    .populate('candidate', 'fullName email phoneNumber skills experience')
    .populate('recruiter', 'fullName company')
    .populate('job', 'title')
    .sort({ createdAt: -1 });

    // Get shortlisted candidates
    const shortlistedCandidates = applications.filter(app => 
      ['shortlisted', 'interview_scheduled', 'interviewed'].includes(app.status)
    );

    // Get hires and commission payments
    const hires = await Application.find({
      job: { $in: postedJobs.map(job => job._id) },
      status: 'selected'
    })
    .populate('candidate', 'fullName email')
    .populate('recruiter', 'fullName company')
    .populate('job', 'title commission');

    const commissionPayments = await Commission.find({
      client: clientId
    })
    .populate('recruiter', 'fullName company')
    .populate('job', 'title')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        postedJobs,
        applications,
        shortlistedCandidates,
        hires,
        commissionPayments,
        summary: {
          totalJobs: postedJobs.length,
          activeJobs: postedJobs.filter(job => job.status === 'active').length,
          totalApplications: applications.length,
          totalHires: hires.length
        }
      }
    });
  } catch (error) {
    console.error('Client dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch client dashboard data'
    });
  }
};

// CANDIDATE DASHBOARD CONTROLLERS
const getCandidateDashboard = async (req, res) => {
  try {
    const candidateId = req.user.id;

    // Get candidate profile
    const candidate = await User.findById(candidateId)
      .select('fullName email phoneNumber location skills experience');

    // Get available jobs
    const availableJobs = await Job.find({
      status: 'active',
      isApproved: true
    })
    .populate('postedBy', 'fullName company')
    .select('title description location salary category experienceLevel createdAt skills')
    .sort({ createdAt: -1 })
    .limit(20);

    // Get candidate's applications
    const applications = await Application.find({
      candidate: candidateId
    })
    .populate('job', 'title company location salary')
    .populate('recruiter', 'fullName company')
    .select('status appliedVia createdAt clientFeedback interviewDetails')
    .sort({ createdAt: -1 });

    // Application status summary
    const statusSummary = {
      applied: applications.filter(app => app.status === 'applied').length,
      under_review: applications.filter(app => app.status === 'under_review').length,
      shortlisted: applications.filter(app => app.status === 'shortlisted').length,
      interviewed: applications.filter(app => app.status === 'interviewed').length,
      selected: applications.filter(app => app.status === 'selected').length,
      rejected: applications.filter(app => app.status === 'rejected').length
    };

    res.json({
      success: true,
      data: {
        profile: candidate,
        availableJobs,
        applications,
        statusSummary
      }
    });
  } catch (error) {
    console.error('Candidate dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch candidate dashboard data'
    });
  }
};

// CONSULTANCY DASHBOARD CONTROLLERS
const getConsultancyDashboard = async (req, res) => {
  try {
    const consultancyId = req.user.id;

    // Get consultancy's posted jobs
    const postedJobs = await Job.find({
      postedBy: consultancyId,
      postedByRole: 'consultancy'
    })
    .select('title status applicationsCount createdAt commission isApproved')
    .sort({ createdAt: -1 });

    // Get approved jobs visible to recruiters
    const approvedJobs = postedJobs.filter(job => job.isApproved);

    // Get commission earnings
    const commissions = await Commission.find({
      job: { $in: postedJobs.map(job => job._id) }
    })
    .populate('recruiter', 'fullName company')
    .populate('job', 'title')
    .populate('candidate', 'fullName')
    .sort({ createdAt: -1 });

    // Calculate earnings after platform fee
    const earningsSummary = {
      totalEarned: commissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.platformFee.amount, 0),
      pending: commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.platformFee.amount, 0),
      thisMonth: commissions.filter(c => {
        const thisMonth = new Date();
        thisMonth.setDate(1);
        return c.createdAt >= thisMonth && c.status === 'paid';
      }).reduce((sum, c) => sum + c.platformFee.amount, 0)
    };

    res.json({
      success: true,
      data: {
        postedJobs,
        approvedJobs,
        commissions,
        earningsSummary,
        summary: {
          totalJobs: postedJobs.length,
          approvedJobs: approvedJobs.length,
          pendingApproval: postedJobs.filter(job => !job.isApproved).length
        }
      }
    });
  } catch (error) {
    console.error('Consultancy dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch consultancy dashboard data'
    });
  }
};

// JOB MANAGEMENT CONTROLLERS
const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      location,
      salary,
      commission,
      category,
      experienceLevel,
      employmentType,
      skills,
      applicationDeadline
    } = req.body;

    const job = new Job({
      title,
      description,
      requirements,
      location,
      salary,
      commission,
      category,
      experienceLevel,
      employmentType,
      skills,
      applicationDeadline,
      postedBy: req.user.id,
      postedByRole: req.user.role
    });

    await job.save();

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      data: job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create job'
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, feedback, interviewDetails } = req.body;

    const application = await Application.findById(applicationId)
      .populate('job');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user has permission to update this application
    if (application.job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }

    application.status = status;
    
    if (feedback) {
      application.clientFeedback = {
        ...feedback,
        providedAt: new Date(),
        providedBy: req.user.id
      };
    }

    if (interviewDetails) {
      application.interviewDetails = interviewDetails;
    }

    if (status === 'selected') {
      application.hiredAt = new Date();
      application.commissionEligible = true;
      
      // Create commission record if hired through recruiter
      if (application.recruiter) {
        const commission = new Commission({
          application: application._id,
          job: application.job._id,
          recruiter: application.recruiter,
          client: req.user.id,
          candidate: application.candidate,
          grossCommission: application.job.commission.amount
        });
        await commission.save();
      }
    }

    await application.save();

    res.json({
      success: true,
      message: 'Application status updated successfully',
      data: application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application status'
    });
  }
};

const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job'
      });
    }

    const application = new Application({
      job: jobId,
      candidate: req.user.id,
      coverLetter,
      appliedVia: 'direct'
    });

    await application.save();

    // Update job applications count
    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicationsCount: 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    console.error('Apply to job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application'
    });
  }
};

module.exports = {
  getRecruiterDashboard,
  getClientDashboard,
  getCandidateDashboard,
  getConsultancyDashboard,
  createJob,
  updateApplicationStatus,
  applyToJob,
  getJobDetails,
  submitCandidate,
  getCVStatus,
  upload
};
