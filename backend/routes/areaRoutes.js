const express = require('express');
const router = express.Router();
const { getAreas, createArea, deleteArea } = require('../controllers/areaController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/roleMiddleware');

router.get('/', getAreas);
router.post('/', protect, admin, createArea);
router.delete('/:id', protect, admin, deleteArea);

module.exports = router;
