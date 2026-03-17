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

  // HÀM XỬ LÝ ĐẶT TOUR CHUẨN MERN STACK
  const handleBooking = async () => {
    const userString = localStorage.getItem('user');
    
    // 1. Kiểm tra đăng nhập
    if (!userString) {
      alert('Vui lòng đăng nhập để đặt tour!');
      navigate('/login');
      return;
    }

    const userData = JSON.parse(userString);

    try {
      // 2. Gửi dữ liệu đơn hàng xuống Backend
      const response = await axios.post('http://127.0.0.1:5000/api/bookings', {
        tourId: tour._id,
        userId: userData._id,
        guestSize: guestSize,
        totalPrice: tour.price * guestSize
      });

      if (response.data.success) {
        // 3. Nếu thành công, lấy ID đơn hàng mới và chuyển sang trang Thanh Toán
        const newBookingId = response.data.data._id;
        navigate(`/payment/${newBookingId}`);
      }
    } catch (error) {
      console.error('Lỗi khi đặt tour:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi đặt tour!');
    }
  };

  if (loading) return <div className="text-center pt-5 mt-5"><div className="spinner-border text-info"></div></div>;
  if (!tour) return <div className="text-center pt-5 mt-5"><h2>Không tìm thấy tour!</h2></div>;

  return (
    <main className="content pt-5 mt-5 pb-5 bg-light">
      <div className="container pt-4">
        <Link to="/" className="text-decoration-none text-secondary mb-4 d-inline-block hover-info">
          <i className="bi bi-arrow-left me-2"></i> Quay lại danh sách
        </Link>

        <div className="row">
          <div className="col-12 col-lg-8">
            <div className="row header-content mb-3">
              <h2 className="font_DPTBlacksword text-info display-5">{tour.title}</h2>
              <div className="d-flex flex-wrap gap-3 mt-2">
                <span className="badge bg-white text-dark border p-2 fs-6 rounded-pill shadow-sm">
                  <i className="bi bi-clock text-info me-1"></i> {tour.duration}
                </span>
                <span className="badge bg-white text-dark border p-2 fs-6 rounded-pill shadow-sm">
                  <i className="bi bi-geo-alt-fill text-danger me-1"></i> {tour.city || 'Việt Nam'}
                </span>
              </div>
            </div>

            <div className="row images-content mb-4">
              <img src={tour.image} alt={tour.title} className="img-fluid w-100 rounded-4 shadow-sm object-fit-cover" style={{ maxHeight: '450px' }} />
            </div>

            <div className="row bg-white p-4 rounded-4 shadow-sm mb-4">
              <h3 className="text-info border-bottom pb-2 mb-3">Tổng quan chuyến đi</h3>
              <div className="lichtrinh col-12 text-secondary fs-5" style={{ lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                {tour.description}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4 mt-4 mt-lg-0">
            <div className="bg-white rounded-4 shadow-lg border-0 sticky-top" style={{ top: '100px' }}>
              <div className="bg-info text-white p-4 rounded-top-4 text-center">
                <p className="mb-1 text-uppercase fw-bold">Giá trọn gói</p>
                <h2 className="display-6 fw-bold mb-0">{tour.price.toLocaleString('vi-VN')} ₫</h2>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <label className="form-label fw-bold text-secondary">Số lượng hành khách</label>
                  <div className="d-flex align-items-center justify-content-between bg-light rounded-pill p-2 border">
                    <button className="btn btn-white rounded-circle shadow-sm" onClick={() => setGuestSize(Math.max(1, guestSize - 1))}>-</button>
                    <span className="fs-4 fw-bold">{guestSize}</span>
                    <button className="btn btn-white rounded-circle shadow-sm text-info" onClick={() => setGuestSize(guestSize + 1)}>+</button>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-4 border-top pt-3">
                  <span className="fs-5 fw-bold">Tổng tiền:</span>
                  <span className="fs-4 fw-bold text-danger">{(tour.price * guestSize).toLocaleString('vi-VN')} ₫</span>
                </div>
                <button onClick={handleBooking} className="btn btn-danger w-100 rounded-pill py-3 fw-bold shadow">
                   ĐẶT TOUR NGAY
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