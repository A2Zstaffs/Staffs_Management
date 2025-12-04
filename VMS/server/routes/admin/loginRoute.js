const express = require('express');
const {
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
  getAdminStats,
  adminLogout,
  changePassword,
  createAdmin
} = require('../../controllers/admin/loginController');

const { protect, authorize } = require('../../middleware/auth');

const router = express.Router();

// Public routes
router.post('/login', adminLogin);

// Protected routes (Admin only)
// All routes below this line require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/me', getAdminProfile);
router.put('/profile', updateAdminProfile);
router.get('/stats', getAdminStats);
router.post('/logout', adminLogout);
router.put('/change-password', changePassword);
router.post('/create-admin', createAdmin);

module.exports = router;

<<<<<<< HEAD
<<<<<<< HEAD







<<<<<<< Updated upstream
=======


<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> edb5f0059bdc71fbc87831b17e2d8335f0536193
=======
>>>>>>> 8d967e6a74f53dce63db89fa1e850971bc3f9019
