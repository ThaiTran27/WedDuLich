import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { resolveImageUrl } from '../../public/assets/img/index/imagePath';

function TourDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guestSize, setGuestSize] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  // --- PHẦN MỚI: STATE CHO ĐÁNH GIÁ ---
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tourRes, reviewRes] = await Promise.all([
          axios.get(`http://127.0.0.1:5000/api/tours/${id}`),
          axios.get(`http://127.0.0.1:5000/api/reviews/${id}`)
        ]);

        // Xử lý Tour
        if (tourRes.data && tourRes.data.success) setTour(tourRes.data.data);
        else if (tourRes.data) setTour(tourRes.data);

        // Xử lý Review
        if (reviewRes.data && reviewRes.data.success) setReviews(reviewRes.data.data);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
        userId: user.id || user._id,
        guestSize: guestSize,
        totalPrice: tour.price * guestSize
      });
      if (res.data.success) {
        navigate(`/payment/${res.data.data._id}`, { state: { booking: res.data.data, tourData: tour } });
      }
    } catch (err) {
      alert('Có lỗi xảy ra khi đặt tour. Vui lòng thử lại sau.');
    } finally {
      setBookingLoading(false);
    }
  };

  // --- PHẦN MỚI: XỬ LÝ GỬI ĐÁNH GIÁ ---
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const userString = localStorage.getItem('user');
    if (!userString) {
      alert("Vui lòng đăng nhập để đánh giá!");
      navigate('/login');
      return;
    }
    const user = JSON.parse(userString);

    try {
      const res = await axios.post(`http://127.0.0.1:5000/api/reviews`, {
        tourId: tour._id,
        userId: user.id || user._id,
        rating,
        comment
      });
      alert("Cảm ơn bạn đã đánh giá!");
      // Tải lại danh sách review mới (đã populate name)
      const newReviewRes = await axios.get(`http://127.0.0.1:5000/api/reviews/${id}`);
      setReviews(newReviewRes.data.data);
      setComment('');
      setRating(5);
    } catch (err) {
      alert("Lỗi khi gửi đánh giá.");
    }
  };

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center bg-light"><div className="spinner-border text-info" style={{ width: '3rem', height: '3rem' }}></div></div>;
  if (!tour) return <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-light" style={{ paddingTop: '80px' }}><h2 className="fw-bold text-secondary">Không tìm thấy thông tin Tour</h2><Link to="/tour-trong-nuoc" className="btn btn-info text-white mt-3 rounded-pill px-4">Quay lại danh sách</Link></div>;

  return (
    <div className="bg-light pb-5" style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <style>
        {`
          .sticky-booking { position: sticky; top: 100px; z-index: 10; }
          .tour-image-banner { width: 100%; height: 450px; object-fit: cover; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
          .guest-btn { width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid #dee2e6; background: white; color: #495057; font-weight: bold; transition: all 0.2s; }
          .guest-btn:hover { background: #0dcaf0; color: white; border-color: #0dcaf0; }
          .promo-box { border: 2px dashed #ff6b6b; background-color: #fff5f5; border-radius: 16px; padding: 20px; position: relative; }
          .promo-title { position: absolute; top: -15px; left: 20px; background: #ff6b6b; color: white; padding: 4px 15px; border-radius: 20px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(255,107,107,0.2); }
          .timeline { border-left: 2px dashed #0dcaf0; padding-left: 30px; margin-left: 15px; position: relative; margin-top: 30px; }
          .timeline-item { position: relative; margin-bottom: 30px; }
          .timeline-badge { position: absolute; left: -43px; top: 0; width: 26px; height: 26px; border-radius: 50%; background: #0dcaf0; color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; border: 4px solid #f8f9fa; box-shadow: 0 0 0 2px #0dcaf0;}
          .star-active { color: #ffc107; cursor: pointer; transition: 0.2s; }
          .star-inactive { color: #dee2e6; cursor: pointer; transition: 0.2s; }
        `}
      </style>

      <div className="container">
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-info">Trang chủ</Link></li>
            <li className="breadcrumb-item"><Link to="/tour-trong-nuoc" className="text-decoration-none text-info">Tour trong nước</Link></li>
            <li className="breadcrumb-item active">{tour.city}</li>
          </ol>
        </nav>

        <h1 className="fw-bold text-dark mb-4 lh-base" style={{ fontSize: '2.2rem' }}>{tour.title}</h1>

        <div className="row g-4 g-lg-5">
          <div className="col-12 col-lg-8">
            <img src={resolveImageUrl(tour.image)} alt={tour.title} className="tour-image-banner mb-4" />

            <div className="row g-3 mb-4 text-center">
              <div className="col-6 col-md-3"><div className="bg-white p-3 rounded-4 shadow-sm border h-100"><i className="bi bi-calendar-event fs-2 text-info"></i><small className="text-muted d-block">Khởi hành</small><strong>{tour.startDate || 'Hàng ngày'}</strong></div></div>
              <div className="col-6 col-md-3"><div className="bg-white p-3 rounded-4 shadow-sm border h-100"><i className="bi bi-clock-history fs-2 text-primary"></i><small className="text-muted d-block">Thời lượng</small><strong>{tour.duration}</strong></div></div>
              <div className="col-6 col-md-3"><div className="bg-white p-3 rounded-4 shadow-sm border h-100"><i className="bi bi-geo-alt fs-2 text-danger"></i><small className="text-muted d-block">Địa điểm</small><strong>{tour.city}</strong></div></div>
              <div className="col-6 col-md-3"><div className="bg-white p-3 rounded-4 shadow-sm border h-100"><i className="bi bi-bus-front fs-2 text-warning"></i><small className="text-muted d-block">Phương tiện</small><strong>Ô tô, Thuyền</strong></div></div>
            </div>

            <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border mb-4">
              <h4 className="fw-bold border-bottom pb-3 mb-4"><i className="bi bi-info-circle-fill text-info me-2"></i> Tổng quan chuyến đi</h4>
              <p className="text-secondary lh-lg">{tour.description || `Khám phá vùng đất ${tour.city} cùng Du Lịch Việt với những trải nghiệm tuyệt vời nhất.`}</p>
            </div>

            {/* PHẦN ĐÁNH GIÁ VÀ BÌNH LUẬN */}
            <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border mb-4">
              <h4 className="fw-bold border-bottom pb-3 mb-4"><i className="bi bi-star-fill text-warning me-2"></i> Đánh giá khách hàng ({reviews.length})</h4>
              
              {/* Form gửi đánh giá */}
              <div className="bg-light p-4 rounded-4 mb-5">
                <h6 className="fw-bold mb-3">Chia sẻ trải nghiệm của bạn</h6>
                <div className="mb-3 fs-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i 
                      key={star}
                      className={`bi bi-star-fill me-1 ${star <= (hover || rating) ? 'star-active' : 'star-inactive'}`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                    ></i>
                  ))}
                </div>
                <form onSubmit={handleReviewSubmit}>
                  <textarea className="form-control border-0 shadow-sm mb-3" rows="3" placeholder="Nhập cảm nghĩ của bạn..." value={comment} onChange={(e) => setComment(e.target.value)} required></textarea>
                  <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold">Gửi đánh giá</button>
                </form>
              </div>

              {/* Danh sách review */}
              <div className="review-list">
                {reviews.map((rev) => (
                  <div key={rev._id} className="d-flex mb-4 pb-4 border-bottom">
                    <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '45px', height: '45px', minWidth: '45px' }}>
                      {rev.userId?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="ms-3">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <h6 className="fw-bold mb-0">{rev.userId?.name}</h6>
                        <span className="text-warning small">
                          {[...Array(5)].map((_, i) => (<i key={i} className={`bi bi-star${i < rev.rating ? '-fill' : ''}`}></i>))}
                        </span>
                      </div>
                      <p className="text-secondary small mb-0">{rev.comment}</p>
                      <small className="text-muted" style={{fontSize:'11px'}}>{new Date(rev.createdAt).toLocaleDateString('vi-VN')}</small>
                    </div>
                  </div>
                ))}
                {reviews.length === 0 && <p className="text-center text-muted italic">Chưa có bình luận nào. Hãy là người đầu tiên đánh giá!</p>}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-lg rounded-4 sticky-booking overflow-hidden">
              <div className="bg-primary p-4 text-center text-white" style={{ background: 'linear-gradient(135deg, #0dcaf0 0%, #087990 100%)' }}>
                <h5 className="mb-1 opacity-75">GIÁ TRỌN GÓI</h5>
                <h2 className="fw-bold mb-0 display-6">{tour.price?.toLocaleString('vi-VN')} ₫</h2>
                <small className="opacity-75">/ 1 Hành khách</small>
              </div>
              <div className="card-body p-4 p-md-5 bg-white">
                <label className="fw-bold text-dark mb-3">Số lượng hành khách</label>
                <div className="d-flex align-items-center justify-content-between bg-light rounded-pill p-2 border mb-4">
                  <button className="guest-btn" onClick={() => setGuestSize(p => p > 1 ? p - 1 : 1)}><i className="bi bi-dash"></i></button>
                  <span className="fw-bold fs-5">{guestSize}</span>
                  <button className="guest-btn" onClick={() => setGuestSize(p => p < 20 ? p + 1 : 20)}><i className="bi bi-plus"></i></button>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="fw-bold text-secondary">Tổng cộng:</span>
                  <span className="fw-bold text-danger fs-3">{(tour.price * guestSize).toLocaleString('vi-VN')} ₫</span>
                </div>
                <button onClick={handleBooking} disabled={bookingLoading} className="btn btn-danger w-100 rounded-pill py-3 fw-bold shadow fs-5">
                  {bookingLoading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-cart-check-fill me-2"></i>}
                  ĐẶT TOUR NGAY
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TourDetails;