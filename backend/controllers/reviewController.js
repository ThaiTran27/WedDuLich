const Review = require('../models/Review');

// Khách hàng gửi đánh giá mới
const createReview = async (req, res) => {
  try {
    const newReview = new Review(req.body);
    const savedReview = await newReview.save();
    res.status(201).json({ success: true, message: 'Cảm ơn bạn đã đánh giá!', data: savedReview });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi gửi đánh giá', error: error.message });
  }
};

// Lấy toàn bộ đánh giá của 1 Tour cụ thể để hiển thị
const getTourReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ tourId: req.params.tourId })
      .populate('userId', 'name') // Móc tên người dùng ra để hiển thị
      .sort({ createdAt: -1 });   // Mới nhất lên đầu
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tải đánh giá' });
  }
};

// Admin xóa bình luận tiêu cực
const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Đã xóa bình luận!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi xóa bình luận' });
  }
};

module.exports = { createReview, getTourReviews, deleteReview };