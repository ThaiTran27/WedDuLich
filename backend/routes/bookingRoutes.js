const express = require('express');
const router = express.Router();
const { createBooking, getAllBookings, updatePaymentStatus, getUserBookings } = require('../controllers/bookingController');

router.post('/', createBooking);
router.get('/', getAllBookings);
router.put('/:id/pay', updatePaymentStatus); // API để xử lý thanh toán QR
router.get('/user/:userId', getUserBookings);

module.exports = router;