const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information (Common for all roles)
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't include password in queries by default
  },
  phoneNumber: {
    type: String,
    required: false, // Optional at signup, required for profile completion
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['candidate', 'recruiter', 'client', 'consultancy', 'admin', 'kam', 'recruiter_manager'],
    default: 'candidate'
  },
  // Permissions for RBAC (primarily for KAM and Recruiter Manager roles)
  permissions: {
    type: [String],
    default: [],
    enum: [
      'client:view_assigned',
      'client:manage_assigned',
      'job:view_assigned',
      'cv:view_assigned',
      'cv:shortlist',
      'cv:share_with_client',
      'feedback:view',
      'recruiter:view_assigned',
      'recruiter:manage_assigned',
      'job:view_all',
      'profile:view_all',
      'profile:upload',
      'application:manage'
    ]
  },
  // Location Information
  location: {
    country: {
      type: String,
      required: function () {
        // Only required when profile is complete
        return this.profileCompleted && (this.role === 'recruiter' || this.role === 'client' || this.role === 'consultancy');
      }
    },
    city: String,
    state: String,
    address: String
  },
  // Candidate-specific fields
  skills: {
    type: [String],
    required: function () {
      return this.profileCompleted && this.role === 'candidate';
    }
  },
  // Detailed Profile Fields
  linkedinProfile: String,
  portfolio: [{
    title: String,
    link: String,
    description: String
  }],
  workExperience: [{
    company: String,
    role: String,
    startDate: Date,
    endDate: Date,
    isCurrent: Boolean,
    description: String
  }],
  education: [{
    institution: String,
    degree: String,
    fieldOfStudy: String,
    graduationYear: String,
    description: String
  }],
  certifications: [{
    name: String,
    issuer: String,
    year: String
  }],
  preferences: {
    expectedSalary: {
      min: Number,
      max: Number,
      currency: { type: String, default: 'USD' }
    },
    preferredLocations: [String],
    jobTypes: [{ type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'] }],
    noticePeriod: String
  },

  // Legacy simple experience field (kept for backward compatibility if needed, or migration)
  experience: {
    type: String,
    required: function () {
      return this.profileCompleted && this.role === 'candidate';
    },
    enum: ['0-1', '2-5', '6-10', '10+']
  },
  resume: {
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    uploadDate: Date
  },
  // Recruiter-specific fields
  company: {
    type: String,
    required: function () {
      return this.profileCompleted && (this.role === 'recruiter' || this.role === 'client' || this.role === 'consultancy');
    }
  },
  companyDetails: {
    size: {
      type: String,
      required: function () {
        return this.profileCompleted && this.role === 'recruiter';
      },
      enum: ['1-10', '11-50', '51-200', '201-500', '500+']
    },
    industry: {
      type: String,
      required: function () {
        return this.profileCompleted && this.role === 'recruiter';
      }
    },
    website: String,
    description: String
  },

  // Client-specific fields
  businessDetails: {
    type: {
      type: String,
      required: function () {
        return this.profileCompleted && this.role === 'client';
      },
      enum: ['startup', 'small-business', 'enterprise', 'non-profit', 'government']
    },
    size: {
      type: String,
      required: function () {
        return this.profileCompleted && this.role === 'client';
      },
      enum: ['1-10', '11-50', '51-200', '201-500', '500+']
    },
    industry: {
      type: String,
      required: function () {
        return this.profileCompleted && this.role === 'client';
      }
    }
  },
  financials: {
    budget: {
      type: String,
      required: function () {
        return this.profileCompleted && this.role === 'client';
      },
      enum: ['<10k', '10k-50k', '50k-100k', '100k-500k', '500k+']
    }
  },

  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  profileCompleted: {
    type: Boolean,
    default: false
  },
  lastLogin: Date,

  // Profile Information
  profilePicture: {
    filename: String,
    path: String,
    uploadDate: Date
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'location.country': 1 });
userSchema.index({ skills: 1 });
userSchema.index({ permissions: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get public profile
userSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Instance method to check if user has a specific permission
userSchema.methods.hasPermission = function (permission) {
  return this.permissions && this.permissions.includes(permission);
};

// Static method to find by email
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Virtual for full location
userSchema.virtual('fullLocation').get(function () {
  const parts = [];
  if (this.location.city) parts.push(this.location.city);
  if (this.location.state) parts.push(this.location.state);
  if (this.location.country) parts.push(this.location.country);
  return parts.join(', ');
});

module.exports = mongoose.model('User', userSchema);
