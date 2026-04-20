const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/verifyToken');
const { getAllUsers, updateUser, deleteUser } = require('../controllers/userController');

// Lấy tất cả users (Admin)
router.get('/', verifyAdmin, getAllUsers);

// Cập nhật user (Admin)
router.put('/:id', verifyAdmin, updateUser);

// Xóa user (Admin)
router.delete('/:id', verifyAdmin, deleteUser);

module.exports = router;