const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Xử lý ĐĂNG KÝ
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra xem email đã tồn tại chưa
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email này đã được sử dụng rồi Thái ơi!' 
      });
    }

    // Tạo user (lúc này hàm pre-save ở Model User.js sẽ tự chạy để mã hóa pass)
    await User.create({ name, email, password });

    res.status(201).json({ 
      success: true, 
      message: 'Đăng ký thành công mỹ mãn!' 
    });

  } catch (error) {
    console.error("Lỗi đăng ký:", error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server nội bộ: ' + error.message 
    });
  }
};

// Xử lý ĐĂNG NHẬP (Giữ nguyên như cũ)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Tài khoản không tồn tại!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Mật khẩu sai rồi bạn ơi!' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '1d' });

    res.status(200).json({
      success: true,
      data: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server đăng nhập!' });
  }
};