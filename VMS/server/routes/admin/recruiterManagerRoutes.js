const express = require('express');
const router = express.Router();
const {
    createRecruiterManager,
    getAllRecruiterManagers,
    assignRecruiterManagerRole,
    revokeRecruiterManagerRole,
    getRecruiterManagerRecruiters,
    assignRecruiterToRM,
    removeRecruiterFromRM,
    getAllAssignments
} = require('../../controllers/adminRecruiterManagerController');

// All routes are already protected by admin middleware in main routes file

// Recruiter Manager Users Management
router.route('/create')
    .post(createRecruiterManager);

router.route('/users')
    .get(getAllRecruiterManagers);

router.route('/assign-role')
    .post(assignRecruiterManagerRole);

router.route('/:userId/revoke-role')
    .delete(revokeRecruiterManagerRole);

// Recruiter Assignment Management
router.route('/assignments')
    .get(getAllAssignments);

router.route('/:rmId/recruiters')
    .get(getRecruiterManagerRecruiters);

router.route('/:rmId/assign-recruiter')
    .post(assignRecruiterToRM);

router.route('/:rmId/recruiters/:recruiterId')
    .delete(removeRecruiterFromRM);

module.exports = router;
