const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    // Candidate Basic Information
    candidate_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },

    // Professional Details
    total_experience: {
        type: Number, // in years
        required: true
    },
    current_company: {
        type: String,
        default: ''
    },
    current_designation: {
        type: String,
        default: ''
    },
    current_ctc: {
        type: Number, // in lakhs
        required: true
    },
    expected_ctc: {
        type: Number, // in lakhs
        required: true
    },
    notice_period: {
        type: Number, // in days
        required: true
    },

    // Skills
    skills: [{
        type: String,
        trim: true
    }],

    // Resume
    resume_url: {
        type: String,
        default: ''
    },

    // Status Tracking
    status: {
        type: String,
        enum: ['Available', 'In Process', 'Placed', 'Rejected', 'On Hold'],
        default: 'Available'
    },

    // Job Association
    job_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },

    // Recruiter Information
    uploaded_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    uploaded_by_name: {
        type: String,
        default: ''
    },

    // Additional Notes
    notes: {
        type: String,
        default: ''
    },

    // Interview Details (optional)
    interview_rounds: [{
        round_name: String,
        status: {
            type: String,
            enum: ['Scheduled', 'Cleared', 'Rejected', 'Pending']
        },
        scheduled_date: Date,
        feedback: String
    }]
}, {
    timestamps: true
});

// Index for faster queries
profileSchema.index({ job_id: 1, status: 1 });
profileSchema.index({ uploaded_by: 1 });
profileSchema.index({ email: 1 });

module.exports = mongoose.model('Profile', profileSchema);
