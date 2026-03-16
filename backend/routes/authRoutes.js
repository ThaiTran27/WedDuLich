const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Khai báo 2 đường dẫn gọi đến 2 hàm vừa viết
router.post('/register', register);
router.post('/login', login);

module.exports = router;