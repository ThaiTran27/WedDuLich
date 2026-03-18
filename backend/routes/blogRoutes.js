const express = require('express');
const router = express.Router();
const { createBooking, getAllBookings, updatePaymentStatus, getUserBookings, trackOrder } = require('../controllers/bookingController');

// Khai báo các đường dẫn API
router.post('/', createBooking);
router.get('/', getAllBookings);
router.get('/track', trackOrder); // API tra cứu (Phải để trên các API có :id)
router.put('/:id/pay', updatePaymentStatus); // API để xử lý thanh toán QR
router.get('/user/:userId', getUserBookings);

module.exports = router;