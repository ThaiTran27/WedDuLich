const User = require('../models/User');

// Lấy tất cả users (Admin)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const users = await User.find()
      .select('-password') // Exclude password
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments();
    
    // HATEOAS links
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const links = {
      self: `${baseUrl}?${new URLSearchParams(req.query).toString()}`,
      first: `${baseUrl}?page=1&limit=${limitNum}`,
      last: `${baseUrl}?page=${Math.ceil(total / limitNum)}&limit=${limitNum}`,
    };
    
    if (pageNum > 1) links.prev = `${baseUrl}?page=${pageNum - 1}&limit=${limitNum}`;
    if (pageNum < Math.ceil(total / limitNum)) links.next = `${baseUrl}?page=${pageNum + 1}&limit=${limitNum}`;
    
    res.set('Cache-Control', 'private, max-age=60'); // Cache 1 minute for admin
    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: users,
      _links: links
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách user' });
  }
};

// Cập nhật user (Admin)
const updateUser = async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, role },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy user' });
    }
    
    // HATEOAS links
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const links = {
      self: `${baseUrl}/${updatedUser._id}`,
      collection: `${baseUrl}`,
      bookings: `${req.protocol}://${req.get('host')}/api/bookings?userId=${updatedUser._id}`
    };
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật user thành công',
      data: updatedUser,
      _links: links
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi cập nhật user', error: error.message });
  }
};

// Xóa user (Admin)
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy user' });
    }
    
    res.status(200).json({
      success: true,
      message: 'Xóa user thành công'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi xóa user', error: error.message });
  }
};

module.exports = { getAllUsers, updateUser, deleteUser };