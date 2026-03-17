import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      setUser(JSON.parse(userString));
    }
  }, []);

  useEffect(() => {
    // Close dropdown when user logs out so it doesn't stay open
    if (!user) {
      setIsDropdownOpen(false);
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsDropdownOpen(false);
    alert('Đã đăng xuất!');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top bg-dark shadow py-3">
      <div className="container">
        
        {/* LOGO BÊN TRÁI */}
        <Link className="navbar-brand font_DPTBlacksword text-white fs-3" to="/">
          Du lịch Việt
        </Link>
        
        {/* NÚT MOBILE (Cho điện thoại) */}
        <button 
          className="navbar-toggler bg-info border-0 shadow-none" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navmenu"
        >
          <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
        </button>

        {/* PHẦN CHỮ ĐỂ CLICK (Sẽ hiện trên máy tính) */}
        <div className="collapse navbar-collapse" id="navmenu">
          <ul className="navbar-nav mx-auto text-uppercase fw-bold">
            <li className="nav-item">
              <Link className="nav-link text-white px-3 hover-info" to="/">Trang chủ</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white px-3 hover-info" to="/gioi-thieu">Giới thiệu</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white px-3 hover-info" to="/tour-trong-nuoc">Tour</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white px-3 hover-info" to="/blog">Blog</Link>
            </li>
          </ul>
          
          <div className="d-flex align-items-center">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-info text-white rounded-pill dropdown-toggle fw-bold"
                  type="button"
                  onClick={() => setIsDropdownOpen((v) => !v)}
                  aria-expanded={isDropdownOpen}
                >
                  Chào, {user.name.split(' ').pop()}
                </button>
                <ul className={`dropdown-menu dropdown-menu-end shadow ${isDropdownOpen ? 'show' : ''}`}>
                  <li>
                    <Link
                      className="dropdown-item fw-bold"
                      to="/tai-khoan"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Hồ sơ
                    </Link>
                  </li>
                  <li>
                    <button
                      className="dropdown-item fw-bold text-danger"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link className="btn btn-info text-white fw-bold rounded-pill px-4" to="/login">
                ĐĂNG NHẬP
              </Link>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;