const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  next();
};

// Common validation rules
const commonValidationRules = [
  body('fullName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Full name must be at least 2 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('phoneNumber')
    .notEmpty()
    .withMessage('Phone number is required')
    .custom((value) => {
      // Allow phone numbers with country codes (e.g., +11234567890)
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        throw new Error('Please provide a valid phone number');
      }
      return true;
    }),
  
  body('role')
    .isIn(['candidate', 'recruiter', 'client', 'consultancy', 'admin'])
    .withMessage('Role must be one of: candidate, recruiter, client, consultancy, admin')
];

// Candidate-specific validation
const candidateValidationRules = [
  body('skills')
    .custom((value) => {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        throw new Error('Skills are required for candidates');
      }
      return true;
    }),
  
  body('experience')
    .isIn(['0-1', '2-5', '6-10', '10+'])
    .withMessage('Experience must be one of: 0-1, 2-5, 6-10, 10+'),
  
  body('location')
    .optional()
    .isString()
    .withMessage('Location must be a string')
];

// Recruiter-specific validation
const recruiterValidationRules = [
  body('company')
    .notEmpty()
    .withMessage('Company name is required for recruiters'),
  
  body('companyDetails.size')
    .isIn(['1-10', '11-50', '51-200', '201-500', '500+'])
    .withMessage('Company size must be one of: 1-10, 11-50, 51-200, 201-500, 500+'),
  
  body('companyDetails.industry')
    .notEmpty()
    .withMessage('Company industry is required for recruiters'),
  
  body('location.country')
    .notEmpty()
    .withMessage('Country is required for recruiters')
];

// Client-specific validation
const clientValidationRules = [
  body('company')
    .notEmpty()
    .withMessage('Company name is required for clients'),
  
  body('businessDetails.type')
    .isIn(['startup', 'small-business', 'enterprise', 'non-profit', 'government'])
    .withMessage('Business type must be one of: startup, small-business, enterprise, non-profit, government'),
  
  body('businessDetails.size')
    .isIn(['1-10', '11-50', '51-200', '201-500', '500+'])
    .withMessage('Business size must be one of: 1-10, 11-50, 51-200, 201-500, 500+'),
  
  body('businessDetails.industry')
    .notEmpty()
    .withMessage('Business industry is required for clients'),
  
  body('financials.budget')
    .isIn(['<10k', '10k-50k', '50k-100k', '100k-500k', '500k+'])
    .withMessage('Budget must be one of: <10k, 10k-50k, 50k-100k, 100k-500k, 500k+'),
  
  body('location.country')
    .notEmpty()
    .withMessage('Country is required for clients')
];

// Login validation
const loginValidationRules = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  body('role')
    .isIn(['candidate', 'recruiter', 'client', 'consultancy', 'admin'])
    .withMessage('Role must be one of: candidate, recruiter, client, consultancy, admin')
];

// Dynamic validation based on role
const validateSignup = (req, res, next) => {
  const { role } = req.body;
  
  let validationRules = [...commonValidationRules];
  
  switch (role) {
    case 'candidate':
      validationRules = [...validationRules, ...candidateValidationRules];
      break;
    case 'recruiter':
      validationRules = [...validationRules, ...recruiterValidationRules];
      break;
    case 'client':
      validationRules = [...validationRules, ...clientValidationRules];
      break;
    case 'consultancy':
      // Add consultancy validation rules if needed
      break;
  }
  
  // Run validation
  Promise.all(validationRules.map(validation => validation.run(req)))
    .then(() => {
      handleValidationErrors(req, res, next);
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  handleValidationErrors,
  validateSignup,
  loginValidationRules,
  commonValidationRules,
  candidateValidationRules,
  recruiterValidationRules,
  clientValidationRules
};
