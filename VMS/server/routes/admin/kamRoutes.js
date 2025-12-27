const express = require('express');
const router = express.Router();
const {
    createKam,
    getAllKams,
    assignKamRole,
    revokeKamRole,
    getKamClients,
    assignClientToKam,
    removeClientFromKam,
    getAllAssignments
} = require('../../controllers/adminKamController');

// All routes are already protected by admin middleware in main routes file

// KAM Users Management
router.route('/create')
    .post(createKam);

router.route('/users')
    .get(getAllKams);

router.route('/assign-role')
    .post(assignKamRole);

router.route('/:userId/revoke-role')
    .delete(revokeKamRole);

// Client Assignment Management
router.route('/assignments')
    .get(getAllAssignments);

router.route('/:kamId/clients')
    .get(getKamClients);

router.route('/:kamId/assign-client')
    .post(assignClientToKam);

router.route('/:kamId/clients/:clientId')
    .delete(removeClientFromKam);

module.exports = router;
