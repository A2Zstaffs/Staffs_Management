// @ts-nocheck
const mongoose = require('mongoose');

const clientAssignmentSchema = new mongoose.Schema({
    // KAM User Reference
    kam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Client User Reference
    client: {
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
clientAssignmentSchema.index({ kam: 1, client: 1 }, { unique: true });
clientAssignmentSchema.index({ kam: 1, isActive: 1 });
clientAssignmentSchema.index({ client: 1, isActive: 1 });

// Static method to get active clients for a KAM
clientAssignmentSchema.statics.getActiveClientsForKam = async function (kamId) {
    const assignments = await this.find({ kam: kamId, isActive: true })
        .populate('client', 'fullName email company')
        .sort({ assignedAt: -1 });
    return assignments.map(a => a.client);
};

// Static method to get active KAMs for a client
clientAssignmentSchema.statics.getActiveKamsForClient = async function (clientId) {
    const assignments = await this.find({ client: clientId, isActive: true })
        .populate('kam', 'fullName email')
        .sort({ assignedAt: -1 });
    return assignments.map(a => a.kam);
};

// Static method to check if KAM has access to client
clientAssignmentSchema.statics.hasClientAccess = async function (kamId, clientId) {
    const assignment = await this.findOne({ kam: kamId, client: clientId, isActive: true });
    return !!assignment;
};

module.exports = mongoose.model('ClientAssignment', clientAssignmentSchema);
