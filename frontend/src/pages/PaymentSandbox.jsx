import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function PaymentSandbox() {
  const { bookingId } = useParams(); // Lấy mã đơn hàng từ URL
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Lấy thông tin đơn hàng để hiển thị số tiền cần thanh toán
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        // Giả sử bạn có API lấy chi tiết 1 booking (nếu chưa có, bạn có thể gọi API lấy tất cả rồi lọc ra)
        const response = await axios.get('http://127.0.0.1:5000/api/bookings');
        const currentBooking = response.data.data.find(b => b._id === bookingId);
        
        if (currentBooking) {
          setBooking(currentBooking);
        } else {
          alert('Không tìm thấy đơn hàng hợp lệ!');
          navigate('/');
        }
      } catch (error) {
        console.error('Lỗi lấy thông tin đơn hàng:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [bookingId, navigate]);

  // Hàm xử lý thanh toán giả lập
  const handlePayment = async () => {
    setProcessing(true);
    
    try {
      // 1. Gọi API cập nhật trạng thái đơn hàng thành 'paid' ở Backend
      // (Lưu ý: Bạn cần chắc chắn Backend có API này, ví dụ: PUT /api/bookings/:id)
      await axios.put(`http://127.0.0.1:5000/api/bookings/${bookingId}`, {
        status: 'paid'
      });

      // 2. Giả lập thời gian chờ của ngân hàng (2 giây)
      setTimeout(() => {
        setProcessing(false);
        setPaymentSuccess(true);
        
        // 3. Tự động chuyển về trang Tài khoản (Lịch sử) sau khi báo thành công
        setTimeout(() => {
          navigate('/tai-khoan');
        }, 2000);
      }, 2000);

    } catch (error) {
      console.error('Lỗi khi thanh toán:', error);
      alert('Giao dịch thất bại, vui lòng thử lại!');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center pt-5 bg-light">
        <div className="spinner-border text-info" style={{width: '3rem', height: '3rem'}} role="status"></div>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <main className="content bg-light" style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '60px' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            
            {/* THẺ HIỂN THỊ TRẠNG THÁI THANH TOÁN THÀNH CÔNG */}
            {paymentSuccess ? (
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden text-center p-5">
                <div className="mb-4">
                  <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '5rem' }}></i>
                </div>
                <h2 className="fw-bold text-success mb-3">Thanh toán thành công!</h2>
                <p className="text-secondary fs-5">Cảm ơn bạn đã tin tưởng hệ thống của chúng tôi.</p>
                <p className="text-muted small">Hệ thống sẽ tự động chuyển về trang Lịch sử đơn hàng...</p>
                <div className="spinner-grow text-success mt-3" role="status" style={{width: '1.5rem', height: '1.5rem'}}></div>
              </div>
            ) : (
              /* THẺ HIỂN THỊ CỔNG THANH TOÁN */
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="bg-dark text-white p-4 text-center">
                  <h3 className="font_DPTBlacksword mb-0 fs-2">Cổng Thanh Toán</h3>
                  <p className="mb-0 text-info font-monospace tracking-widest">SANDBOX ENVIRONMENT</p>
                </div>
                
                <div className="card-body p-4 p-md-5">
                  
                  {/* Tóm tắt đơn hàng */}
                  <div className="bg-light p-4 rounded-4 mb-4 border">
                    <h5 className="fw-bold border-bottom pb-2 mb-3">Tóm tắt đơn hàng</h5>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-secondary">Mã giao dịch:</span>
                      <span className="fw-bold text-dark">#{booking._id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-secondary">Tour:</span>
                      <span className="fw-bold text-info text-end" style={{maxWidth: '60%'}}>{booking.tourId?.title || 'Tour du lịch'}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-secondary">Số lượng khách:</span>
                      <span className="fw-bold text-dark">{booking.guestSize} người</span>
                    </div>
                    <hr className="text-muted" />
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="fs-5 fw-bold text-dark">Tổng cần thanh toán:</span>
                      <span className="fs-3 fw-bold text-danger">{booking.totalPrice.toLocaleString('vi-VN')} ₫</span>
                    </div>
                  </div>

                  {/* Phương thức thanh toán (Giao diện giả lập) */}
                  <h5 className="fw-bold mb-3">Chọn phương thức thanh toán</h5>
                  <div className="d-grid gap-3 mb-4">
                    <label className="btn btn-outline-secondary text-start p-3 rounded-4 d-flex align-items-center">
                      <input type="radio" name="paymentMethod" className="form-check-input me-3" defaultChecked />
                      <i className="bi bi-credit-card-2-front text-primary fs-4 me-3"></i>
                      <span className="fw-bold text-dark">Thẻ tín dụng / Ghi nợ (Thử nghiệm)</span>
                    </label>
                    <label className="btn btn-outline-secondary text-start p-3 rounded-4 d-flex align-items-center opacity-50">
                      <input type="radio" name="paymentMethod" className="form-check-input me-3" disabled />
                      <i className="bi bi-wallet2 text-success fs-4 me-3"></i>
                      <span className="fw-bold text-dark">Ví Momo (Đang bảo trì)</span>
                    </label>
                  </div>

                  {/* Nút Xác nhận */}
                  <button 
                    className="btn btn-info w-100 rounded-pill py-3 text-white fw-bold fs-5 shadow-sm hover-shadow"
                    onClick={handlePayment}
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Đang xử lý giao dịch...
                      </>
                    ) : (
                      <><i className="bi bi-lock-fill me-2"></i> XÁC NHẬN THANH TOÁN AN TOÀN</>
                    )}
                  </button>
                  
                  <div className="text-center mt-4">
                    <Link to="/tai-khoan" className="text-muted text-decoration-none hover-info">
                      <i className="bi bi-arrow-left me-1"></i> Hủy giao dịch và quay lại
                    </Link>
                  </div>
                  
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}

export default PaymentSandbox;