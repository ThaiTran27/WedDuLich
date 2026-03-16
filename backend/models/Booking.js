const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: true,
    },
    guestSize: {
      type: Number,
      required: true,
      min: 1, // Ít nhất phải có 1 người đi
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'cancelled'], // pending: Chờ thanh toán, paid: Đã thanh toán
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'sandbox'], // sandbox là phương thức thanh toán giả lập theo yêu cầu đồ án
      default: 'sandbox',
    }
  },
  {
    timestamps: true, // Tự động lưu ngày giờ đặt tour
  }
);

module.exports = mongoose.model('Booking', bookingSchema);