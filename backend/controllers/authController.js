const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { name, email, password, phone, role } = req.body; // Thêm nhận role từ admin
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, message: 'Email đã tồn tại!' });
    
    // Nếu admin tạo thì lấy role, nếu khách tự đăng ký thì mặc định 'user'
    await User.create({ name, email, password, phone, role: role || 'user' });
    res.status(201).json({ success: true, message: 'Đăng ký thành công!' });
  } catch (error) { res.status(500).json({ success: false, message: "Lỗi server" }); }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "Email không tồn tại!" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(401).json({ success: false, message: "Sai mật khẩu!" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15d' });
    res.status(200).json({ success: true, message: "Đăng nhập thành công", token, data: user });
  } catch (error) { res.status(500).json({ success: false, message: "Lỗi server" }); }
};

module.exports = { register, login };