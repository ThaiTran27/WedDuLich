const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');
const cron = require('node-cron'); 
const Booking = require('./models/Booking.js'); 
const Chat = require('./models/Chat.js'); // <-- THÊM DÒNG NÀY: Gọi Model Chat

// --- 1. IMPORT THƯ VIỆN HTTP VÀ SOCKET.IO ---
const http = require('http');
const { Server } = require('socket.io');

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

// --- 2. BỌC APP BẰNG HTTP SERVER VÀ KHỞI TẠO SOCKET.IO ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Cho phép mọi Frontend kết nối tới
    methods: ["GET", "POST"]
  }
});

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
// 💬 THÊM API LẤY LỊCH SỬ CHAT CHO FRONTEND
// =====================================================================
app.get('/api/chat', async (req, res) => {
  try {
    // Chỉ lấy 50 tin nhắn gần nhất để web chạy nhanh mượt
    const messages = await Chat.find().sort({ createdAt: 1 }).limit(50);
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tải lịch sử chat' });
  }
});

// =====================================================================
// 🤖 CRON JOB: HỆ THỐNG TỰ ĐỘNG HỦY ĐƠN & NHẢ GHẾ SAU 5 PHÚT
// =====================================================================
cron.schedule('* * * * *', async () => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const result = await Booking.updateMany(
      {
        status: 'pending', 
        createdAt: { $lte: fiveMinutesAgo }
      },
      {
        $set: { status: 'cancelled' } 
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

// =========================================================
// 💬 BỘ NÃO CỦA CHAT REAL-TIME (ĐÃ NÂNG CẤP LƯU DATABASE)
// =========================================================
io.on('connection', (socket) => {
  console.log(`⚡ Một thiết bị vừa kết nối Chat (ID: ${socket.id})`);

  // Lắng nghe sự kiện gửi tin nhắn
  socket.on('send_message', async (data) => {
    try {
      // 1. Lưu tin nhắn vào MongoDB ngay lập tức
      const newMsg = new Chat(data);
      await newMsg.save();
      
      // 2. Lưu thành công mới phát lại cho TẤT CẢ mọi người đang online
      io.emit('receive_message', data); 
    } catch (error) {
      console.error("❌ Lỗi khi lưu tin nhắn vào DB:", error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ Thiết bị đã ngắt kết nối Chat (ID: ${socket.id})`);
  });
});
// =========================================================

app.get('/', (req, res) => {
  res.send('API Du lịch đang hoạt động!');
});

const PORT = process.env.PORT || 5000;

// --- 3. QUAN TRỌNG: ĐỔI app.listen THÀNH server.listen ---
server.listen(PORT, () => {
  console.log(`🚀 Server & Chat Socket.io đang chạy trên cổng ${PORT}...`);
});