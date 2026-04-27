const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/verifyToken');
const { 
  createTour, 
  getAllTours, 
  getTourById, 
  updateTour, 
  deleteTour
} = require('../controllers/tourController');

// 1. Lấy toàn bộ danh sách tour (hỗ trợ search/filter qua query params)
router.get('/', getAllTours);

// 2. Tạo tour mới (Admin)
router.post('/', verifyAdmin, createTour);

// 3. Lấy chi tiết 1 tour theo ID
router.get('/:id', getTourById);

// 4. Cập nhật thông tin tour (Admin)
router.put('/:id', verifyAdmin, updateTour);

// 5. Xóa tour (Admin)
router.delete('/:id', verifyAdmin, deleteTour);

module.exports = router;