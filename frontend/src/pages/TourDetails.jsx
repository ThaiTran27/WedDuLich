import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function TourDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guestSize, setGuestSize] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:5000/api/tours/${id}`);
        // Xử lý linh hoạt cấu trúc trả về
        if (res.data && res.data.success) {
          setTour(res.data.data);
        } else if (res.data) {
          setTour(res.data);
        }
      } catch (error) {
        console.error("Lỗi lấy chi tiết tour:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  // Xử lý khi bấm nút Đặt Tour
  const handleBooking = async () => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      alert('Vui lòng đăng nhập để tiến hành đặt tour!');
      navigate('/login');
      return;
    }

    const user = JSON.parse(userString);
    setBookingLoading(true);

    try {
      const res = await axios.post('http://127.0.0.1:5000/api/bookings', {
        tourId: tour._id,
        userId: user.id || user._id, // Hỗ trợ cả 2 cách lưu ID
        guestSize: guestSize,
        totalPrice: tour.price * guestSize
      });

      if (res.data.success) {
        // CHIÊU MỚI: Chuyền thẳng dữ liệu đơn hàng và thông tin Tour sang trang thanh toán!
        navigate(`/payment/${res.data.data._id}`, { 
          state: { 
            booking: res.data.data,
            tourData: tour 
          } 
        });
      }
    } catch (err) {
      alert('Có lỗi xảy ra khi đặt tour. Vui lòng thử lại sau.');
      console.error(err);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="spinner-border text-info" style={{ width: '3rem', height: '3rem' }}></div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-light" style={{ paddingTop: '80px' }}>
        <h2 className="fw-bold text-secondary">Không tìm thấy thông tin Tour</h2>
        <Link to="/tour-trong-nuoc" className="btn btn-info text-white mt-3 rounded-pill px-4">Quay lại danh sách</Link>
      </div>
    );
  }

  return (
    // Thêm padding-top 100px để fix lỗi bị thanh Navbar che khuất
    <div className="bg-light pb-5" style={{ paddingTop: '100px', minHeight: '100vh' }}>
      
      {/* CSS Tùy chỉnh cho trang chi tiết */}
      <style>
        {`
          .sticky-booking {
            position: sticky;
            top: 100px; /* Bám dính cách top 100px */
            z-index: 10;
          }
          .tour-image-banner {
            width: 100%;
            height: 450px;
            object-fit: cover;
            border-radius: 24px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          }
          .guest-btn {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #dee2e6;
            background: white;
            color: #495057;
            font-weight: bold;
            transition: all 0.2s;
          }
          .guest-btn:hover { background: #0dcaf0; color: white; border-color: #0dcaf0; }
        `}
      </style>

      <div className="container">
        
        {/* ĐIỀU HƯỚNG BREADCRUMB */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-info">Trang chủ</Link></li>
            <li className="breadcrumb-item"><Link to="/tour-trong-nuoc" className="text-decoration-none text-info">Tour trong nước</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{tour.city}</li>
          </ol>
        </nav>

        {/* TIÊU ĐỀ TOUR */}
        <h1 className="fw-bold text-dark mb-4 lh-base" style={{ fontSize: '2.2rem' }}>{tour.title}</h1>

        <div className="row g-4 g-lg-5">
          {/* CỘT TRÁI: HÌNH ẢNH & CHI TIẾT */}
          <div className="col-12 col-lg-8">
            
            {/* Ảnh Cover */}
            <img 
              src={tour.image || "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80"} 
              alt={tour.title} 
              className="tour-image-banner mb-4"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80'; }}
            />

            {/* Thông tin nhanh (Pills) */}
            <div className="d-flex flex-wrap gap-3 mb-5">
              <div className="bg-white px-4 py-3 rounded-4 shadow-sm border d-flex align-items-center flex-fill">
                <i className="bi bi-clock-history fs-3 text-info me-3"></i>
                <div>
                  <small className="text-muted d-block">Thời gian</small>
                  <strong className="text-dark">{tour.duration || 'Đang cập nhật'}</strong>
                </div>
              </div>
              <div className="bg-white px-4 py-3 rounded-4 shadow-sm border d-flex align-items-center flex-fill">
                <i className="bi bi-geo-alt fs-3 text-danger me-3"></i>
                <div>
                  <small className="text-muted d-block">Địa điểm</small>
                  <strong className="text-dark">{tour.city || 'Việt Nam'}</strong>
                </div>
              </div>
              <div className="bg-white px-4 py-3 rounded-4 shadow-sm border d-flex align-items-center flex-fill">
                <i className="bi bi-bus-front fs-3 text-warning me-3"></i>
                <div>
                  <small className="text-muted d-block">Phương tiện</small>
                  <strong className="text-dark">Ô tô, Thuyền</strong>
                </div>
              </div>
            </div>

            {/* Tổng quan chuyến đi */}
            <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border mb-4">
              <h4 className="fw-bold border-bottom pb-3 mb-4 text-dark">
                <i className="bi bi-info-circle-fill text-info me-2"></i> Tổng quan chuyến đi
              </h4>
              <div className="text-secondary lh-lg" style={{ fontSize: '1.05rem' }}>
                <p>Khám phá vùng đất <strong>{tour.city}</strong> với những trải nghiệm khó quên cùng Du Lịch Việt. Chuyến hành trình được thiết kế chuyên nghiệp, tối ưu hóa thời gian để bạn có thể tận hưởng trọn vẹn vẻ đẹp thiên nhiên, văn hóa và ẩm thực địa phương.</p>
                <ul className="list-unstyled mt-4">
                  <li className="mb-3"><i className="bi bi-check2-circle text-success me-2 fs-5"></i> Trải nghiệm văn hóa đặc sắc tại các địa danh nổi tiếng.</li>
                  <li className="mb-3"><i className="bi bi-check2-circle text-success me-2 fs-5"></i> Thưởng thức đặc sản vùng miền với thực đơn đa dạng.</li>
                  <li className="mb-3"><i className="bi bi-check2-circle text-success me-2 fs-5"></i> Lưu trú tại khách sạn tiêu chuẩn, tiện nghi thoải mái.</li>
                  <li className="mb-3"><i className="bi bi-check2-circle text-success me-2 fs-5"></i> Hướng dẫn viên nhiệt tình, giàu kinh nghiệm đồng hành suốt tuyến.</li>
                </ul>
              </div>
            </div>
            
            {/* Nếu có thêm phần Lịch trình (Itinerary) thì code ở đây */}
          </div>

          {/* CỘT PHẢI: BẢNG ĐẶT TOUR (STICKY) */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-lg rounded-4 sticky-booking overflow-hidden">
              <div className="bg-primary p-4 text-center text-white" style={{ background: 'linear-gradient(135deg, #0dcaf0 0%, #087990 100%)' }}>
                <h5 className="mb-1 opacity-75">GIÁ TRỌN GÓI</h5>
                <h2 className="fw-bold mb-0 display-6">{tour.price ? tour.price.toLocaleString('vi-VN') : '0'} ₫</h2>
                <small className="opacity-75">/ 1 Hành khách</small>
              </div>
              
              <div className="card-body p-4 p-md-5 bg-white">
                <div className="mb-4">
                  <label className="fw-bold text-dark mb-3">Số lượng hành khách</label>
                  <div className="d-flex align-items-center justify-content-between bg-light rounded-pill p-2 border">
                    <button 
                      className="guest-btn" 
                      onClick={() => setGuestSize(prev => prev > 1 ? prev - 1 : 1)}
                    >
                      <i className="bi bi-dash"></i>
                    </button>
                    <span className="fw-bold fs-5 px-4">{guestSize}</span>
                    <button 
                      className="guest-btn" 
                      onClick={() => setGuestSize(prev => prev < 20 ? prev + 1 : 20)}
                    >
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>
                </div>

                <hr className="my-4 text-muted" />

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="fw-bold text-secondary fs-5">Tổng cộng:</span>
                  <span className="fw-bold text-danger fs-3">
                    {(tour.price * guestSize).toLocaleString('vi-VN')} ₫
                  </span>
                </div>

                <button 
                  onClick={handleBooking} 
                  disabled={bookingLoading}
                  className="btn btn-danger w-100 rounded-pill py-3 fw-bold shadow hover-scale fs-5 d-flex justify-content-center align-items-center"
                >
                  {bookingLoading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    <i className="bi bi-cart-check-fill me-2 fs-4"></i>
                  )}
                  {bookingLoading ? 'Đang xử lý...' : 'ĐẶT TOUR NGAY'}
                </button>
                
                <div className="text-center mt-3 text-muted small">
                  <i className="bi bi-shield-check text-success me-1"></i> Thanh toán bảo mật, uy tín 100%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TourDetails;