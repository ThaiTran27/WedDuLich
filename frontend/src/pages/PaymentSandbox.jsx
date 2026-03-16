import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

function PaymentSandbox() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Gọi API cập nhật trạng thái thanh toán
      await axios.put(`http://127.0.0.1:5000/api/bookings/${bookingId}/pay`);
      
      // Giả lập thời gian load của ngân hàng (2 giây)
      setTimeout(() => {
        alert('✅ Thanh toán thành công! Chúc bạn có một chuyến đi vui vẻ!');
        navigate('/'); // Đưa khách về trang chủ
      }, 2000);

    } catch (error) {
      console.error('Lỗi thanh toán:', error);
      alert('Thanh toán thất bại!');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Cổng thanh toán */}
        <div className="bg-blue-800 p-6 text-center">
          <h2 className="text-2xl font-bold text-white tracking-widest">SANDBOX PAYMENT</h2>
          <p className="text-blue-200 text-sm mt-1">Môi trường thử nghiệm thanh toán</p>
        </div>

        <div className="p-8">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
            <p className="font-bold">Lưu ý:</p>
            <p className="text-sm">Đây là cổng thanh toán giả lập. Sẽ không có giao dịch tiền thật nào diễn ra.</p>
          </div>

          <p className="text-gray-600 mb-2">Mã đơn hàng:</p>
          <p className="font-mono text-lg font-bold text-gray-800 mb-6 bg-gray-100 p-3 rounded">{bookingId}</p>

          <button 
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full font-bold py-4 px-6 rounded-xl text-lg transition duration-300 shadow-md ${
              isProcessing 
                ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
                : 'bg-green-500 hover:bg-green-600 text-white transform hover:-translate-y-1'
            }`}
          >
            {isProcessing ? 'Đang xử lý giao dịch...' : 'Xác Nhận Thanh Toán'}
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full mt-4 bg-transparent text-gray-500 font-semibold py-2 px-4 hover:text-red-500 transition"
          >
            Hủy giao dịch & Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSandbox;