import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PaymentSandbox() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Tạo một mã QR giả lập dựa trên ID đơn hàng
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ThanhToan_DuLichViet_DonHang_${bookingId}`;

  const handlePaymentConfirm = async () => {
    setIsProcessing(true);
    
    // Giả lập thời gian chờ ngân hàng xử lý (2 giây) cho giống thật
    setTimeout(async () => {
      try {
        const res = await axios.put(`http://127.0.0.1:5000/api/bookings/${bookingId}/pay`);
        
        if (res.data.success) {
          alert('🎉 Thanh toán thành công! Cảm ơn bạn đã đặt tour.');
          // Chuyển hướng khách về trang Quản lý tài khoản để xem đơn
          navigate('/tai-khoan'); 
        }
      } catch (error) {
        alert('Có lỗi xảy ra trong quá trình xác nhận thanh toán!');
        setIsProcessing(false);
      }
    }, 2000);
  };

  return (
    <div className="bg-light min-vh-100 py-5 mt-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              {/* Header của form thanh toán */}
              <div className="bg-info p-4 text-center text-white">
                <h4 className="fw-bold mb-1">CỔNG THANH TOÁN</h4>
                <p className="mb-0 small opacity-75">Mã đơn hàng: {bookingId.substring(0, 8).toUpperCase()}</p>
              </div>

              <div className="card-body p-5 text-center">
                <div className="alert alert-warning small mb-4 text-start rounded-3">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Đây là môi trường thử nghiệm (Sandbox). Vui lòng không chuyển tiền thật.
                </div>

                <h6 className="fw-bold text-secondary mb-3">QUÉT MÃ QR ĐỂ THANH TOÁN</h6>
                
                {/* Khung chứa mã QR */}
                <div className="bg-white p-3 d-inline-block rounded-4 shadow-sm border mb-4">
                  <img src={qrCodeUrl} alt="QR Code Thanh Toán" className="img-fluid" style={{ width: '200px', height: '200px' }} />
                </div>

                <p className="text-muted small mb-4">
                  Sử dụng ứng dụng Ngân hàng hoặc MoMo để quét mã QR này.<br/>
                  Trạng thái đơn hàng sẽ được cập nhật tự động.
                </p>

                {/* Nút xác nhận */}
                <button 
                  className="btn btn-danger w-100 rounded-pill py-3 fw-bold shadow-sm d-flex justify-content-center align-items-center"
                  onClick={handlePaymentConfirm}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      ĐANG XỬ LÝ GIAO DỊCH...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle-fill me-2"></i> TÔI ĐÃ CHUYỂN KHOẢN THÀNH CÔNG
                    </>
                  )}
                </button>
                
                <button 
                  className="btn btn-link text-secondary text-decoration-none mt-3 fw-bold small"
                  onClick={() => navigate('/')}
                  disabled={isProcessing}
                >
                  Thanh toán sau (Về trang chủ)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSandbox;