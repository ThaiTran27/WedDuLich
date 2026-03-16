import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function TourDetails() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guestSize, setGuestSize] = useState(1);

  useEffect(() => {
    const fetchTourDetail = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/tours/${id}`);
        setTour(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải chi tiết tour:', error);
        setLoading(false);
      }
    };
    fetchTourDetail();
  }, [id]);

  const handleBooking = async () => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      alert('Bạn cần đăng nhập để đặt tour nhé!');
      navigate('/login');
      return;
    }

    const user = JSON.parse(userString);

    const bookingData = {
      userId: user._id,
      tourId: tour._id,
      guestSize: guestSize,
      totalPrice: tour.price * guestSize 
    };

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/bookings', bookingData);
      if (response.data.success) {
        navigate(`/payment/${response.data.data._id}`);
      }
    } catch (error) {
      console.error('Lỗi đặt tour:', error);
      alert('Có lỗi xảy ra khi đặt tour. Vui lòng thử lại!');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50"></div>
    </div>
  );

  if (!tour) return <div className="text-center mt-20 text-xl text-red-500 font-bold">Không tìm thấy Tour!</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Nút quay lại */}
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 font-medium mb-6 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Quay lại danh sách
        </Link>

        {/* Tiêu đề chính */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">{tour.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-600">
            <span className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Thời gian: {tour.duration}
            </span>
            <span className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              Còn trống: {tour.availableSeats} chỗ
            </span>
          </div>
        </div>

        {/* Layout 2 cột */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* CỘT TRÁI: Ảnh & Mô tả */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ảnh lớn */}
            <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-white">
              <img 
                src={tour.image} 
                alt={tour.title} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
              />
            </div>

            {/* Khối Thông tin */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Tổng quan chuyến đi</h2>
              <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
                {tour.description}
              </p>
            </div>
          </div>

          {/* CỘT PHẢI: Khung Đặt Tour (Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 sticky top-28">
              
              <div className="mb-6">
                <span className="text-gray-500 font-medium block mb-1">Giá trọn gói / Khách</span>
                <span className="text-4xl font-extrabold text-orange-500 flex items-baseline gap-1">
                  {tour.price.toLocaleString('vi-VN')} <span className="text-lg text-gray-500 font-normal">₫</span>
                </span>
              </div>

              <div className="space-y-6">
                {/* Chọn số người */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider block mb-3">Số lượng hành khách</label>
                  <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-2 shadow-sm">
                    <button 
                      onClick={() => setGuestSize(prev => Math.max(1, prev - 1))}
                      className="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center text-xl font-bold transition"
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      min="1" 
                      max={tour.availableSeats}
                      value={guestSize}
                      onChange={(e) => setGuestSize(Number(e.target.value))}
                      className="w-16 text-center text-xl font-bold text-gray-900 bg-transparent focus:outline-none"
                      readOnly
                    />
                    <button 
                      onClick={() => setGuestSize(prev => Math.min(tour.availableSeats, prev + 1))}
                      className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center text-xl font-bold transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Tổng tiền */}
                <div className="flex items-center justify-between py-4 border-t border-b border-dashed border-gray-200">
                  <span className="text-gray-900 font-bold text-lg">Tổng thanh toán</span>
                  <span className="text-2xl font-extrabold text-red-600">
                    {(tour.price * guestSize).toLocaleString('vi-VN')} ₫
                  </span>
                </div>
                
                {/* Nút Đặt Tour */}
                <button 
                  onClick={handleBooking}
                  className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-2xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/30 text-lg flex justify-center items-center gap-2 transform hover:-translate-y-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Yêu Cầu Đặt Tour
                </button>
                <p className="text-center text-xs text-gray-400 mt-4">
                  Bạn sẽ không bị trừ tiền cho đến khi hoàn tất bước thanh toán.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default TourDetails;