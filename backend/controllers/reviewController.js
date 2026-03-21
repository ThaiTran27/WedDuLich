const Review = require('../models/Review');

// Gửi đánh giá mới (Tự động nhận tourId hoặc blogId từ req.body)
const createReview = async (req, res) => {
  try {
    const newReview = new Review(req.body);
    const savedReview = await newReview.save();
    res.status(201).json({ success: true, message: 'Gửi thành công!', data: savedReview });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi gửi dữ liệu', error: error.message });
  }
};

// Lấy đánh giá của Tour
const getTourReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ tourId: req.params.tourId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tải đánh giá Tour' });
  }
};

// Lấy bình luận của Blog (MỚI)
const getBlogReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ blogId: req.params.blogId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tải bình luận Blog' });
  }
};

// Lấy tất cả review cho Admin Dashboard (MỚI)
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'name')
      .populate('tourId', 'title')
      .populate('blogId', 'title')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tải dữ liệu quản trị' });
  }
};

const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Đã xóa!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi xóa' });
  }
};

module.exports = { createReview, getTourReviews, getBlogReviews, getAllReviews, deleteReview };