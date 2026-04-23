import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function PaymentResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const updatePaymentStatus = async () => {
      const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
      const bookingId = searchParams.get('vnp_TxnRef');

      if (vnp_ResponseCode === '00') {
        try {
          await axios.post('http://127.0.0.1:5000/api/payment/update-status', {
            bookingId,
            vnp_ResponseCode
          });
          setStatus('success');
        } catch (error) {
          setStatus('error');
        }
      } else {
        setStatus('error');
      }
    };

    if (searchParams.get('vnp_ResponseCode')) {
      updatePaymentStatus();
    }
  }, [searchParams]);

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card border-0 shadow-lg p-5 text-center rounded-4" style={{maxWidth: '500px', width: '90%'}}>
        {status === 'processing' && (
          <>
            <div className="spinner-border text-info mb-4" style={{width: '3rem', height: '3rem'}}></div>
            <h4 className="fw-bold">Đang xử lý thanh toán...</h4>
            <p className="text-muted">Hệ thống đang đồng bộ dữ liệu với ngân hàng...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <i className="bi bi-check-circle-fill text-success" style={{fontSize: '5rem'}}></i>
            <h3 className="fw-bold mt-3 text-success">Thanh Toán Thành Công!</h3>
            <p className="text-muted">Đơn hàng của bạn đã được xác nhận và thanh toán qua VNPAY.</p>
            <Link to="/tai-khoan" className="btn btn-info text-white rounded-pill px-5 py-2 mt-3 fw-bold shadow-sm">Xem lịch sử đặt tour</Link>
          </>
        )}
        
        {status === 'error' && (
          <>
            <i className="bi bi-x-circle-fill text-danger" style={{fontSize: '5rem'}}></i>
            <h3 className="fw-bold mt-3 text-danger">Thanh Toán Thất Bại</h3>
            <p className="text-muted">Giao dịch đã bị hủy hoặc có lỗi xảy ra.</p>
            <button onClick={() => navigate('/')} className="btn btn-outline-secondary rounded-pill px-5 py-2 mt-3 fw-bold">Về trang chủ</button>
          </>
        )}
      </div>
    </div>
  );
}

export default PaymentResult;