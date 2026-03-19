const mongoose = require('mongoose');
const Tour = require('./models/Tour');

// Đảm bảo tên database trùng với tên trong file server.js của bạn (thường là tour_db)
const mongoURI = 'mongodb://127.0.0.1:27017/tour_db'; 

const seedData = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB đã kết nối để seed dữ liệu...');

    // Xóa sạch tour cũ
    await Tour.deleteMany({});
    console.log('Đã xóa dữ liệu tour cũ.');

    // Bơm tour mới có đầy đủ Lịch trình & Khuyến mãi
    const toursData = [
      {
        title: 'Tour Miền Tây 2N1Đ: Cần Thơ - Chợ Nổi Cái Răng - Bến Tre',
        city: 'Cần Thơ - Bến Tre',
        image: '/images/tour-1.jpg',
        description: 'Hành trình khám phá vẻ đẹp miệt vườn sông nước miền Tây, trải nghiệm chợ nổi Cái Răng sầm uất và thưởng thức đặc sản xứ dừa Bến Tre.',
        price: 1650000,
        duration: '2 Ngày 1 Đêm',
        availableSeats: 25,
        featured: true,
        startDate: 'Sáng Thứ 7 hằng tuần',
        endDate: 'Chiều Chủ Nhật',
        promotions: [
          'Giảm ngay 100.000đ khi đặt nhóm từ 4 người.',
          'Tặng nón du lịch cao cấp và nước suối miễn phí.',
          'Miễn phí vé tham quan miệt vườn trái cây.'
        ],
        itinerary: [
          {
            day: 'Ngày 1',
            title: 'Hồ Chí Minh - Bến Tre - Cần Thơ',
            description: 'Sáng khởi hành đi Bến Tre. Lên tàu tham quan Tứ linh: Long, Lân, Quy, Phụng. Ghé thăm lò kẹo dừa, đi xe ngựa đường làng, chèo xuồng ba lá trong rạch dừa nước. Chiều di chuyển xuống Cần Thơ nhận phòng khách sạn, tối tự do khám phá Bến Ninh Kiều.'
          },
          {
            day: 'Ngày 2',
            title: 'Chợ Nổi Cái Răng - Làng Du Lịch Mỹ Khánh - Trở về',
            description: '5h30 sáng lên thuyền đi Chợ nổi Cái Răng - tìm hiểu văn hóa mua bán trên sông của người miền Tây. Thưởng thức bún riêu, hủ tiếu ngay trên ghe. Sau đó di chuyển qua Làng du lịch Mỹ Khánh xem đua heo, đua chó. Chiều lên xe khởi hành về lại TP.HCM. Kết thúc hành trình.'
          }
        ]
      }
    ];

    await Tour.insertMany(toursData);
    console.log('🎉 DỮ LIỆU TOUR MỚI ĐÃ ĐƯỢC SEED THÀNH CÔNG!');
    process.exit();

  } catch (error) {
    console.error('Lỗi khi seed dữ liệu tour:', error);
    process.exit(1);
  }
};

seedData();