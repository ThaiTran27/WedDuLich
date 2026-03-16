const express = require('express');
const router = express.Router();
const { createBooking, getAllBookings, updatePaymentStatus } = require('../controllers/bookingController');

router.post('/', createBooking);
router.get('/', getAllBookings);
router.put('/:id/pay', updatePaymentStatus); // <-- THÊM DÒNG NÀY (Dùng PUT vì đây là hành động cập nhật)

module.exports = router;