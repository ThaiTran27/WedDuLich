const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');
const tourRoutes = require('./routes/tourRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// ROUTES (Phải đặt TRÊN app.listen)
app.use('/api/auth', authRoutes); 
app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/blogs', require('./routes/blogRoutes'));

app.get('/', (req, res) => {
  res.send('API Du lịch đang hoạt động!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}...`);
});