const mongoose = require('mongoose');
const Tour = require('./models/Tour'); // Nhớ kiểm tra đường dẫn file Model
require('dotenv').config();

const toursData = [
  // 1. TOUR LẤY TỪ TOURBONPHUONG.COM (CHI TIẾT 100%)
  {
    title: "Tour Miền Tây 1 Ngày: Mỹ Tho - Bến Tre - Cồn Phụng",
    city: "Mỹ Tho - Bến Tre",
    price: 550000,
    duration: "1 Ngày",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1500&q=80",
    description: `Hành trình khám phá trọn vẹn văn hóa sông nước miền Tây từ TP.HCM.

🔥 ĐIỂM NỔI BẬT CỦA LỊCH TRÌNH:
- Dừng chân tại Mekong Rest Stop thơ mộng.
- Tham quan Chùa Vĩnh Tràng – ngôi chùa cổ kiến trúc Đông - Tây độc đáo nhất Tiền Giang.
- Lên tàu du ngoạn trên sông Tiền, ngắm 4 cù lao: Long, Lân, Quy, Phụng.
- Khám phá Cồn Lân (Thới Sơn): Thưởng thức trà mật ong hoa nhãn, xem quy trình làm kẹo dừa nóng hổi.
- Trải nghiệm ngồi xe ngựa dạo đường làng và chèo xuồng ba lá len lỏi trong rặng dừa nước.
- Thưởng thức Đờn ca tài tử Nam Bộ và trái cây miệt vườn.
- Khám phá Cồn Phụng: Tham quan di tích Đạo Dừa, ăn trưa đặc sản (Cá tai tượng chiên xù cuốn bánh tráng, xôi chiên phồng, lẩu cá hú...).`,
    availableSeats: 20,
    featured: true
  },
  
  // 2. TOUR MIỀN TÂY 2 NGÀY 1 ĐÊM
  {
    title: "Tour Miền Tây 2N1Đ: Cần Thơ - Chợ Nổi Cái Răng",
    city: "Cần Thơ",
    price: 1650000,
    duration: "2 Ngày 1 Đêm",
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1500&q=80",
    description: `Khám phá thủ phủ miền Tây Nam Bộ với những trải nghiệm khó quên.
\n- Nghỉ đêm tại khách sạn trung tâm Cần Thơ, tự do dạo bến Ninh Kiều.
- Dậy sớm đi thuyền tham quan Chợ nổi Cái Răng - nét văn hóa giao thương đặc sắc trên sông.
- Tham quan Lò hủ tiếu truyền thống, tự tay tráng bánh hủ tiếu.
- Vui chơi tại Làng du lịch Mỹ Khánh: xem đua heo, đua chó, tham quan nhà cổ Nam Bộ.`,
    availableSeats: 25,
    featured: true
  },

  // 3. TOUR TÁT MƯƠNG BẮT CÁ
  {
    title: "Tour 1 Ngày: Trải nghiệm Tát Mương Bắt Cá",
    city: "Bến Tre",
    price: 950000,
    duration: "1 Ngày",
    image: "https://images.unsplash.com/photo-1555921015-c2848f1c26e4?auto=format&fit=crop&w=1500&q=80",
    description: `Một ngày hóa thân thành nông dân miệt vườn thực thụ.
\n- Mặc áo bà ba, quấn khăn rằn lội bùn tát mương.
- Tự tay bắt những chú cá lóc, cá trê vùi trong bùn.
- Thưởng thức "chiến lợi phẩm" là cá lóc nướng trui trứ danh ngay tại vườn.
- Kết hợp tham quan các làng nghề truyền thống và đi xuồng chèo.`,
    availableSeats: 15,
    featured: false
  },

  // 4. TOUR TÂY NINH
  {
    title: "Tour Chinh Phục Núi Bà Đen Tây Ninh",
    city: "Tây Ninh",
    price: 1190000,
    duration: "1 Ngày",
    image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1500&q=80",
    description: `Hành trình tâm linh và ngắm cảnh trên "Nóc nhà Nam Bộ".
\n- Đi cáp treo hiện đại lên đỉnh núi Bà Đen ngắm biển mây.
- Chiêm bái tượng Phật Bà Tây Bổ Đà Sơn bằng đồng cao nhất Châu Á.
- Thưởng thức tiệc buffet chay/mặn phong phú trên đỉnh núi.
- Ghé thăm Tòa Thánh Cao Đài với kiến trúc tôn giáo độc đáo.`,
    availableSeats: 30,
    featured: true
  },

  // 5. TOUR CỦ CHI
  {
    title: "Khám Phá Địa Đạo Củ Chi Hào Hùng",
    city: "Hồ Chí Minh",
    price: 400000,
    duration: "Nửa Ngày",
    image: "https://images.unsplash.com/photo-1606068233374-27ba210b37fc?auto=format&fit=crop&w=1500&q=80",
    description: `Sống lại những thước phim lịch sử hào hùng của dân tộc.
\n- Chui xuống hệ thống địa đạo chằng chịt dài hàng trăm km.
- Tìm hiểu cách quân dân ta sinh hoạt, chiến đấu dưới lòng đất.
- Trải nghiệm bắn súng đạn thật tại trường bắn thể thao (chi phí tự túc).
- Thưởng thức món khoai mì luộc chấm muối đậu dân dã.`,
    availableSeats: 40,
    featured: false
  },

  // 6. TOUR VŨNG TÀU
  {
    title: "Biển Gọi Vũng Tàu - Tắm Biển & Thưởng Thức Hải Sản",
    city: "Vũng Tàu",
    price: 1050000,
    duration: "1 Ngày",
    image: "https://images.unsplash.com/photo-1628746355325-2e6d628eb4b4?auto=format&fit=crop&w=1500&q=80",
    description: `Chuyến đi thư giãn cuối tuần đổi gió biển mát mẻ.
\n- Tắm biển Bãi Sau (Thùy Vân) với bờ cát dài thoai thoải.
- Chinh phục tượng Chúa Dang Tay lớn nhất khu vực.
- Thưởng thức hải sản tươi sống và món Bánh khọt đặc sản.
- Tham quan Bạch Dinh và Thích Ca Phật Đài.`,
    availableSeats: 20,
    featured: false
  },

  // CÁC TOUR XA (ĐÀ LẠT, HẠ LONG, PHÚ QUỐC...)
  {
    title: "Nghỉ Dưỡng Cực Chill Tại Sương Mù Đà Lạt",
    city: "Đà Lạt",
    price: 2500000,
    duration: "3 Ngày 2 Đêm",
    image: "https://plus.unsplash.com/premium_photo-1661962360670-65231e6b815f?auto=format&fit=crop&w=1500&q=80",
    description: `Tận hưởng khí hậu ôn đới giữa lòng miền nhiệt đới.
\n- Check-in các quán cafe sương mù cực hot.
- Dạo bước Thung lũng tình yêu, Hồ Xuân Hương.
- Săn mây lúc rạng sáng tại Đồi Chè Cầu Đất.`,
    availableSeats: 15,
    featured: true
  },
  {
    title: "Chinh Phục Fansipan - Sapa Mùa Hoa Nở",
    city: "Sapa",
    price: 3200000,
    duration: "3 Ngày 2 Đêm",
    image: "https://images.unsplash.com/photo-1618196615802-18f15d906ea1?auto=format&fit=crop&w=1500&q=80",
    description: "Hành trình đến với bản làng người H'Mông, chinh phục nóc nhà Đông Dương Fansipan bằng cáp treo và thưởng thức lẩu cá hồi.",
    availableSeats: 25,
    featured: false
  },
  {
    title: "Du Thuyền 5 Sao Khám Phá Vịnh Hạ Long",
    city: "Quảng Ninh",
    price: 3800000,
    duration: "2 Ngày 1 Đêm",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1500&q=80",
    description: "Ngủ đêm trên vịnh kỳ quan thiên nhiên thế giới, chèo kayak qua các hang động và tham gia tiệc Sunset Party trên Sundeck.",
    availableSeats: 10,
    featured: true
  },
  {
    title: "Thiên Đường Đảo Ngọc Phú Quốc",
    city: "Phú Quốc",
    price: 4500000,
    duration: "3 Ngày 2 Đêm",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1500&q=80",
    description: "Tắm biển Bãi Sao, vui chơi tại VinWonders, khám phá công viên bảo tồn Safari và ngắm hoàng hôn Dinh Cậu.",
    availableSeats: 20,
    featured: false
  },
  {
    title: "Di Sản Miền Trung: Huế - Đà Nẵng - Hội An",
    city: "Miền Trung",
    price: 4200000,
    duration: "4 Ngày 3 Đêm",
    image: "https://images.unsplash.com/photo-1581024328512-1d70e442d7ce?auto=format&fit=crop&w=1500&q=80",
    description: "Hành trình kết nối các di sản văn hóa thế giới. Khám phá Đại Nội Huế, vui chơi Bà Nà Hills và thả hoa đăng trên sông Hoài.",
    availableSeats: 30,
    featured: true
  },
  {
    title: "Tây Nguyên Đại Ngàn: Đắk Lắk - Thác Dray Nur",
    city: "Buôn Ma Thuột",
    price: 2800000,
    duration: "3 Ngày 2 Đêm",
    image: "https://images.unsplash.com/photo-1603565017590-7d7dce6bb4c8?auto=format&fit=crop&w=1500&q=80",
    description: "Trải nghiệm văn hóa cồng chiêng, thăm làng cà phê Trung Nguyên, cưỡi voi Bản Đôn và ngắm thác Dray Nur hùng vĩ.",
    availableSeats: 15,
    featured: false
  }
];

const seedDB = async () => {
  try {
    // Nhớ đổi link MongoDB nếu của bạn khác
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tour_db');
    console.log("Đã kết nối MongoDB...");

    await Tour.deleteMany();
    console.log("Đã dọn sạch database cũ...");

    await Tour.insertMany(toursData);
    console.log("🎉 THÀNH CÔNG! Đã cập nhật 12 Tour siêu chuẩn vào Database.");

    process.exit();
  } catch (error) {
    console.error("Lỗi rồi Thái ơi:", error);
    process.exit(1);
  }
};

seedDB();