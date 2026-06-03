// Đường dẫn file: backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quan_ly_du_lich';
    console.log('MONGO_URI:', mongoUri);
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB đã kết nối thành công: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Lỗi kết nối MongoDB: ${error.message}`);
    process.exit(1); // Dừng server nếu lỗi kết nối
  }
};

module.exports = connectDB;