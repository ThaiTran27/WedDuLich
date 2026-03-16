import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 text-white p-2 rounded-lg group-hover:bg-orange-500 transition-colors duration-300">
              {/* Icon máy bay đơn giản bằng SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Tour<span className="text-blue-600">Manager</span>
            </span>
          </Link>

          {/* Menu Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-semibold transition-colors">
              Khám Phá
            </Link>
            <Link to="/admin" className="text-gray-600 hover:text-blue-600 font-semibold transition-colors">
              Quản Trị
            </Link>
            
            {/* Nút Đăng nhập bo góc tròn */}
            <Link 
              to="/login" 
              className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Đăng Nhập
            </Link>
          </div>
          
        </div>
      </div>
    </nav>
  );
}

export default Navbar;