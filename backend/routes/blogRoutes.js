const express = require('express');
const router = express.Router();
const { 
    getAllBlogs, 
    getBlogById, 
    createBlog, 
    updateBlog, 
    deleteBlog 
} = require('../controllers/blogController');

// Nếu bạn đã có file authMiddleware để kiểm tra quyền Admin, hãy import vào đây
// const { verifyAdmin } = require('../utils/verifyToken'); 

// --- CÁC ĐƯỜNG DẪN CÔNG KHAI (AI CŨNG XEM ĐƯỢC) ---
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

// --- CÁC ĐƯỜNG DẪN CẦN QUYỀN ADMIN (BẢO MẬT) ---
// Sau này Thái có thể thêm middleware verifyAdmin vào giữa để bảo mật hơn
// Ví dụ: router.post('/', verifyAdmin, createBlog);
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

module.exports = router;