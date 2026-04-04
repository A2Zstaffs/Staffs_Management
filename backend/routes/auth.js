const express = require('express');
const {
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
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const { validateSignup, loginValidationRules, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/signup', validateSignup, signup);
router.post('/login', loginValidationRules, handleValidationErrors, login);
router.post('/google', googleAuth); // Google OAuth route

// Email verification routes
router.post('/verify-signup-otp', verifySignupOTP);
router.post('/resend-signup-otp', resendSignupOTP);

// Forgot password routes
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/profile', protect, updateProfile);

module.exports = router;


