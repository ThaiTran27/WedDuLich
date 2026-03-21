const express = require('express');
const router = express.Router();
const { 
  createReview, 
  getTourReviews, 
  getBlogReviews, // Đảm bảo hàm này đã được viết trong Controller
  deleteReview 
} = require('../controllers/reviewController');

// Gửi đánh giá (dùng chung cho cả Tour và Blog)
router.post('/', createReview);

// Lấy đánh giá của Tour
router.get('/:tourId', getTourReviews);

// Lấy bình luận của Blog (PHẢI THÊM DÒNG NÀY)
router.get('/blog/:blogId', getBlogReviews); 

router.delete('/:id', deleteReview);

module.exports = router;