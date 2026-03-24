const express = require('express');
const router = express.Router();
const { receivePowerAlert, getAssignedTickets, startWork, stopWork, resolveTicket, createTicket, getMyTickets } = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');

router.get('/poweralert', receivePowerAlert);
router.post('/', protect, createTicket);
router.get('/', protect, getMyTickets);
router.get('/assigned', protect, getAssignedTickets);
router.post('/start', protect, startWork);
router.post('/stop', protect, stopWork);
router.post('/resolve', protect, resolveTicket);

module.exports = router;
