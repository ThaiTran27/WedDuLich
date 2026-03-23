const express = require('express');
const router = express.Router();
const { 
    createBooking, 
    getAllBookings, 
    updateBooking, 
    getUserBookings
} = require('../controllers/bookingController');

// ⚠️ QUAN TRỌNG: Các đường dẫn cố định (như /track) PHẢI ĐẶT LÊN TRÊN CÙNG
router.get('/', getAllBookings);

// Các đường dẫn có tham số động (:id, :userId) bắt buộc phải đặt XUỐNG DƯỚI
router.post('/', createBooking);
router.get('/user/:userId', getUserBookings);
router.patch('/:id', updateBooking);

module.exports = router;