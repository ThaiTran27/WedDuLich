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

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json({ success: true, data: users });
  } catch (error) { res.status(500).json({ success: false, message: 'Lỗi server' }); }
};

// --- HÀM MỚI: SỬA USER ---
const updateUser = async (req, res) => {
  try {
    const { name, phone, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { name, phone, role }, { new: true }).select('-password');
    if (!updatedUser) return res.status(404).json({ success: false, message: 'Không tìm thấy user' });
    res.status(200).json({ success: true, message: 'Cập nhật thành công', data: updatedUser });
  } catch (error) { res.status(500).json({ success: false, message: 'Lỗi server' }); }
};

// --- HÀM MỚI: XÓA USER ---
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ success: false, message: 'Không tìm thấy user' });
    res.status(200).json({ success: true, message: 'Xóa user thành công' });
  } catch (error) { res.status(500).json({ success: false, message: 'Lỗi server' }); }
};

module.exports = { register, login, getAllUsers, updateUser, deleteUser };