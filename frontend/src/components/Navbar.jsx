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
      {/* CSS Tùy chỉnh cho Menu và Mega Menu */}
      <style>
        {`
          /* Hiệu ứng cho dropdown chung (Blog, Giới thiệu) */
          .custom-dropdown-item:hover {
            background-color: #f8f9fa !important;
            color: #0dcaf0 !important;
            transition: all 0.2s ease-in-out;
          }
          .custom-dropdown-item:hover .bi-chevron-right {
            color: #0dcaf0 !important;
            transform: translateX(3px);
            transition: transform 0.2s;
          }

          /* --- CSS CHO MEGA MENU TOUR --- */
          .mega-menu-container {
            width: 850px; 
            left: 50% !important;
            transform: translateX(-35%) !important; 
            border-radius: 16px;
            padding: 25px;
          }
          .mega-menu-link {
            color: #495057;
            text-decoration: none;
            padding: 8px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            font-weight: 600;
            transition: color 0.2s;
          }
          .mega-menu-link:hover {
            color: #0dcaf0;
          }
          .mega-menu-link:hover .bi-chevron-right {
            transform: translateX(3px);
            transition: transform 0.2s;
          }
          /* Card Tour Nổi bật trong menu */
          .mega-card {
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #eaeaea;
            transition: transform 0.2s, box-shadow 0.2s;
            cursor: pointer;
          }
          .mega-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 6px 15px rgba(0,0,0,0.1);
            border-color: #0dcaf0;
          }
          .mega-card img {
            height: 110px;
            width: 100%;
            object-fit: cover;
          }
          .mega-card-title {
            font-size: 13px;
            font-weight: 700;
            text-align: center;
            padding: 10px 5px;
            color: #333;
          }
        `}
      </style>

      <div className="container">
        
        {/* LOGO */}
        <Link className="navbar-brand font_DPTBlacksword text-white fs-3" to="/">
          Du lịch Việt
        </Link>
        
        {/* NÚT MOBILE */}
        <button 
          className="navbar-toggler bg-info border-0 shadow-none" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navmenu"
        >
          <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
        </button>

        <div className="collapse navbar-collapse" id="navmenu">
          <ul className="navbar-nav mx-auto text-uppercase fw-bold position-relative">
            <li className="nav-item">
              <Link className="nav-link text-white px-3 hover-info" to="/">TRANG CHỦ</Link>
            </li>
            
            {/* --- DROPDOWN GIỚI THIỆU --- */}
            <li className="nav-item dropdown px-2" 
                onMouseEnter={(e) => e.currentTarget.querySelector('.dropdown-menu').classList.add('show')}
                onMouseLeave={(e) => e.currentTarget.querySelector('.dropdown-menu').classList.remove('show')}
            >
              <Link className="nav-link text-white d-flex align-items-center hover-info" to="/gioi-thieu">
                GIỚI THIỆU <i className="bi bi-chevron-down ms-1" style={{ fontSize: '12px' }}></i>
              </Link>
              
              <ul className="dropdown-menu border-0 shadow-lg mt-0 bg-white" style={{ borderRadius: '12px', padding: '10px 0', textTransform: 'none', minWidth: '240px' }}>
                <li>
                  <Link className="dropdown-item py-2 px-4 text-dark fw-bold d-flex justify-content-between align-items-center custom-dropdown-item" to="/gioi-thieu">
                    <span>Về chúng tôi</span> 
                    <i className="bi bi-chevron-right text-muted" style={{ fontSize: '12px' }}></i>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item py-2 px-4 text-dark fw-bold d-flex justify-content-between align-items-center custom-dropdown-item" to="/chinh-sach" state={{ tab: 'dat-tour' }}>
                    <span>Hướng dẫn đặt tour</span> 
                    <i className="bi bi-chevron-right text-muted" style={{ fontSize: '12px' }}></i>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item py-2 px-4 text-dark fw-bold d-flex justify-content-between align-items-center custom-dropdown-item" to="/chinh-sach" state={{ tab: 'thanh-toan' }}>
                    <span>Hướng dẫn thanh toán</span> 
                    <i className="bi bi-chevron-right text-muted" style={{ fontSize: '12px' }}></i>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item py-2 px-4 text-dark fw-bold d-flex justify-content-between align-items-center custom-dropdown-item" to="/chinh-sach" state={{ tab: 'bao-mat' }}>
                    <span>Chính sách bảo mật</span> 
                    <i className="bi bi-chevron-right text-muted" style={{ fontSize: '12px' }}></i>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item py-2 px-4 text-dark fw-bold d-flex justify-content-between align-items-center custom-dropdown-item" to="/chinh-sach" state={{ tab: 'dieu-khoan' }}>
                    <span>Điều khoản chung</span> 
                    <i className="bi bi-chevron-right text-muted" style={{ fontSize: '12px' }}></i>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item py-2 px-4 text-dark fw-bold d-flex justify-content-between align-items-center custom-dropdown-item" to="/chinh-sach" state={{ tab: 'faq' }}>
                    <span>Câu hỏi thường gặp</span> 
                    <i className="bi bi-chevron-right text-muted" style={{ fontSize: '12px' }}></i>
                  </Link>
                </li>
              </ul>
            </li>

            {/* --- MEGA MENU TOUR --- */}
            <li className="nav-item dropdown px-2"
                onMouseEnter={(e) => e.currentTarget.querySelector('.dropdown-menu').classList.add('show')}
                onMouseLeave={(e) => e.currentTarget.querySelector('.dropdown-menu').classList.remove('show')}
            >
              <Link className="nav-link text-white d-flex align-items-center hover-info" to="/tour-trong-nuoc">
                TOUR DU LỊCH <i className="bi bi-chevron-down ms-1" style={{ fontSize: '12px' }}></i>
              </Link>
              
              <div className="dropdown-menu shadow-lg border-0 bg-white mega-menu-container mt-0" style={{ textTransform: 'none' }}>
                <div className="row g-4">
                  <div className="col-8">
                    <h6 className="text-info fw-bold mb-3" style={{ fontSize: '13px', letterSpacing: '1px' }}>DANH MỤC TOUR</h6>
                    <div className="row">
                      <div className="col-6">
                        <Link className="mega-menu-link" to="/tour-trong-nuoc" state={{ city: 'Hồ Chí Minh' }}>Tour Hồ Chí Minh (TPHCM) <i className="bi bi-chevron-right text-muted" style={{ fontSize: '11px' }}></i></Link>
                        <Link className="mega-menu-link" to="/tour-trong-nuoc" state={{ city: 'Phú Quốc' }}>Tour Đảo Phú Quốc <i className="bi bi-chevron-right text-muted" style={{ fontSize: '11px' }}></i></Link>
                        <Link className="mega-menu-link" to="/tour-trong-nuoc" state={{ city: 'Nha Trang' }}>Tour Nha Trang <i className="bi bi-chevron-right text-muted" style={{ fontSize: '11px' }}></i></Link>
                      </div>
                      <div className="col-6">
                        <Link className="mega-menu-link" to="/tour-trong-nuoc" state={{ city: 'Miền Tây' }}>Tour Miền Tây <i className="bi bi-chevron-right text-muted" style={{ fontSize: '11px' }}></i></Link>
                        <Link className="mega-menu-link" to="/tour-trong-nuoc" state={{ city: 'Đà Lạt' }}>Tour Đà Lạt <i className="bi bi-chevron-right text-muted" style={{ fontSize: '11px' }}></i></Link>
                        <Link className="mega-menu-link" to="/tour-trong-nuoc" state={{ city: 'Đà Nẵng' }}>Tour Đà Nẵng <i className="bi bi-chevron-right text-muted" style={{ fontSize: '11px' }}></i></Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-4 border-start">
                    <h6 className="text-info fw-bold mb-3 ps-2" style={{ fontSize: '13px', letterSpacing: '1px' }}>THEO THỜI LƯỢNG</h6>
                    <div className="ps-2">
                      <Link className="mega-menu-link" to="/tour-trong-nuoc" state={{ duration: '1 Ngày' }}>Tour 1 ngày <i className="bi bi-chevron-right text-muted" style={{ fontSize: '11px' }}></i></Link>
                      <Link className="mega-menu-link" to="/tour-trong-nuoc" state={{ duration: '2 Ngày' }}>Tour 2N1Đ <i className="bi bi-chevron-right text-muted" style={{ fontSize: '11px' }}></i></Link>
                      <Link className="mega-menu-link" to="/tour-trong-nuoc" state={{ duration: '3 Ngày' }}>Tour 3N2Đ <i className="bi bi-chevron-right text-muted" style={{ fontSize: '11px' }}></i></Link>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-top">
                  <h6 className="text-info fw-bold mb-3" style={{ fontSize: '13px', letterSpacing: '1px' }}>NỔI BẬT</h6>
                  <div className="d-flex gap-3">
                    <div className="mega-card flex-fill" onClick={() => navigate('/tour-trong-nuoc', { state: { search: 'Mỹ Tho' } })}>
                      <img src="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=400&q=80" alt="Mỹ Tho" />
                      <div className="mega-card-title">Tour 1 ngày Mỹ Tho</div>
                    </div>
                    <div className="mega-card flex-fill" onClick={() => navigate('/tour-trong-nuoc', { state: { search: 'Bến Tre' } })}>
                      <img src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=400&q=80" alt="Miền Tây" />
                      <div className="mega-card-title">Tour 2 ngày 1 đêm MT</div>
                    </div>
                    <div className="mega-card flex-fill" onClick={() => navigate('/tour-trong-nuoc', { state: { search: 'Cần Giờ' } })}>
                      <img src="https://images.unsplash.com/photo-1542662565-7e4fd1048602?auto=format&fit=crop&w=400&q=80" alt="Cần Giờ" />
                      <div className="mega-card-title">Tour Cần Giờ 1 ngày</div>
                    </div>
                    <div className="mega-card flex-fill" onClick={() => navigate('/tour-trong-nuoc', { state: { search: 'Miền Tây' } })}>
                      <img src="https://images.unsplash.com/photo-1628746355325-2e6d628eb4b4?auto=format&fit=crop&w=400&q=80" alt="Miền Tây 3 ngày" />
                      <div className="mega-card-title">Tour miền tây 3 ngày</div>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            {/* --- NÚT BẢNG GIÁ --- */}
            <li className="nav-item">
              <Link className="nav-link text-white px-3 hover-info" to="/bang-gia">BẢNG GIÁ</Link>
            </li>

            {/* --- DROPDOWN BLOG --- */}
            <li className="nav-item dropdown px-2" 
                onMouseEnter={(e) => e.currentTarget.querySelector('.dropdown-menu').classList.add('show')}
                onMouseLeave={(e) => e.currentTarget.querySelector('.dropdown-menu').classList.remove('show')}
            >
              <Link className="nav-link text-white d-flex align-items-center hover-info" to="/blog">
                BLOG <i className="bi bi-chevron-down ms-1" style={{ fontSize: '12px' }}></i>
              </Link>
              
              <ul className="dropdown-menu border-0 shadow-lg mt-0 bg-white" style={{ borderRadius: '12px', padding: '10px 0', textTransform: 'none', minWidth: '230px' }}>
                <li>
                  <Link className="dropdown-item py-2 px-4 text-dark fw-bold d-flex justify-content-between align-items-center custom-dropdown-item" to="/blog" state={{ category: 'Cẩm Nang Du Lịch' }}>
                    <span>Cẩm Nang Du Lịch</span> 
                    <i className="bi bi-chevron-right text-muted" style={{ fontSize: '12px' }}></i>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item py-2 px-4 text-dark fw-bold d-flex justify-content-between align-items-center custom-dropdown-item" to="/blog" state={{ category: 'Đặc Sản Miền Tây' }}>
                    <span>Đặc Sản Miền Tây</span> 
                    <i className="bi bi-chevron-right text-muted" style={{ fontSize: '12px' }}></i>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item py-2 px-4 text-dark fw-bold d-flex justify-content-between align-items-center custom-dropdown-item" to="/blog" state={{ category: 'Địa Điểm Du Lịch' }}>
                    <span>Địa Điểm Du Lịch</span> 
                    <i className="bi bi-chevron-right text-muted" style={{ fontSize: '12px' }}></i>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item py-2 px-4 text-dark fw-bold d-flex justify-content-between align-items-center custom-dropdown-item" to="/blog" state={{ category: 'Văn Hóa Miền Tây' }}>
                    <span>Văn Hóa Miền Tây</span> 
                    <i className="bi bi-chevron-right text-muted" style={{ fontSize: '12px' }}></i>
                  </Link>
                </li>
              </ul>
            </li>

            {/* --- NÚT LIÊN HỆ --- */}
            <li className="nav-item">
              <Link className="nav-link text-white px-3 hover-info" to="/lien-he">LIÊN HỆ</Link>
            </li>
            
          </ul>
          
          <div className="d-flex align-items-center ms-lg-3">
            
            {/* --- NÚT TRA CỨU ĐƠN HÀNG THÊM MỚI Ở ĐÂY --- */}
            <Link className="btn btn-outline-info fw-bold rounded-pill px-3 me-3" to="/tra-cuu" style={{ borderWidth: '2px' }}>
              <i className="bi bi-search me-1"></i> Tra cứu
            </Link>

            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-info text-white rounded-pill dropdown-toggle fw-bold"
                  type="button"
                  onClick={() => setIsDropdownOpen((v) => !v)}
                  aria-expanded={isDropdownOpen}
                >
                  Chào, {user.name.split(' ').pop()}
                </button>
                <ul className={`dropdown-menu dropdown-menu-end shadow ${isDropdownOpen ? 'show' : ''}`} style={{ borderRadius: '12px' }}>
                  {user.role === 'admin' && (
                    <li>
                      <Link className="dropdown-item fw-bold text-primary py-2" to="/admin" onClick={() => setIsDropdownOpen(false)}>
                        <i className="bi bi-speedometer2 me-2"></i>Quản trị viên
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      className="dropdown-item fw-bold py-2"
                      to="/tai-khoan"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Hồ sơ
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button
                      className="dropdown-item fw-bold text-danger py-2"
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