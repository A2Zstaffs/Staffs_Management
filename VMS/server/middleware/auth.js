const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    console.log('🔐 Auth Middleware - Token present:', !!token);
    console.log('🔐 Auth Middleware - Headers:', req.headers.authorization?.substring(0, 20) + '...');

    // Make sure token exists
    if (!token) {
      console.log('❌ Auth failed: No token provided');
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token decoded successfully, userId:', decoded.id);

      // Get user from token
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        console.log('❌ Auth failed: No user found with id:', decoded.id);
        return res.status(401).json({
          success: false,
          message: 'No user found with this token'
        });
      }

      console.log('✅ User found:', req.user.email, 'Role:', req.user.role);

      // Check if user is active
      if (!req.user.isActive) {
        console.log('❌ Auth failed: User account deactivated');
        return res.status(401).json({
          success: false,
          message: 'User account is deactivated'
        });
      }

      next();
    } catch (error) {
      console.log('❌ Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    console.log('❌ Auth middleware error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error in authentication middleware'
    });
  }
};

// Middleware to restrict to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Generate JWT token
const getSignedJwtToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Send token response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = getSignedJwtToken(user._id);

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      data: user.getPublicProfile()
    });
};

// Middleware to authorize admin only
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    console.log('❌ Admin authorization failed: User role is', req.user?.role);
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
};

module.exports = {
  protect,
  authorize,
  authorizeAdmin,
  getSignedJwtToken,
  sendTokenResponse
};
