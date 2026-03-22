const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');

// Import Routes
const tourRoutes = require('./routes/tourRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const reviewRoutes = require('./routes/reviewRoutes'); // <-- THÊM DÒNG NÀY
const categoryRoutes = require('./routes/categoryRoutes');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// ROUTES
app.use('/api/auth', authRoutes); 
app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/blogs', blogRoutes); // <-- Đã chỉnh lại cho đồng bộ
app.use('/api/reviews', reviewRoutes); // <-- THÊM DÒNG NÀY ĐỂ CHẠY ĐÁNH GIÁ SAO
app.use('/api/categories', categoryRoutes);

app.get('/', (req, res) => {
  res.send('API Du lịch đang hoạt động!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}...`);
});