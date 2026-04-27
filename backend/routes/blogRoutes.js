const express = require('express');
const router = express.Router();
const { 
    getAllBlogs, 
    getBlogById, 
    createBlog, 
    updateBlog, 
    deleteBlog 
} = require('../controllers/blogController');

// --- CÁC ĐƯỜNG DẪN CÔNG KHAI (Dành cho Khách vãng lai & Thành viên) ---
// Lấy danh sách toàn bộ bài viết
router.get('/', getAllBlogs); 

// Lấy chi tiết một bài viết theo ID (Dùng cho trang BlogDetail)
router.get('/:id', getBlogById); 

// --- CÁC ĐƯỜNG DẪN CẦN QUYỀN ADMIN (Dành cho Quản trị viên) ---
// Thêm mới, cập nhật và xóa bài viết
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

module.exports = router;