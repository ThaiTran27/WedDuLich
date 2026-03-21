const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5, // Đánh giá từ 1 đến 5 sao
    },
    comment: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'approved', // Có thể thêm trạng thái 'pending' nếu Admin muốn duyệt trước khi hiện
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);