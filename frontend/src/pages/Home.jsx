import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() { 
  const [tours, setTours] = useState([]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/tours');
        setTours(response.data.data); 
      } catch (error) {
        console.error('Lỗi khi tải danh sách tour:', error);
      }
    };
    fetchTours();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      
      {/* KHỐI BANNER (HERO SECTION) */}
      <div className="relative bg-blue-900 h-[400px] flex items-center justify-center mb-12">
        {/* Ảnh nền có lớp phủ mờ */}
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80" 
            alt="Travel Banner" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        
        {/* Nội dung chữ trên Banner */}
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            Thế giới ngoài kia bao la, <br/> chờ bạn khám phá!
          </h1>
          <p className="text-lg text-blue-100 mb-8">
            Tìm kiếm và đặt ngay những chuyến đi tuyệt vời nhất với hệ thống quản lý chuẩn quốc tế.
          </p>
        </div>
      </div>

      {/* DANH SÁCH TOUR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Điểm đến nổi bật</h2>
            <p className="text-gray-500 mt-1">Lựa chọn hàng đầu cho chuyến đi tiếp theo của bạn</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <Link 
              to={`/tour/${tour._id}`} 
              key={tour._id} 
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 block cursor-pointer group flex flex-col h-full"
            >
              {/* Vùng Ảnh */}
              <div className="relative h-56 w-full overflow-hidden rounded-t-2xl">
                <img 
                  src={tour.image} 
                  alt={tour.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'} 
                />
                {/* Thẻ tag thời gian nổi trên ảnh */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
                  {tour.duration}
                </div>
              </div>
              
              {/* Vùng Nội dung */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {tour.title}
                </h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-grow">
                  {tour.description}
                </p>
                
                {/* Vùng Giá tiền & Đặt ngay */}
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-xs text-gray-400 block mb-0.5">Giá chỉ từ</span>
                    <span className="text-xl font-extrabold text-orange-500">
                      {tour.price.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                  <span className="text-blue-600 font-semibold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Xem chi tiết →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Home;