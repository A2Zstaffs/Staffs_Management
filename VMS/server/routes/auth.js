const express = require('express');
const {
  signup,
  login,
  getMe,
  logout,
  updateProfile
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const { validateSignup, loginValidationRules, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/signup', validateSignup, signup);
router.post('/login', loginValidationRules, handleValidationErrors, login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/profile', protect, updateProfile);

module.exports = router;
