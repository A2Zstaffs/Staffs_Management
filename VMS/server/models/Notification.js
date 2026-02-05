const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Notification title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    message: {
        type: String,
        required: [true, 'Notification message is required'],
        trim: true,
        maxlength: [500, 'Message cannot exceed 500 characters']
    },
    targetAudience: {
        type: String,
        required: [true, 'Target audience is required'],
        enum: ['all', 'clients', 'recruiters'],
        default: 'all'
    },
    priority: {
        type: String,
        enum: ['low', 'normal', 'high'],
        default: 'normal'
    },
    link: {
        type: String,
        trim: true,
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    readBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    expiresAt: {
        type: Date,
        default: null // null means never expires
    }
}, {
    timestamps: true
});

// Index for efficient queries
notificationSchema.index({ targetAudience: 1, isActive: 1, createdAt: -1 });
notificationSchema.index({ 'readBy.user': 1 });

// Method to check if a user has read this notification
notificationSchema.methods.isReadByUser = function (userId) {
    return this.readBy.some(r => r.user.toString() === userId.toString());
};

// Method to mark as read by a user
notificationSchema.methods.markAsRead = async function (userId) {
    if (!this.isReadByUser(userId)) {
        this.readBy.push({ user: userId, readAt: new Date() });
        await this.save();
    }
    return this;
};

// Static method to get notifications for a user based on their role
notificationSchema.statics.getForUser = async function (user) {
    const query = {
        isActive: true,
        $or: [
            { expiresAt: null },
            { expiresAt: { $gt: new Date() } }
        ]
    };

    // Filter by target audience
    if (user.role === 'client') {
        query.targetAudience = { $in: ['all', 'clients'] };
    } else if (user.role === 'recruiter') {
        query.targetAudience = { $in: ['all', 'recruiters'] };
    } else {
        // For other roles (admin, kam, etc.), show all
        query.targetAudience = { $in: ['all', 'clients', 'recruiters'] };
    }

    const notifications = await this.find(query)
        .populate('createdBy', 'fullName')
        .sort({ createdAt: -1 })
        .limit(20);

    // Add isRead flag for each notification
    return notifications.map(notification => ({
        ...notification.toObject(),
        isRead: notification.isReadByUser(user._id)
    }));
};

module.exports = mongoose.model('Notification', notificationSchema);
