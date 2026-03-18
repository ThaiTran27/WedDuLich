const mongoose = require('mongoose');
const Blog = require('./models/Blog');
require('dotenv').config();

const blogsData = [
  { 
    category: 'Cẩm Nang Du Lịch', 
    title: 'Du lịch miền Tây có gì vui? Kinh nghiệm đi miền Tây tự túc', 
    excerpt: 'Du lịch miền Tây hấp dẫn bởi chợ nổi, miệt vườn, sông nước, ẩm thực dân dã và nhịp sống rất đỗi bình yên...', 
    content: 'Miền Tây Nam Bộ, hay còn gọi là Đồng bằng sông Cửu Long, luôn mang một vẻ đẹp mộc mạc, bình dị. Đến đây, bạn không chỉ được ngắm nhìn những cánh đồng lúa bát ngát, những vườn trái cây trĩu quả mà còn được trải nghiệm văn hóa chợ nổi đặc trưng. Thời điểm lý tưởng nhất để đi miền Tây là mùa nước nổi (từ tháng 9 đến tháng 11) hoặc mùa trái cây chín (tháng 6 đến tháng 8).',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80', 
  },
  { 
    category: 'Cẩm Nang Du Lịch', 
    title: 'Gợi ý tour lễ 30/4 1/5 nổi bật: Lịch trình chi tiết', 
    excerpt: 'Tổng hợp các tour lễ 30/4 1/5 đáng quan tâm cho kỳ nghỉ sắp tới, giúp bạn dễ chọn hành trình phù hợp...', 
    content: 'Kỳ nghỉ lễ 30/4 và 1/5 năm nay kéo dài, đây là thời điểm tuyệt vời để gia đình bạn có một chuyến đi xa. Nếu bạn thích biển, Phú Quốc và Nha Trang là lựa chọn hàng đầu. Nếu bạn muốn tìm về thiên nhiên trong lành, Đà Lạt hoặc các tỉnh miền Tây Nam Bộ sẽ không làm bạn thất vọng. Hãy đặt tour sớm để tránh tình trạng hết phòng và vé máy bay tăng cao nhé!',
    image: 'https://images.unsplash.com/photo-1555921015-c2848f1c26e4?auto=format&fit=crop&w=800&q=80', 
  },
  { 
    category: 'Cẩm Nang Du Lịch', 
    title: 'Kinh nghiệm chọn tour miền Tây phù hợp cho gia đình', 
    excerpt: 'Nếu bạn đang tìm một tour miền Tây phù hợp từ TP.HCM nhưng chưa biết nên chọn lịch trình nào, hãy xem ngay...', 
    content: 'Đi du lịch với gia đình, đặc biệt là có người già và trẻ nhỏ, đòi hỏi lịch trình phải thoải mái, không di chuyển quá nhiều. Bạn nên chọn các tour nghỉ dưỡng kết hợp sinh thái như tour Mỹ Tho - Bến Tre (1 ngày) hoặc Cần Thơ - Chợ nổi Cái Răng (2 ngày 1 đêm). Nhớ mang theo thuốc chống muỗi và trang phục thoáng mát nhé.',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80', 
  },
  { 
    category: 'Đặc Sản Miền Tây', 
    title: 'Top 5 món ngon phải thử khi đến Cần Thơ', 
    excerpt: 'Đến Cần Thơ gạo trắng nước trong, đừng bỏ lỡ cơ hội thưởng thức lẩu mắm, bánh xèo dạ cổ, và bún quậy nức tiếng...', 
    content: '1. Lẩu mắm Dạ Lý: Nước lẩu đậm đà ăn kèm hàng chục loại rau tập tàng.\n2. Bánh xèo Mười Xiềm: Vỏ bánh mỏng giòn rụm, nhân tôm thịt đầy đặn.\n3. Vịt nấu chao: Món ăn đặc trưng với vị béo ngậy của chao và khoai môn.\n4. Bánh cống: Giòn rụm, ăn kèm rau sống và nước mắm chua ngọt.\n5. Trái cây miệt vườn: Đừng quên thưởng thức sầu riêng, chôm chôm, măng cụt hái tận cây.',
    image: 'https://images.unsplash.com/photo-1628746355325-2e6d628eb4b4?auto=format&fit=crop&w=800&q=80', 
  },
  { 
    category: 'Địa Điểm Du Lịch', 
    title: 'Review Tour Miền Tây 2 Ngày 1 Đêm: Mỹ Tho - Cần Thơ', 
    excerpt: 'Trải nghiệm tour miền Tây 2 ngày 1 đêm: tham quan Mỹ Tho, Bến Tre, Cần Thơ, chợ nổi Cái Răng cực kỳ chi tiết...', 
    content: 'Ngày 1: Xuất phát từ TP.HCM đi Mỹ Tho, tham quan chùa Vĩnh Tràng, đi đò qua cồn Thới Sơn uống trà mật ong, nghe đờn ca tài tử. Chiều di chuyển xuống Cần Thơ nhận phòng.\nNgày 2: Dậy lúc 5h sáng đi chợ nổi Cái Răng, tham quan lò hủ tiếu, vườn trái cây. Thưởng thức đặc sản và lên xe về lại TP.HCM. Chuyến đi tuy ngắn nhưng mang lại trải nghiệm vô cùng đáng nhớ.',
    image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=800&q=80', 
  },
  { 
    category: 'Văn Hóa Miền Tây', 
    title: 'Tìm hiểu nghệ thuật Đờn Ca Tài Tử Nam Bộ', 
    excerpt: 'Đờn ca tài tử không chỉ là loại hình nghệ thuật đặc sắc mà còn là di sản văn hóa phi vật thể đại diện của nhân loại...', 
    content: 'Đờn ca tài tử hình thành vào cuối thế kỷ 19, bắt nguồn từ nhạc cung đình Huế và nhã nhạc. Đây là loại hình nghệ thuật vừa mang tính bác học vừa mang tính dân gian. Người chơi đờn ca tài tử không phân biệt sang hèn, chỉ cần đam mê và có tâm hồn nghệ sĩ. Những buổi đờn ca thường diễn ra dưới bóng cây bến nước, trong sân chùa hay tại các miệt vườn sau giờ lao động mệt nhọc.',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80', 
  }
];

const seedBlogs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tour_db');
    console.log("Đã kết nối MongoDB...");

    await Blog.deleteMany(); // Xóa bài cũ nếu có
    await Blog.insertMany(blogsData);
    
    console.log("🎉 THÀNH CÔNG! Đã đẩy dữ liệu Blog vào MongoDB.");
    process.exit();
  } catch (error) {
    console.error("Lỗi:", error);
    process.exit(1);
  }
};

seedBlogs();