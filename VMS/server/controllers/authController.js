const User = require('../models/User');
const { sendTokenResponse } = require('../middleware/auth');

// Helper function to prepare user data based on role
const prepareUserData = (userData) => {
  const { role } = userData;
  const baseData = {
    fullName: userData.fullName,
    email: userData.email,
    password: userData.password,
    phoneNumber: userData.phoneNumber,
    role: userData.role
  };

  // Parse location - handle both string and object formats
  if (userData.location) {
    if (typeof userData.location === 'string') {
      // If location is a string, parse it (e.g., "City, Country" or just "City")
      const locationParts = userData.location.split(',').map(part => part.trim());
      baseData.location = {
        city: locationParts[0] || userData.location
      };
      // Only add country if provided or if required for the role
      if (locationParts[1]) {
        baseData.location.country = locationParts[1];
      } else if (role !== 'candidate') {
        // Non-candidates require country, candidates don't
        baseData.location.country = 'USA'; // Default
      }
    } else if (typeof userData.location === 'object') {
      // If location is already an object, use it directly
      baseData.location = userData.location;
    }
  } else if (role !== 'candidate') {
    // Non-candidates require location with country
    baseData.location = { country: 'USA' };
  }

  switch (role) {
    case 'candidate':
      return {
        ...baseData,
        skills: Array.isArray(userData.skills) 
          ? userData.skills 
          : (userData.skills ? userData.skills.split(',').map(skill => skill.trim()) : []),
        experience: userData.experience
      };

    case 'recruiter':
      return {
        ...baseData,
        company: userData.company,
        companyDetails: userData.companyDetails || {},
        location: baseData.location || userData.location || { country: 'USA' }
      };

    case 'client':
      return {
        ...baseData,
        company: userData.company,
        businessDetails: userData.businessDetails || {},
        financials: userData.financials || {},
        location: baseData.location || userData.location || { country: 'USA' }
      };

    case 'consultancy':
      return {
        ...baseData,
        company: userData.company,
        location: baseData.location || userData.location || { country: 'USA' }
      };

    default:
      return baseData;
  }
};     


// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const userData = prepareUserData(req.body);

    // Check if user already exists
    const existingUser = await User.findByEmail(userData.email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create(userData);
    
    // Verify user was actually saved
    const savedUser = await User.findById(user._id);
    if (!savedUser) {
      return res.status(500).json({
        success: false,
        message: 'Failed to save user to database'
      });
    }

    // Send token response
    sendTokenResponse(user, 201, res);

  } catch (error) {
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
  try {
    const { email, password, role } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    // Check for user (include password field)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if role matches (if provided)
    if (role && user.role !== role) {
      return res.status(401).json({
        success: false,
        message: `Invalid credentials for ${role} role`
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

    sendTokenResponse(user, 200, res);

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
      message: 'Server error during profile update'
    });
  }
};

module.exports = {
  signup,
  login,
  getMe,
  logout,
  updateProfile
};
