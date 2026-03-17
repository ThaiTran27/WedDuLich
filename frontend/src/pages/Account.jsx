import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Account() {
  const navigate = useNavigate();
  // State để chuyển đổi qua lại giữa các tab (Mặc định là xem thông tin)
  const [activeTab, setActiveTab] = useState('profile'); 
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy thông tin user từ LocalStorage và lấy lịch sử đặt tour từ Backend
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      alert('Vui lòng đăng nhập để xem thông tin!');
      navigate('/login');
      return;
    }
    
    const userData = JSON.parse(userString);
    setUser(userData);

    // Gọi API lấy lịch sử đặt tour
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/bookings');
        // Lọc ra những đơn hàng của user đang đăng nhập
        const myBookings = response.data.data.filter(b => b.userId?._id === userData._id);
        setBookings(myBookings);
      } catch (error) {
        console.error('Lỗi khi tải lịch sử:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  // Hàm xử lý Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    alert('Đăng xuất thành công!');
    navigate('/login');
  };

  if (!user) return null; // Đợi load user

  return (
    <main className="content bg-light pb-5" style={{ minHeight: '80vh', paddingTop: '100px' }}>
      <div className="container pt-4">
        <div className="row">
          
          {/* CỘT TRÁI: MENU TÀI KHOẢN */}
          <div className="col-md-3 mb-4 card_taikhoan">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  {/* Thông tin hiển thị */}
                  <div className="list-group-item bg-info text-white text-center py-4">
                    <img 
                      src="/assets/img/index/about.png" 
                      alt="Ảnh đại diện" 
                      className="rounded-circle border border-3 border-white shadow-sm mb-2 object-fit-cover" 
                      width="80px" height="80px" 
                    />
                    <h5 className="fw-bold mb-0">{user.name || 'Thành viên mới'}</h5>
                    <small>{user.email}</small>
                  </div>
                  
                  {/* Các nút chuyển Tab */}
                  <button 
                    className={`list-group-item list-group-item-action py-3 fw-bold ${activeTab === 'profile' ? 'text-info bg-light' : ''}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    <i className="bi bi-person-lines-fill me-2"></i> Thông tin cá nhân
                  </button>
                  <button 
                    className={`list-group-item list-group-item-action py-3 fw-bold ${activeTab === 'password' ? 'text-info bg-light' : ''}`}
                    onClick={() => setActiveTab('password')}
                  >
                    <i className="bi bi-shield-lock-fill me-2"></i> Đổi mật khẩu
                  </button>
                  <button 
                    className={`list-group-item list-group-item-action py-3 fw-bold ${activeTab === 'history' ? 'text-info bg-light' : ''}`}
                    onClick={() => setActiveTab('history')}
                  >
                    <i className="bi bi-clock-history me-2"></i> Lịch sử đặt tour
                  </button>
                  <button 
                    className="list-group-item list-group-item-action py-3 fw-bold text-danger"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i> Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: NỘI DUNG TƯƠNG ỨNG VỚI TAB */}
          <div className="col-md-9 card_thongtin">
            
            {/* TAB 1: THÔNG TIN CÁ NHÂN */}
            {activeTab === 'profile' && (
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-header bg-dark text-white rounded-top-4 py-3">
                  <h5 className="text-center mb-0 fw-bold">Thông tin cá nhân</h5>
                </div>
                <div className="card-body p-4">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold text-secondary">Họ và tên</label>
                        <input type="text" className="form-control rounded-pill px-3" defaultValue={user.name} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold text-secondary">Email</label>
                        <input type="email" className="form-control rounded-pill px-3 bg-light" defaultValue={user.email} readOnly />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold text-secondary">Số điện thoại</label>
                        <input type="text" className="form-control rounded-pill px-3" placeholder="Chưa cập nhật" />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold text-secondary">Địa chỉ</label>
                        <input type="text" className="form-control rounded-pill px-3" placeholder="Chưa cập nhật" />
                      </div>
                    </div>
                    <div className="text-end mt-3">
                      <button className="btn btn-info text-white rounded-pill px-4 fw-bold shadow-sm">Cập nhật thông tin</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 2: ĐỔI MẬT KHẨU */}
            {activeTab === 'password' && (
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-header bg-dark text-white rounded-top-4 py-3">
                  <h5 className="text-center mb-0 fw-bold">Đổi mật khẩu</h5>
                </div>
                <div className="card-body p-4">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-3">
                      <label className="form-label fw-bold text-secondary">Mật khẩu cũ</label>
                      <input type="password" className="form-control rounded-pill px-3" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold text-secondary">Mật khẩu mới</label>
                      <input type="password" className="form-control rounded-pill px-3" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold text-secondary">Nhập lại mật khẩu mới</label>
                      <input type="password" className="form-control rounded-pill px-3" />
                    </div>
                    <div className="text-end mt-4">
                      <button className="btn btn-info text-white rounded-pill px-4 fw-bold shadow-sm">Đổi mật khẩu</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 3: LỊCH SỬ ĐẶT TOUR */}
            {activeTab === 'history' && (
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-header bg-dark text-white rounded-top-4 py-3">
                  <h5 className="text-center mb-0 fw-bold">Lịch sử đặt tour</h5>
                </div>
                <div className="card-body p-4">
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-info" role="status"></div>
                      <p className="text-muted mt-2">Đang tải dữ liệu...</p>
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="bi bi-journal-x text-muted" style={{ fontSize: '4rem' }}></i>
                      <p className="mt-3 text-secondary fs-5">Lịch sử rỗng</p>
                      <Link to="/" className="btn btn-outline-info rounded-pill mt-2 fw-bold">Đặt tour ngay</Link>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle">
                        <thead className="table-light">
                          <tr>
                            <th scope="col">Mã Đơn</th>
                            <th scope="col">Tên Tour</th>
                            <th scope="col">Số khách</th>
                            <th scope="col">Tổng Tiền</th>
                            <th scope="col">Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map((booking) => (
                            <tr key={booking._id}>
                              <td className="fw-bold text-secondary">#{booking._id.slice(-6).toUpperCase()}</td>
                              <td className="text-info fw-bold">{booking.tourId?.title || 'Tour đã bị xóa'}</td>
                              <td>{booking.guestSize || 1} người</td>
                              <td className="text-danger fw-bold">{booking.totalPrice.toLocaleString('vi-VN')} ₫</td>
                              <td>
                                {booking.status === 'paid' 
                                  ? <span className="badge bg-success rounded-pill px-3 py-2 shadow-sm">Đã thanh toán</span> 
                                  : <span className="badge bg-warning text-dark rounded-pill px-3 py-2 shadow-sm">Chờ xử lý</span>
                                }
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}

export default Account;