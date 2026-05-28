const User = require('../models/User');
const { sendTokenResponse } = require('../middleware/auth');

// Helper function to prepare user data based on role
const prepareUserData = (userData) => {
  const { role } = userData;
  const baseData = {
    fullName: userData.fullName,
    email: userData.email,
    password: userData.password,
    role: userData.role,
    profileCompleted: false // New users start with incomplete profiles
  };

  // Only include phoneNumber if provided
  if (userData.phoneNumber) {
    baseData.phoneNumber = userData.phoneNumber;
  }

  // Only include location if provided
  if (userData.location) {
    if (typeof userData.location === 'string') {
      const locationParts = userData.location.split(',').map(part => part.trim());
      baseData.location = {
        city: locationParts[0] || userData.location
      };
      if (locationParts[1]) {
        baseData.location.country = locationParts[1];
      }
    } else if (typeof userData.location === 'object') {
      baseData.location = userData.location;
    }
  }

  // Include role-specific fields only if provided
  switch (role) {
    case 'candidate':
      if (userData.skills) {
        baseData.skills = Array.isArray(userData.skills)
          ? userData.skills
          : userData.skills.split(',').map(skill => skill.trim());
      }
      if (userData.experience) {
        baseData.experience = userData.experience;
      }
      break;

    case 'recruiter':
      if (userData.company) baseData.company = userData.company;
      if (userData.companyDetails) baseData.companyDetails = userData.companyDetails;
      break;

    case 'client':
      if (userData.company) baseData.company = userData.company;
      if (userData.businessDetails) baseData.businessDetails = userData.businessDetails;
      if (userData.financials) baseData.financials = userData.financials;
      break;

    case 'consultancy':
      if (userData.company) baseData.company = userData.company;
      break;
  }

  return baseData;
};


// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  console.log('🚀 [Signup] Request received:', {
    email: req.body.email,
    role: req.body.role,
    hasToken: !!req.headers.authorization
  });

  try {
    const userData = prepareUserData(req.body);
    console.log('🛠 [Signup] Prepared user data:', { ...userData, password: '***' });

    // Check if user already exists
    const existingUser = await User.findByEmail(userData.email);
    if (existingUser) {
      console.log('⚠️ [Signup] Email already exists:', userData.email);
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user (with isEmailVerified = false by default)
    console.log('💾 [Signup] Attempting to create user in DB...');
    const user = await User.create(userData);
    console.log('✅ [Signup] User created successfully:', user._id);

    // Generate and send verification OTP
    const { generateOTP, storeOTP } = require('../utils/otpStore');
    const { sendSignupOTPEmail } = require('../utils/emailService');

    const otp = generateOTP();
    storeOTP(user.email, otp);

    // Send verification email
    await sendSignupOTPEmail(user.email, otp, user.fullName);

    console.log('✅ [Signup] Verification OTP sent to:', user.email);

    // Return success without auto-login
    res.status(201).json({
      success: true,
      message: 'Account created! Please check your email to verify your account.',
      data: {
        email: user.email,
        requiresVerification: true
      }
    });

  } catch (error) {
    console.error('❌ [Signup] Error:', error);
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  console.log('🚀 [Login] Request received:', { email: req.body.email, rememberMe: req.body.rememberMe });

  try {
    const { email, password, role, rememberMe } = req.body;

    // Validate email & password
    if (!email || !password) {
      console.log('⚠️ [Login] Missing credentials');
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    // Check for user (include password field)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('⚠️ [Login] User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('✅ [Login] User found, checking password...');

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      console.log('⚠️ [Login] Invalid password');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('✅ [Login] Password correct, checking email verification...');

    // Check if email is verified (only for users created after email verification feature was implemented)
    // Legacy users (created before Jan 4, 2026) are exempt from email verification
    const emailVerificationCutoffDate = new Date('2026-01-04T00:00:00.000Z');
    const isLegacyUser = user.createdAt < emailVerificationCutoffDate;

    if (!user.isEmailVerified && !isLegacyUser) {
      console.log('⚠️ [Login] Email not verified for:', email);
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in. Check your inbox for the verification code.',
        requiresVerification: true,
        email: user.email
      });
    }

    if (isLegacyUser && !user.isEmailVerified) {
      console.log('ℹ️ [Login] Legacy user detected, skipping email verification:', email);
    }

    // Check if user is suspended
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact A2Z Staffs support at support@a2zstaffs.com'
      });
    }

    // Check if role matches (if provided)
    if (role && user.role !== role) {
      console.log('⚠️ [Login] Role mismatch - Expected:', role, 'Got:', user.role);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    console.log('✅ [Login] Login successful for:', email);
    sendTokenResponse(user, 200, res, !!rememberMe);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      message: 'User logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = { ...req.body };

    // Remove sensitive fields
    delete fieldsToUpdate.password;
    delete fieldsToUpdate.role;
    delete fieldsToUpdate.email;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Update profile error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during profile update: ' + error.message,
      error: error.message
    });
  }
};

// @desc    Google OAuth login/signup
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
  console.log('🔐 [Google Auth] Request received');

  try {
    const { OAuth2Client } = require('google-auth-library');
    const { idToken } = req.body;
    // Always default new Google signups to 'candidate'. Privileged roles (admin/kam/recruiter_manager/recruiter)
    // must be promoted by an admin via the admin user-management flow, never accepted from the client.
    const role = 'candidate';

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token is required'
      });
    }

    // Verify Google ID token
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (verifyError) {
      console.error('❌ [Google Auth] Token verification failed:', verifyError.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid Google token'
      });
    }

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    console.log('✅ [Google Auth] Token verified for:', email);

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      console.log('✅ [Google Auth] Existing user found:', user._id);

      // Update profile picture if from Google and not already set
      if (picture && !user.profilePicture) {
        user.profilePicture = picture;
        await user.save({ validateBeforeSave: false });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });

      return sendTokenResponse(user, 200, res);
    }

    // Create new user
    console.log('💾 [Google Auth] Creating new user from Google account');

    const userData = {
      fullName: name,
      email,
      password: Math.random().toString(36).slice(-8) + 'Aa1!', // Random password for Google users
      role,
      profilePicture: picture,
      isActive: true,
      profileCompleted: false
    };

    user = await User.create(userData);
    console.log('✅ [Google Auth] New user created:', user._id);

    sendTokenResponse(user, 201, res);

  } catch (error) {
    console.error('❌ [Google Auth] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during Google authentication',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Request forgot password OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  console.log('🔐 [Forgot Password] Request received');

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // For security, don't reveal if email exists
      return res.status(200).json({
        success: true,
        message: 'If the email exists, an OTP has been sent'
      });
    }

    // Generate and store OTP
    const { generateOTP, storeOTP } = require('../utils/otpStore');
    const { sendOTPEmail } = require('../utils/emailService');

    const otp = generateOTP();
    storeOTP(email, otp);

    // Send OTP email
    await sendOTPEmail(email, otp, user.fullName);

    console.log(`✅ [Forgot Password] OTP sent to ${email}`);

    res.status(200).json({
      success: true,
      message: 'OTP has been sent to your email'
    });

  } catch (error) {
    console.error('❌ [Forgot Password] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  console.log('🔐 [Verify OTP] Request received');

  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Verify OTP
    const { verifyOTP: verifyOTPFunc } = require('../utils/otpStore');
    const result = verifyOTPFunc(email, otp);

    if (!result.success) {
      console.log(`❌ [Verify OTP] Failed for ${email}: ${result.message}`);
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    console.log(`✅ [Verify OTP] Success for ${email}`);

    res.status(200).json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error('❌ [Verify OTP] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  console.log('🔐 [Reset Password] Request received');

  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email and new password are required'
      });
    }

    // Check if OTP was verified
    const { isOTPVerified, deleteOTP } = require('../utils/otpStore');

    if (!isOTPVerified(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please verify OTP first'
      });
    }

    // Validate password
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Find user and update password
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      deleteOTP(email);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    // Delete OTP after successful reset
    deleteOTP(email);

    console.log(`✅ [Reset Password] Password reset successful for ${email}`);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.'
    });

  } catch (error) {
    console.error('❌ [Reset Password] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Verify signup OTP and activate account
// @route   POST /api/auth/verify-signup-otp
// @access  Public
const verifySignupOTP = async (req, res) => {
  console.log('🔐 [Verify Signup OTP] Request received');

  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Verify OTP
    const { verifyOTP: verifyOTPFunc } = require('../utils/otpStore');
    const result = verifyOTPFunc(email, otp);

    if (!result.success) {
      console.log(`❌ [Verify Signup OTP] Failed for ${email}: ${result.message}`);
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    // Find user and mark as verified
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    await user.save();

    // Delete OTP after successful verification
    const { deleteOTP } = require('../utils/otpStore');
    deleteOTP(email);

    console.log(`✅ [Verify Signup OTP] Email verified successfully for ${email}`);

    // Auto-login user by sending token response
    sendTokenResponse(user, 200, res);

  } catch (error) {
    console.error('❌ [Verify Signup OTP] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify email',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Resend signup verification OTP
// @route   POST /api/auth/resend-signup-otp
// @access  Public
const resendSignupOTP = async (req, res) => {
  console.log('🔐 [Resend Signup OTP] Request received');

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified. You can login now.'
      });
    }

    // Generate and send new OTP
    const { generateOTP, storeOTP } = require('../utils/otpStore');
    const { sendSignupOTPEmail } = require('../utils/emailService');

    const otp = generateOTP();
    storeOTP(user.email, otp);

    // Send verification email
    await sendSignupOTPEmail(user.email, otp, user.fullName);

    console.log(`✅ [Resend Signup OTP] New OTP sent to: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Verification code has been resent to your email'
    });

  } catch (error) {
    console.error('❌ [Resend Signup OTP] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification code',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  signup,
  login,
  getMe,
  logout,
  updateProfile,
  googleAuth,
  forgotPassword,
  verifyOTP,
  resetPassword,
  verifySignupOTP,
  resendSignupOTP
};
