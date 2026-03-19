const express = require('express');
const router = express.Router();
// Import thêm updateBookingStatus
const { createBooking, getAllBookings, updatePaymentStatus, getUserBookings, updateBookingStatus } = require('../controllers/bookingController');

router.post('/', createBooking);
router.get('/', getAllBookings);
router.put('/:id/pay', updatePaymentStatus); // API để xử lý thanh toán QR
router.get('/user/:userId', getUserBookings);

// --- ROUTE MỚI THÊM CHO ADMIN ---
router.put('/:id', updateBookingStatus); 

module.exports = router;