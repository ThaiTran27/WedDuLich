const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected!');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Xóa tất cả user cũ
    await User.deleteMany({});
    console.log('🗑️ Deleted all users');

    // Tạo test user
    const testUser = {
      name: 'Trần Minh Thái',
      email: 'admin@gmail.com',
      password: 'Test123456!', // Sẽ được mã hóa tự động
      phone: '0123456789',
      role: 'customer'
    };

    const newUser = await User.create(testUser);
    console.log('✅ Test user created:', newUser);

    // Tạo admin user
    const adminUser = {
      name: 'Admin',
      email: 'admin123@gmail.com',
      password: 'Admin123456!',
      phone: '0987654321',
      role: 'admin'
    };

    const newAdmin = await User.create(adminUser);
    console.log('✅ Admin user created:', newAdmin);

    mongoose.connection.close();
    console.log('✅ Database seeding completed!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
