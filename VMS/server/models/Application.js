const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: [
      'applied',           // Candidate applied directly
      'submitted',         // Recruiter submitted candidate
      'under_review',      // Client is reviewing
      'shortlisted',       // Client shortlisted
      'interview_scheduled', // Interview scheduled
      'interviewed',       // Interview completed
      'selected',          // Candidate selected
      'hired',             // Candidate hired
      'rejected',          // Application rejected
      'withdrawn'          // Candidate withdrew
    ],
    default: 'applied'
  },
  appliedVia: {
    type: String,
    enum: ['direct', 'recruiter'],
    default: 'direct'
  },
  coverLetter: String,
  resume: {
    filename: String,
    url: String,
    uploadedAt: Date
  },
  clientFeedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String,
    providedAt: Date,
    providedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  interviewDetails: {
    scheduledAt: Date,
    mode: {
      type: String,
      enum: ['in-person', 'video', 'phone']
    },
    location: String,
    notes: String
  },
  timeline: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  }],
  commissionEligible: {
    type: Boolean,
    default: false
  },
  commissionPaid: {
    type: Boolean,
    default: false
  },
  commissionAmount: Number,
  hiredAt: Date
}, {
  timestamps: true
});

// Compound indexes for better query performance
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });
applicationSchema.index({ candidate: 1, status: 1 });
applicationSchema.index({ recruiter: 1, status: 1 });
applicationSchema.index({ job: 1, status: 1 });
applicationSchema.index({ createdAt: -1 });

// Pre-save middleware to update timeline
applicationSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    this.timeline.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema);
