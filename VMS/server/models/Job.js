const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  company_name: {
    type: String,
    required: true,
    default: 'Blue Kaktus'
  },
  company_logo: {
    type: String,
    default: '' // URL to logo
  },
  job_title: {
    type: String,
    required: true,
    trim: true
  },
  job_id: {
    type: String,
    required: true,
    unique: true
  },
  posted_date: {
    type: Date,
    default: Date.now
  },
  locations: [{
    type: String,
    required: true
  }],
  salary_min: {
    type: Number,
    required: true
  },
  salary_max: {
    type: Number,
    required: true
  },
  experience_min: {
    type: Number,
    required: true
  },
  experience_max: {
    type: Number,
    required: true
  },
  notice_period: {
    type: Number, // in days
    required: true
  },
  num_positions: {
    type: Number,
    required: true
  },
  relevant_level: {
    type: String, // Changed from Number to String to accept 'Mid-level', 'Senior', etc.
    default: ''
  },
  applications_required: {
    type: Number,
    required: true
  },
  in_process_applications: {
    type: Number,
    default: 0
  },
  applicationsCount: {
    type: Number,
    default: 0
  },
  commission_percent: {
    type: Number,
    required: true
  },
  commission_amount_min: {
    type: Number,
    required: true
  },
  commission_amount_max: {
    type: Number,
    required: true
  },
  commission_payment_terms: {
    type: String,
    required: true
  },
  r1_bonus_amount: {
    type: Number,
    default: 0
  },
  r1_bonus_payment_terms: {
    type: String,
    default: ''
  },
  role_status: {
    type: String,
    enum: ['Active', 'Closed', 'Paused', 'Pending'],
    default: 'Pending'
  },
  sourcing_status: {
    type: String,
    enum: ['Priority', 'Normal', 'Low'],
    default: 'Priority'
  },
  description: {
    type: String,
    default: ''
  },
  requirements: {
    type: String,
    default: ''
  },
  skills: [{
    type: String
  }],
  // KAM Approval Fields
  approval_status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  approved_by_kam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  kam_approval_date: {
    type: Date,
    default: null
  },
  kam_notes: {
    type: String,
    default: ''
  },
  // Posted By Information
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postedByRole: {
    type: String,
    enum: ['client', 'consultancy', 'admin'],
    default: 'client'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);
