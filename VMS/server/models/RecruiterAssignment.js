const mongoose = require('mongoose');

const recruiterAssignmentSchema = new mongoose.Schema({
    // Recruiter Manager User Reference
    recruiterManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Recruiter User Reference
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Admin who made the assignment
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Assignment status
    isActive: {
        type: Boolean,
        default: true
    },
    // Assignment metadata
    assignedAt: {
        type: Date,
        default: Date.now
    },
    deactivatedAt: {
        type: Date
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Compound index for uniqueness and fast lookups
recruiterAssignmentSchema.index({ recruiterManager: 1, recruiter: 1 }, { unique: true });
recruiterAssignmentSchema.index({ recruiterManager: 1, isActive: 1 });
recruiterAssignmentSchema.index({ recruiter: 1, isActive: 1 });

// Static method to get active recruiters for a Recruiter Manager
recruiterAssignmentSchema.statics.getActiveRecruitersForRM = async function (rmId) {
    const assignments = await this.find({ recruiterManager: rmId, isActive: true })
        .populate('recruiter', 'fullName email company')
        .sort({ assignedAt: -1 });
    return assignments.map(a => a.recruiter);
};

// Static method to get active Recruiter Managers for a recruiter
recruiterAssignmentSchema.statics.getActiveRMsForRecruiter = async function (recruiterId) {
    const assignments = await this.find({ recruiter: recruiterId, isActive: true })
        .populate('recruiterManager', 'fullName email')
        .sort({ assignedAt: -1 });
    return assignments.map(a => a.recruiterManager);
};

// Static method to check if Recruiter Manager has access to recruiter
recruiterAssignmentSchema.statics.hasRecruiterAccess = async function (rmId, recruiterId) {
    const assignment = await this.findOne({ recruiterManager: rmId, recruiter: recruiterId, isActive: true });
    return !!assignment;
};

module.exports = mongoose.model('RecruiterAssignment', recruiterAssignmentSchema);
