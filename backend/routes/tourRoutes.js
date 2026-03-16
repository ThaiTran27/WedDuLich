const express = require('express');
const router = express.Router();
const { createTour, getAllTours, getTourById } = require('../controllers/tourController'); // <-- Thêm getTourById
// Khai báo đường dẫn
router.post('/', createTour); // Dùng POST để tạo mới
router.get('/', getAllTours); // Dùng GET để lấy dữ liệu
router.get('/:id', getTourById); // <-- THÊM DÒNG NÀY: Dấu :id để nhận biết ID truyền vào

module.exports = router;