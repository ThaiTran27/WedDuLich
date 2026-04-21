const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');
const cron = require('node-cron'); // <-- THÊM DÒNG NÀY
const Booking = require('./models/Booking.js'); // <-- THÊM DÒNG NÀY (Dùng để quét đơn hàng)

// Import Routes
const tourRoutes = require('./routes/tourRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const reviewRoutes = require('./routes/reviewRoutes'); 
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config({ path: './.env' });
connectDB();

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// ROUTES
app.use('/api/auth', authRoutes); 
app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/blogs', blogRoutes); 
app.use('/api/reviews', reviewRoutes); 
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

// =====================================================================
// 🤖 CRON JOB: HỆ THỐNG TỰ ĐỘNG HỦY ĐƠN & NHẢ GHẾ SAU 5 PHÚT
// =====================================================================
// Dấu * * * * * nghĩa là hàm này sẽ tự động chạy cứ mỗi 1 phút 1 lần
cron.schedule('* * * * *', async () => {
  try {
    // Tính toán mốc thời gian: Đúng 5 phút trước so với hiện tại
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    // Tìm các đơn hàng 'pending' và thời gian tạo <= 5 phút trước
    const result = await Booking.updateMany(
      {
        status: 'pending', 
        createdAt: { $lte: fiveMinutesAgo }
      },
      {
        $set: { status: 'cancelled' } // Đổi trạng thái thành Đã hủy để trả ghế
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`🤖 [HỆ THỐNG] Đã tự động hủy và thu hồi ghế của ${result.modifiedCount} đơn đặt tour quá hạn 5 phút.`);
    }
  } catch (error) {
    console.error("❌ Lỗi khi chạy Cron Job hủy đơn:", error);
  }
});
// =====================================================================

app.get('/', (req, res) => {
  res.send('API Du lịch đang hoạt động!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}...`);
});