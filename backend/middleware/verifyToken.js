// middleware/verifyToken.js
const jwt = require('jsonwebtoken');

const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Lấy token từ Header

  if (!token) return res.status(401).json({ success: false, message: "Bạn chưa đăng nhập!" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: "Token không hợp lệ!" });
    
    // Kiểm tra quyền Admin
    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Bạn không có quyền truy cập!" });
    }
    
    req.user = user;
    next(); // Cho phép đi tiếp vào Controller
  });
};

module.exports = { verifyAdmin };