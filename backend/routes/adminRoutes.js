const express = require('express');
const router = express.Router();
const { createUser, getUsers, getAnalytics, getLogs } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/roleMiddleware');

router.post('/create-user', protect, admin, createUser);
router.get('/users', protect, admin, getUsers);
router.get('/analytics', protect, admin, getAnalytics);
router.get('/logs', protect, admin, getLogs);

module.exports = router;
