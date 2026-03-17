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
        if (response.data.success) {
          setTour(response.data.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải chi tiết tour:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTourDetail();
  }, [id]);

  // HÀM XỬ LÝ ĐẶT TOUR THẬT (GỌI XUỐNG DATABASE)
  const handleBooking = async () => {
    const userString = localStorage.getItem('user');
    
    // 1. Kiểm tra đã đăng nhập chưa
    if (!userString) {
      alert('Thái ơi, bạn cần đăng nhập để đặt tour nhé!');
      navigate('/login');
      return;
    }

    const userData = JSON.parse(userString);

    try {
      // 2. Gửi lệnh tạo đơn hàng (Booking) xuống Backend
      const response = await axios.post('http://127.0.0.1:5000/api/bookings', {
        tourId: tour._id,
        userId: userData._id,
        guestSize: guestSize,
        totalPrice: tour.price * guestSize
      });

      if (response.data.success) {
        // 3. Thành công thì lấy ID đơn hàng và nhảy sang trang Thanh Toán
        const newBookingId = response.data.data._id;
        alert('Đã khởi tạo đơn hàng thành công! Đang chuyển sang trang thanh toán...');
        navigate(`/payment/${newBookingId}`);
      }
    } catch (error) {
      console.error('Lỗi đặt tour:', error);
      alert('Không thể tạo đơn hàng. Bạn kiểm tra xem Backend đã chạy chưa nhé!');
    }
  };

  if (loading) return <div className="text-center pt-5 mt-5"><div className="spinner-border text-info"></div></div>;
  if (!tour) return <div className="text-center pt-5 mt-5"><h2>Không tìm thấy Tour!</h2></div>;

  return (
    <main className="content pt-4 pb-5 bg-light">
      <div className="container">
        <Link to="/" className="text-decoration-none text-secondary mb-3 d-inline-block hover-info">
          <i className="bi bi-arrow-left me-2"></i> Quay lại danh sách
        </Link>

        {/* Tiêu đề dễ đọc */}
        <h1 className="fw-bold text-info mb-4" style={{ fontFamily: 'sans-serif', lineHeight: '1.3' }}>
          {tour.title}
        </h1>

        <div className="row">
          <div className="col-12 col-lg-8">
            <div className="mb-4">
              <img 
                src={tour.image} 
                className="img-fluid w-100 rounded-4 shadow-sm"
                style={{ maxHeight: '500px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1000&q=80';
                }}
              />
            </div>
            <div className="bg-white p-4 rounded-4 shadow-sm">
              <h4 className="text-info border-bottom pb-2 mb-3">Tổng quan chuyến đi</h4>
              <p className="fs-5 text-secondary" style={{ whiteSpace: 'pre-line' }}>{tour.description}</p>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-lg rounded-4 sticky-top" style={{ top: '100px' }}>
              <div className="card-body p-4 text-center">
                <span className="text-muted small fw-bold">GIÁ TRỌN GÓI</span>
                <h2 className="text-info fw-bold mb-4">{tour.price.toLocaleString('vi-VN')} ₫</h2>
                
                <div className="mb-3 text-start">
                  <label className="fw-bold small mb-2 text-secondary">Số lượng hành khách</label>
                  <input type="number" className="form-control rounded-pill text-center fw-bold" 
                         value={guestSize} min="1" onChange={(e) => setGuestSize(e.target.value)} />
                </div>

                <div className="d-flex justify-content-between mb-4 border-top pt-3">
                  <span className="fw-bold">Tổng cộng:</span>
                  <span className="text-danger fw-bold fs-4">{(tour.price * guestSize).toLocaleString('vi-VN')} ₫</span>
                </div>

                {/* NÚT BẤM ĐÃ CÓ onClick */}
                <button onClick={handleBooking} className="btn btn-danger w-100 rounded-pill py-3 fw-bold shadow">
                  <i className="bi bi-cart-check me-2"></i> ĐẶT TOUR NGAY
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default TourDetails;