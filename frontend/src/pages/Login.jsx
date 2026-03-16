import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setErrorMessage(''); 
    setIsLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/auth/login', {
        email: email,
        password: password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Thêm hiệu ứng chờ 1 chút cho giống hệ thống thật
      setTimeout(() => {
        setIsLoading(false);
        navigate('/'); 
      }, 800);

    } catch (error) {
      setIsLoading(false);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Không thể kết nối đến máy chủ.');
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      
      {/* CỘT TRÁI: Ảnh nền truyền cảm hứng (Chỉ hiện trên màn hình lớn) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80" 
          alt="Travel Login Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-1000"
        />
        {/* Lớp phủ gradient để chữ dễ đọc hơn */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col justify-end p-16 text-white w-full">
          <h2 className="text-5xl font-extrabold mb-6 leading-tight">
            Bắt đầu <br/> hành trình mới.
          </h2>
          <p className="text-xl text-blue-100 max-w-md leading-relaxed">
            Khám phá hàng ngàn điểm đến tuyệt vời và trải nghiệm dịch vụ đặt tour đẳng cấp cùng TourManager.
          </p>
        </div>
      </div>

      {/* CỘT PHẢI: Form Đăng Nhập */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 sm:p-12 md:p-16">
        <div className="max-w-md w-full">
          
          {/* Nút quay lại */}
          <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-8 transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Quay lại trang chủ
          </Link>

          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Chào mừng trở lại! 👋</h2>
            <p className="text-gray-500">Vui lòng đăng nhập để tiếp tục đặt tour.</p>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-lg mb-6 text-sm flex items-center shadow-sm">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email của bạn</label>
              <input 
                type="email" 
                required
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                placeholder="ví dụ: khachhang@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Mật khẩu</label>
              <input 
                type="password" 
                required
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                  Ghi nhớ tôi
                </label>
              </div>
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline">
                Quên mật khẩu?
              </a>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 shadow-lg flex justify-center items-center ${
                isLoading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30 transform hover:-translate-y-1'
              }`}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : 'Đăng Nhập'}
            </button>
          </form>
          
          <p className="mt-8 text-center text-sm text-gray-600">
            Chưa có tài khoản?{' '}
            <a href="#" className="font-bold text-blue-600 hover:text-blue-500 hover:underline">
              Đăng ký ngay
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;