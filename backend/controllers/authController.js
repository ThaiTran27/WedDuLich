const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
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
      message: 'Đăng ký thành công!' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server khi đăng ký" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Email không tồn tại!" });
    }

    // SO SÁNH MẬT KHẨU (Quan trọng nhất)
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, message: "Mật khẩu sai rồi bạn ơi!" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15d' });

    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

module.exports = { register, login };