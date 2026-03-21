const Blog = require('../models/Blog');

// Lấy tất cả bài viết (Đã thêm populate để lấy tên tác giả hiển thị lên UI)
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'name email') // <-- Tự động móc nối lấy Tên và Email của Admin
      .sort({ createdAt: -1 }); // Sắp xếp mới nhất lên đầu
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách blog' });
  }
};

// Lấy chi tiết 1 bài viết theo ID (Đã thêm populate)
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name email'); // <-- Tự động móc nối lấy Tên tác giả
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy chi tiết blog' });
  }
};

// Tạo bài viết mới (dành cho admin)
const createBlog = async (req, res) => {
  try {
    const newBlog = new Blog(req.body);
    const savedBlog = await newBlog.save();
    res.status(201).json({ success: true, message: 'Tạo bài viết thành công', data: savedBlog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi tạo bài viết', error: error.message });
  }
};

// Cập nhật bài viết
const updateBlog = async (req, res) => {
  try {
    const updated = await Blog.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết để cập nhật' });
    }
    res.status(200).json({ success: true, message: 'Cập nhật bài viết thành công', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật bài viết', error: error.message });
  }
};

// Xóa bài viết
const deleteBlog = async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết để xóa' });
    }
    res.status(200).json({ success: true, message: 'Đã xóa bài viết thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi xóa bài viết', error: error.message });
  }
};

module.exports = { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog };