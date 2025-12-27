const mongoose = require('mongoose');

const pendingStatusChangeSchema = new mongoose.Schema({
    // Application or Profile reference (polymorphic)
    targetType: {
        type: String,
        enum: ['Application', 'Profile'],
        required: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'targetType'
    },

    // Job reference
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },

    // Client who requested the change
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Assigned KAM who needs to approve
    kam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Status information
    currentStatus: {
        type: String,
        required: true
    },
    requestedStatus: {
        type: String,
        required: true,
        enum: [
            'applied',
            'submitted',
            'under_review',
            'shortlisted',
            'interview_scheduled',
            'interviewed',
            'selected',
            'hired',
            'rejected',
            'withdrawn'
        ]
    },

    // Request metadata
    requestedAt: {
        type: Date,
        default: Date.now
    },

    // Approval status
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },

    // Review information
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewedAt: {
        type: Date
    },

    // Notes
    kamNotes: {
        type: String,
        default: ''
    },
    clientNotes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Indexes for efficient querying
pendingStatusChangeSchema.index({ kam: 1, status: 1 });
pendingStatusChangeSchema.index({ client: 1, status: 1 });
pendingStatusChangeSchema.index({ targetType: 1, targetId: 1 });
pendingStatusChangeSchema.index({ job: 1 });
pendingStatusChangeSchema.index({ requestedAt: -1 });
pendingStatusChangeSchema.index({ status: 1, requestedAt: -1 });

module.exports = mongoose.model('PendingStatusChange', pendingStatusChangeSchema);
