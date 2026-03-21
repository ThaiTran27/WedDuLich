const express = require('express');
const router = express.Router();
const { 
    createBooking, 
    getAllBookings, 
    updatePaymentStatus, 
    getUserBookings, 
    trackOrder, 
    updateBookingStatus 
} = require('../controllers/bookingController');

// ⚠️ QUAN TRỌNG: Các đường dẫn cố định (như /track) PHẢI ĐẶT LÊN TRÊN CÙNG
router.get('/', getAllBookings);
router.get('/track', trackOrder); // <-- Đã khai báo đường dẫn mở khóa tính năng tra cứu

// Các đường dẫn có tham số động (:id, :userId) bắt buộc phải đặt XUỐNG DƯỚI
router.post('/', createBooking);
router.get('/user/:userId', getUserBookings);
router.put('/:id/pay', updatePaymentStatus);
router.put('/:id/status', updateBookingStatus);

module.exports = router;