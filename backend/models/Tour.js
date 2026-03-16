const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      required: true, // Ví dụ: "3 Ngày 2 Đêm"
    },
    image: {
      type: String,
      required: true, // Sau này mình sẽ lưu link ảnh vào đây
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false, // Dùng để đánh dấu các "Tour nổi bật" hiển thị lên trang chủ
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Tour', tourSchema);