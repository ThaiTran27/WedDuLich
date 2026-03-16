const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Không cho phép 2 người đăng ký cùng 1 email
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['customer', 'admin'], // Chỉ cho phép 1 trong 2 quyền này
      default: 'customer', // Mặc định ai đăng ký cũng là khách hàng
    },
  },
  {
    timestamps: true, // Tự động tạo 2 trường: createdAt và updatedAt
  }
);

module.exports = mongoose.model('User', userSchema);