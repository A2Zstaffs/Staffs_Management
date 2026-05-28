const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

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
      const decoded = /** @type {{ id: string }} */ (jwt.verify(token, process.env.JWT_SECRET));
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
// @param {string} id - User ID
// @param {boolean} rememberMe - If true, use longer expiry (7 days), otherwise shorter (1 hour)
const getSignedJwtToken = (id, rememberMe = false) => {
  // Use longer expiry for "Remember Me", shorter for regular sessions
  const expiresIn = /** @type {import('jsonwebtoken').SignOptions['expiresIn']} */ (
    rememberMe ? (process.env.JWT_EXPIRE_REMEMBER || '7d') : (process.env.JWT_EXPIRE || '1h')
  );

  console.log(`🔑 [JWT] Generating token with expiry: ${expiresIn} (rememberMe: ${rememberMe})`);

  return jwt.sign({ id }, /** @type {string} */(process.env.JWT_SECRET), {
    expiresIn
  });
};

// Send token response
// @param {object} user - User object
// @param {number} statusCode - HTTP status code
// @param {object} res - Express response object
// @param {boolean} rememberMe - If true, use longer expiry for token and cookie
const sendTokenResponse = (user, statusCode, res, rememberMe = false) => {
  // Create token with appropriate expiry based on rememberMe
  const token = getSignedJwtToken(user._id, rememberMe);

  // Cookie expiry: 7 days for rememberMe, 1 hour for regular sessions
  const cookieExpiry = rememberMe
    ? 7 * 24 * 60 * 60 * 1000  // 7 days
    : 1 * 60 * 60 * 1000;      // 1 hour

  const options = {
    expires: new Date(Date.now() + cookieExpiry),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
    options.sameSite = 'none'; // Required for cross-site (Vercel -> Render)
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
