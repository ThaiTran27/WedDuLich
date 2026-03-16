// Đường dẫn file: backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');
const tourRoutes = require('./routes/tourRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// 1. Load các biến môi trường từ file .env
dotenv.config();

// 2. Gọi hàm kết nối Database
connectDB();

// 3. Khởi tạo app Express
const app = express();

// 4. Cấu hình Middleware
app.use(cors()); // Cho phép Frontend gọi API
app.use(express.json()); // Giúp server đọc được dữ liệu dạng JSON

// 5. Tạo một API test thử
app.get('/', (req, res) => {
  res.send('API Quản lý Du lịch đang hoạt động ngon lành!');
});

// 6. Lắng nghe server chạy trên cổng quy định
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy cực bốc trên cổng ${PORT}...`);
});

// ... các require ở đầu file
const authRoutes = require('./routes/authRoutes'); // <--- THÊM DÒNG NÀY

// ... sau phần cấu hình Middleware (app.use(express.json());)
app.use('/api/auth', authRoutes); // <--- THÊM DÒNG NÀY (Để gọi API qua đường dẫn /api/auth/...)
//
app.use('/api/tours', tourRoutes);
//
app.use('/api/bookings', bookingRoutes);