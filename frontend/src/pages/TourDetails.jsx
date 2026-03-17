import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function TourDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guestSize, setGuestSize] = useState(1);
  
  // 1. Thêm State để điều khiển Pop-up và lưu thông tin User
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Lấy thông tin user ngay khi load trang
    const userString = localStorage.getItem('user');
    if (userString) setCurrentUser(JSON.parse(userString));

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

  // 2. NÚT BẤM BÊN NGOÀI: CHỈ ĐỂ MỞ POP-UP KIỂM TRA
  const handleOpenModal = () => {
    if (!currentUser) {
      alert('Thái ơi, bạn cần đăng nhập để đặt tour nhé!');
      navigate('/login');
      return;
    }
    setShowModal(true);
  };

  // 3. NÚT XÁC NHẬN BÊN TRONG POP-UP: GỌI XUỐNG DATABASE
  const confirmBooking = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/bookings', {
        tourId: tour._id,
        userId: currentUser._id,
        guestSize: guestSize,
        totalPrice: tour.price * guestSize
      });

      if (response.data.success) {
        setShowModal(false); // Đóng pop-up
        const newBookingId = response.data.data._id;
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
    <main className="content pt-4 pb-5 bg-light position-relative">
      <div className="container">
        <Link to="/tour-trong-nuoc" className="text-decoration-none text-secondary mb-3 d-inline-block hover-info">
          <i className="bi bi-arrow-left me-2"></i> Quay lại danh sách
        </Link>

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
            <div className="bg-white p-4 rounded-4 shadow-sm mb-4">
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

                {/* ĐỔI THÀNH HÀM MỞ POP-UP */}
                <button onClick={handleOpenModal} className="btn btn-danger w-100 rounded-pill py-3 fw-bold shadow">
                  <i className="bi bi-cart-check me-2"></i> ĐẶT TOUR NGAY
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL (POP-UP) XÁC NHẬN THÔNG TIN --- */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header bg-info text-white rounded-top-4">
                <h5 className="modal-title fw-bold"><i className="bi bi-info-circle me-2"></i>Xác nhận thông tin</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <p className="text-muted small mb-4">Vui lòng kiểm tra lại thông tin liên lạc trước khi chuyển sang trang thanh toán.</p>
                
                {/* TỰ ĐỘNG ĐIỀN THÔNG TIN TỪ LOCALSTORAGE */}
                <div className="mb-3">
                  <label className="small fw-bold text-secondary">Họ và tên người đặt</label>
                  <input type="text" className="form-control bg-light" value={currentUser?.name} readOnly />
                </div>
                <div className="mb-3">
                  <label className="small fw-bold text-secondary">Số điện thoại</label>
                  <input type="text" className="form-control bg-light" value={currentUser?.phone || 'Chưa cập nhật'} readOnly />
                </div>
                <div className="mb-4">
                  <label className="small fw-bold text-secondary">Email</label>
                  <input type="text" className="form-control bg-light" value={currentUser?.email} readOnly />
                </div>

                <div className="border-top pt-3 mb-2 d-flex justify-content-between">
                  <span className="fw-bold">Số khách:</span>
                  <span className="fw-bold">{guestSize} người</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="fw-bold">Số tiền cần thanh toán:</span>
                  <span className="text-danger fw-bold fs-5">{(tour.price * guestSize).toLocaleString('vi-VN')} ₫</span>
                </div>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button type="button" className="btn btn-light rounded-pill fw-bold w-100 mb-2" onClick={() => setShowModal(false)}>HỦY BỎ</button>
                {/* NÚT XÁC NHẬN CHÍNH THỨC */}
                <button type="button" className="btn btn-danger rounded-pill fw-bold w-100 m-0" onClick={confirmBooking}>XÁC NHẬN ĐẶT TOUR</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default TourDetails;