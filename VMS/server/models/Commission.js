const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: false // Changed from true to support Profile-based hires
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Changed from true to support Profiles without User accounts
  },
  grossCommission: {
    type: Number,
    required: true
  },
  platformFee: {
    percentage: {
      type: Number,
      default: 20 // 20% platform fee (A2Z cut)
    },
    amount: {
      type: Number,
      required: true
    }
  },
  netCommission: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'released', 'paid', 'disputed', 'cancelled'],
    default: 'pending'
  },
  releaseConditions: {
    candidateJoinDate: {
      type: Date,
      required: true
    },
    releasePeriodDays: {
      type: Number,
      enum: [60, 90],
      default: 60
    },
    releaseDate: {
      type: Date,
      required: function () {
        return this.candidateJoinDate && this.releasePeriodDays;
      }
    },
    isEligibleForRelease: {
      type: Boolean,
      default: false
    }
  },
  paymentDetails: {
    method: String,
    transactionId: String,
    paidAt: Date,
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  invoiceNumber: String,
  dueDate: Date,
  notes: String
}, {
  timestamps: true
});

// Calculate net commission and release date before saving
commissionSchema.pre('save', function (next) {
  // Calculate commission amounts
  if (this.isModified('grossCommission') || this.isModified('platformFee.percentage')) {
    this.platformFee.amount = (this.grossCommission * this.platformFee.percentage) / 100;
    this.netCommission = this.grossCommission - this.platformFee.amount;
  }

  // Calculate release date
  if (this.isModified('releaseConditions.candidateJoinDate') || this.isModified('releaseConditions.releasePeriodDays')) {
    if (this.releaseConditions.candidateJoinDate && this.releaseConditions.releasePeriodDays) {
      const joinDate = new Date(this.releaseConditions.candidateJoinDate);
      const releaseDate = new Date(joinDate);
      releaseDate.setDate(joinDate.getDate() + this.releaseConditions.releasePeriodDays);
      this.releaseConditions.releaseDate = releaseDate;

      // Check if eligible for release
      this.releaseConditions.isEligibleForRelease = new Date() >= releaseDate;
    }
  }

  next();
});

// Instance method to check if commission can be released
commissionSchema.methods.canBeReleased = function () {
  if (!this.releaseConditions.releaseDate) return false;
  return new Date() >= this.releaseConditions.releaseDate && this.status === 'approved';
};

// Static method to find commissions ready for release
commissionSchema.statics.findReadyForRelease = function () {
  const now = new Date();
  return this.find({
    status: 'approved',
    'releaseConditions.releaseDate': { $lte: now },
    'releaseConditions.isEligibleForRelease': true
  });
};

// Indexes
commissionSchema.index({ recruiter: 1, status: 1 });
commissionSchema.index({ client: 1, status: 1 });
commissionSchema.index({ job: 1 });
commissionSchema.index({ 'releaseConditions.releaseDate': 1, status: 1 });
commissionSchema.index({ 'releaseConditions.isEligibleForRelease': 1 });
commissionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Commission', commissionSchema);
