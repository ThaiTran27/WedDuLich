// backend/seedTours.js
const mongoose = require('mongoose');
const Tour = require('./models/Tour'); // Nhớ trỏ đúng đường dẫn đến file Model Tour của bạn

// 1. Kết nối đến MongoDB (Vui lòng kiểm tra lại URI nếu có thay đổi)
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tour_db';
const seedData = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB đã kết nối để seed dữ liệu...');

    // 2. Xóa dữ liệu tour cũ (tùy chọn, để đảm bảo sạch sẽ)
    await Tour.deleteMany({});
    console.log('Đã xóa dữ liệu tour cũ.');

    // 3. ĐỊNH NGHĨA DỮ LIỆU TOUR MỚI VỚI HÌNH ẢNH MỚI VÀ ĐƯỜNG DẪN ĐÚNG
    const toursData = [
      {
        title: 'Tour Miền Tây: Mỹ Tho - Bến Tre - Cần Thơ',
        city: 'Tiền Giang - Bến Tre - Cần Thơ',
        image: '/images/tour-1.jpg', // ĐƯỜNG DẪN MỚI hợp lệ (sau khi di chuyển ảnh qua public)
        price: 2100000,
        duration: '3 ngày 2 đêm',
      },
      {
        title: 'Tour Đảo Phú Quốc: Biển Xanh - Cát Trắng',
        city: 'Kiên Giang',
        image: '/images/tour-2.jpg', // ĐƯỜNG DẪN MỚI
        price: 3500000,
        duration: '4 ngày 3 đêm',
      },
      {
        title: 'Tour Nha Trang: Vịnh Cam Ranh - Đảo Bình Ba',
        city: 'Khánh Hòa',
        image: '/images/tour-3.jpg', // ĐƯỜNG DẪN MỚI
        price: 2800000,
        duration: '3 ngày 2 đêm',
      },
      {
        title: 'Tour Đà Lạt: Thành Phố Ngàn Hoa',
        city: 'Lâm Đồng',
        image: '/images/tour-4.jpg', // ĐƯỜNG DẪN MỚI
        price: 2500000,
        duration: '3 ngày 2 đêm',
      },
      {
        title: 'Tour Đà Nẵng - Hội An - Bà Nà Hills',
        city: 'Đà Nẵng - Quảng Nam',
        image: '/images/tour-5.jpg', // ĐƯỜNG DẪN MỚI
        price: 3200000,
        duration: '4 ngày 3 đêm',
      },
      {
        title: 'Tour Hồ Chí Minh - Cần Giờ 1 Ngày',
        city: 'TP.HCM',
        image: '/images/tour-6.jpg', // ĐƯỜNG DẪN MỚI
        price: 900000,
        duration: '1 Ngày',
      },
    ];

    // 4. Lưu tour mới vào database
    await Tour.insertMany(toursData);
    console.log('Dữ liệu tour mới đã được seed thành công.');

  } catch (error) {
    console.error('Lỗi khi seed dữ liệu tour:', error);
  } finally {
    // 5. Đóng kết nối
    mongoose.connection.close();
    console.log('Đã đóng kết nối MongoDB.');
  }
};

// Bắt đầu quá trình seed
seedData();