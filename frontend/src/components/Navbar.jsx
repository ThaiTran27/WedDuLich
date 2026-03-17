import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Kiểm tra trạng thái đăng nhập mỗi khi Navbar được load hoặc có sự thay đổi trang
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      setUser(JSON.parse(userString));
    } else {
      setUser(null);
    }
  }, []); // Chạy 1 lần khi load trang

  // Hàm Đăng xuất nhanh
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    alert('Đã đăng xuất!');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top bg-dark bg-opacity-75 shadow-sm" style={{ zIndex: 1100 }}>
      <div className="container-lg container-fluid">
        
        {/* Logo */}
        <Link className="navbar-brand font_DPTBlacksword mx-lg-3 mx-0 text-white fs-3 p-0" to="/">
          Du lịch Việt
        </Link>
        
        <div id="navmenu" className="collapse navbar-collapse justify-content-around">
          <ul className="navbar-nav text-uppercase fw-bold">
            <li className="nav-item mx-2">
              <Link className="nav-link text-white hover-info" to="/">Trang chủ</Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link text-white hover-info" to="/gioi-thieu">Giới thiệu</Link>
            </li>
            
            {/* Dropdown Tour */}
            <li className="nav-item mx-2 dropdown">
              <Link className="nav-link dropdown-toggle text-white" role="button" data-bs-toggle="dropdown" to="#">
                Tour
              </Link>
              <ul className="dropdown-menu shadow border-0 mt-2">
                <li><Link className="dropdown-item fw-bold" to="/tour-trong-nuoc">Trong nước</Link></li>
                <li><Link className="dropdown-item fw-bold" to="/tour-quoc-te">Quốc tế</Link></li>
              </ul>
            </li>
            
            <li className="nav-item mx-2">
              <Link className="nav-link text-white hover-info" to="/blog">Blog</Link>
            </li>
          </ul>
          
          <div className="d-flex align-items-center gap-3">
            {user ? (
              /* ============================================================ */
              /* HIỂN THỊ KHI ĐÃ ĐĂNG NHẬP: XIN CHÀO + TÊN                    */
              /* ============================================================ */
              <div className="dropdown">
                <button 
                  className="btn btn-outline-info text-white rounded-pill px-3 py-2 fw-bold dropdown-toggle border-2"
                  type="button" 
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle me-2"></i>
                  Chào, {user.name.split(' ').pop()} {/* Chỉ lấy cái tên cuối cho gọn, ví dụ: "Thái" */}
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-3 animate slideIn">
                  <li><Link className="dropdown-item py-2 fw-bold" to="/tai-khoan"><i className="bi bi-person-vcard me-2"></i>Hồ sơ cá nhân</Link></li>
                  {user.role === 'admin' && (
                    <li><Link className="dropdown-item py-2 fw-bold text-primary" to="/admin"><i className="bi bi-speedometer2 me-2"></i>Quản trị viên</Link></li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item py-2 fw-bold text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Đăng xuất
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              /* ============================================================ */
              /* HIỂN THỊ KHI CHƯA ĐĂNG NHẬP: NÚT ĐĂNG NHẬP                   */
              /* ============================================================ */
              <Link id="btn_dangnhap" className="btn btn-info text-white fw-bold rounded-pill px-4 py-2 shadow-sm hover-scale" to="/login">
                <i className="bi bi-door-open me-2"></i>ĐĂNG NHẬP
              </Link>
            )}
          </div>
        </div>
        
        {/* Nút Hamburger Mobile */}
        <button className="navbar-toggler bg-info border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navmenu">
            <i className="bi bi-list text-white fs-1"></i>
        </button>

      </div>
    </nav>
  );
}

export default Navbar;