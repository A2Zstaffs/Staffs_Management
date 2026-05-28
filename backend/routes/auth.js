const express = require('express');
const { rateLimit } = require('express-rate-limit');
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

// Rate limiters for auth-sensitive endpoints. Sit alongside the global limiter in server.js;
// the global cap is for overall abuse, these caps make brute-force on a single account/email infeasible.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many OTP requests. Please wait before requesting another.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many verification attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes
router.post('/signup', loginLimiter, validateSignup, signup);
router.post('/login', loginLimiter, loginValidationRules, handleValidationErrors, login);
router.post('/google', loginLimiter, googleAuth); // Google OAuth route

// Email verification routes
router.post('/verify-signup-otp', otpVerifyLimiter, verifySignupOTP);
router.post('/resend-signup-otp', otpRequestLimiter, resendSignupOTP);

// Forgot password routes
router.post('/forgot-password', otpRequestLimiter, forgotPassword);
router.post('/verify-otp', otpVerifyLimiter, verifyOTP);
router.post('/reset-password', otpVerifyLimiter, resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/profile', protect, updateProfile);

module.exports = router;


