const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authMiddleware } = require('../middleware/auth');

router.post('/price', bookingController.previewPrice);
router.post('/', authMiddleware, bookingController.createBooking);
router.get('/history/:userId', authMiddleware, bookingController.history);
router.put('/:bookingId/cancel', authMiddleware, bookingController.cancel);

module.exports = router;

