const Blog = require('../models/Blog');

// Lấy tất cả bài viết
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }); // Sắp xếp mới nhất lên đầu
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách blog' });
  }
};

module.exports = { getAllBlogs };