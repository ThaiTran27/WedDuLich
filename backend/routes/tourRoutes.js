const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/verifyToken');
const { 
  createTour, 
  getAllTours, 
  getTourById, 
  updateTour, 
  deleteTour, 
  getTourBySearch 
} = require('../controllers/tourController');

// 1. Tìm kiếm tour (Lưu ý: Phải để route 'search' lên trên ':id' để tránh bị hiểu nhầm 'search' là 1 cái ID)
router.get('/search/getTourBySearch', getTourBySearch);

// 2. Lấy toàn bộ danh sách tour
router.get('/', getAllTours);

// 3. Tạo tour mới (Admin)
router.post('/', verifyAdmin, createTour);

// 4. Lấy chi tiết 1 tour theo ID
router.get('/:id', getTourById);

// 5. Cập nhật thông tin tour (Admin)
router.put('/:id', verifyAdmin, updateTour);

// 6. Xóa tour (Admin)
router.delete('/:id', verifyAdmin, deleteTour);

module.exports = router;