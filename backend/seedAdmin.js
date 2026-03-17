const mongoose = require('mongoose');
const User = require('./models/User'); 
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tour_db');
    
    // Xóa admin cũ để tạo lại cho sạch
    await User.deleteOne({ email: 'admin@gmail.com' });

    // Tạo admin mới - CHỈ ĐỂ mật khẩu là 'admin123'
    const newAdmin = new User({
      name: 'Quản trị viên Thái',
      email: 'admin@gmail.com',
      password: 'admin123', // Để mật khẩu thuần, không tự hash ở đây
      role: 'admin'
    });

    await newAdmin.save();
    console.log("-----------------------------------------");
    console.log("TẠO LẠI TÀI KHOẢN ADMIN THÀNH CÔNG!");
    console.log("Email: admin@gmail.com | Pass: admin123");
    console.log("-----------------------------------------");
    process.exit();
  } catch (error) {
    console.error("Lỗi:", error);
    process.exit(1);
  }
};

createAdmin();