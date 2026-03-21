import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { resolveImageUrl } from '../../public/assets/img/index/imagePath';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]); // THÊM MỚI
  const [reviews, setReviews] = useState([]); // THÊM MỚI
  const [loading, setLoading] = useState(true);
  
  const [filterType, setFilterType] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState('');

  // Form Tour
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    _id: '', title: '', city: '', price: '', duration: '', image: '', description: '', availableSeats: 20, startDate: '', endDate: '', category: '', featured: false
  });

  // Form Blog
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [blogFormData, setBlogFormData] = useState({ _id: '', title: '', content: '', image: '', category: 'Cẩm Nang Du Lịch', featured: false });

  const [selectedBooking, setSelectedBooking] = useState(null);

  // Form User
  const [showUserForm, setShowUserForm] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [userFormData, setUserFormData] = useState({ _id: '', name: '', email: '', phone: '', password: '', role: 'user' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tourRes, bookRes, userRes, blogRes, reviewRes] = await Promise.all([
        axios.get('http://127.0.0.1:5000/api/tours'),
        axios.get('http://127.0.0.1:5000/api/bookings'),
        axios.get('http://127.0.0.1:5000/api/auth/users').catch(() => ({ data: { success: true, data: [] } })),
        axios.get('http://127.0.0.1:5000/api/blogs'),
        axios.get('http://127.0.0.1:5000/api/reviews/all').catch(() => ({ data: { success: true, data: [] } })) // Giả sử có route lấy hết review
      ]);

      setTours(tourRes.data.success ? tourRes.data.data : (tourRes.data || []));
      setBookings(bookRes.data.success ? bookRes.data.data : (bookRes.data || []));
      setUsers(userRes.data.success ? userRes.data.data : (userRes.data || []));
      setBlogs(blogRes.data.success ? blogRes.data.data : []);
      // Nếu chưa có route /all review, bạn có thể tạm để mảng rỗng
      setReviews(reviewRes.data?.data || []);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC LỌC DỮ LIỆU ---
  const filteredBookings = useMemo(() => {
    const today = new Date();
    return bookings.filter(b => {
      const bDate = new Date(b.createdAt);
      const matchesFilter = filterType === 'day' ? bDate.toDateString() === today.toDateString() :
                            filterType === 'month' ? (bDate.getMonth() === today.getMonth() && bDate.getFullYear() === today.getFullYear()) : true;
      const matchesSearch = b._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            b.tourId?.title?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [bookings, filterType, searchTerm]);

  const filteredTours = useMemo(() => {
    return tours.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             t.city.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [tours, searchTerm]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [blogs, searchTerm]);

  const stats = useMemo(() => {
    const paid = bookings.filter(b => b.status === 'paid');
    const totalRevenue = paid.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    return { totalRevenue, bookingTotal: bookings.length, tourCount: tours.length, userCount: users.length, blogCount: blogs.length };
  }, [bookings, tours, users, blogs]);

  // --- XỬ LÝ BLOG ---
  const handleBlogInputChange = (e) => setBlogFormData({...blogFormData, [e.target.name]: e.target.value});
  
  const handleSubmitBlog = async (e) => {
    e.preventDefault();
    try {
      if (isEditingBlog) await axios.put(`http://127.0.0.1:5000/api/blogs/${blogFormData._id}`, blogFormData);
      else await axios.post('http://127.0.0.1:5000/api/blogs', blogFormData);
      alert('Lưu bài viết thành công!');
      setShowBlogForm(false); setIsEditingBlog(false); fetchData();
    } catch (error) { alert('Lỗi khi lưu Blog'); }
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm('Xóa bài viết này?')) {
      await axios.delete(`http://127.0.0.1:5000/api/blogs/${id}`);
      fetchData();
    }
  };

  // --- XỬ LÝ REVIEW ---
  const handleDeleteReview = async (id) => {
    if (window.confirm('Xóa bình luận này?')) {
      await axios.delete(`http://127.0.0.1:5000/api/reviews/${id}`);
      fetchData();
    }
  };

  // --- CÁC HÀM CŨ (GIỮ NGUYÊN) ---
  const handleUpdateStatus = async (id, newStatus) => {
    if (window.confirm(`Xác nhận chuyển trạng thái sang: ${newStatus === 'paid' ? 'Đã thanh toán' : 'Đã hủy'}?`)) {
      try {
        await axios.put(`http://127.0.0.1:5000/api/bookings/${id}`, { status: newStatus });
        alert('Cập nhật trạng thái thành công!');
        fetchData();
        setSelectedBooking(null);
      } catch (error) { alert('Lỗi cập nhật trạng thái!'); }
    }
  };

  const handleDeleteTour = async (id) => {
    if (window.confirm('Xóa tour này?')) {
      await axios.delete(`http://127.0.0.1:5000/api/tours/${id}`);
      fetchData();
    }
  };

  const handleToggleFeatured = async (id, currentStatus) => {
    try {
      await axios.put(`http://127.0.0.1:5000/api/tours/${id}`, { featured: !currentStatus });
      fetchData(); 
    } catch (error) { alert('Lỗi cập nhật trạng thái nổi bật!'); }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ _id: '', title: '', city: '', price: '', duration: '', image: '', description: '', availableSeats: 20, startDate: '', endDate: '', category: '', featured: false });
    setIsEditing(false); setShowForm(false);
  };

  const handleEditClick = (tour) => {
    setFormData({...tour}); setIsEditing(true); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitTour = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) await axios.put(`http://127.0.0.1:5000/api/tours/${formData._id}`, formData);
      else await axios.post('http://127.0.0.1:5000/api/tours', formData);
      resetForm(); fetchData(); alert('Thành công!');
    } catch (error) { alert('Lỗi khi lưu!'); }
  };

  const handleUserInputChange = (e) => setUserFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const resetUserForm = () => { setUserFormData({ _id: '', name: '', email: '', phone: '', password: '', role: 'user' }); setIsEditingUser(false); setShowUserForm(false); };
  const handleEditUserClick = (user) => { setUserFormData({ _id: user._id, name: user.name, email: user.email, phone: user.phone || '', password: '', role: user.role || 'user' }); setIsEditingUser(true); setShowUserForm(true); };
  const handleDeleteUser = async (id) => { if (window.confirm('Chắc chắn xóa người dùng này?')) { try { await axios.delete(`http://127.0.0.1:5000/api/auth/users/${id}`); fetchData(); } catch (e) { alert('Lỗi xóa user!'); } } };
  const handleSubmitUser = async (e) => {
    e.preventDefault();
    try {
      if (isEditingUser) await axios.put(`http://127.0.0.1:5000/api/auth/users/${userFormData._id}`, userFormData);
      else await axios.post('http://127.0.0.1:5000/api/auth/register', userFormData);
      resetUserForm(); fetchData(); alert('Lưu thành công!');
    } catch (error) { alert(error.response?.data?.message || 'Lỗi lưu user!'); }
  };

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><div className="spinner-border text-info"></div></div>;

  return (
    <div className="bg-light pb-5" style={{ paddingTop: '90px', minHeight: '100vh', position: 'relative' }}>
      <style>{`
        .rev-card { border-radius: 12px; border: none; transition: 0.3s; color: white; height: 100%; } .rev-card-blue { background: #1a73e8; } .rev-card-grey { background: #f8f9fa; color: #333; border: 1px solid #e0e0e0 !important; } .rev-card-teal { background: #4db6ac; } .rev-card-white { background: #ffffff; color: #333; border: 1px solid #e0e0e0 !important; } .stat-label { font-size: 0.85rem; opacity: 0.9; font-weight: 500; display: flex; align-items: center; gap: 8px; } .stat-value { font-size: 1.6rem; font-weight: 700; margin: 10px 0; }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1050; display: flex; justify-content: center; align-items: center; } .modal-box { background: white; border-radius: 16px; width: 90%; max-width: 500px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2); animation: scaleIn 0.3s ease; } @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
      
      <div className="container-fluid px-4 mt-4">
        <div className="row g-4">
          
          {/* SIDEBAR NÂNG CẤP */}
          <div className="col-12 col-lg-3 col-xl-2">
            <div className="bg-dark text-white rounded-4 shadow-sm overflow-hidden sticky-top" style={{top: '100px'}}>
              <div className="p-4 text-center border-bottom border-secondary">
                <div className="bg-info rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{width:'50px', height:'50px'}}><i className="bi bi-shield-lock-fill fs-3 text-white"></i></div>
                <h6 className="fw-bold mb-0 small">HỆ THỐNG QUẢN TRỊ</h6>
              </div>
              <div className="py-2">
                {[
                  { id: 'overview', icon: 'speedometer2', label: 'Tổng quan' }, 
                  { id: 'tours', icon: 'map', label: 'Quản lý Tour' }, 
                  { id: 'blogs', icon: 'journal-text', label: 'Quản lý Blog' }, // MỚI
                  { id: 'bookings', icon: 'receipt', label: 'Đơn hàng' }, 
                  { id: 'reviews', icon: 'star-half', label: 'Bình luận' }, // MỚI
                  { id: 'users', icon: 'people', label: 'Người dùng' }, 
                  { id: 'revenue', icon: 'graph-up-arrow', label: 'Doanh thu' }
                ].map(item => (
                  <div key={item.id} className={`p-3 cursor-pointer ${activeTab === item.id ? 'bg-info text-white' : ''}`} onClick={() => {setActiveTab(item.id); setSearchTerm('');}} style={{cursor: 'pointer'}}>
                    <i className={`bi bi-${item.icon} me-2`}></i> {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-9 col-xl-10">
            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="animation-fade-in">
                <h4 className="fw-bold mb-4">Chào Thái, hệ thống hôm nay thế nào?</h4>
                <div className="row g-4">
                  {[{ label: 'Tổng số Tour', val: stats.tourCount, icon: 'map', color: 'primary' }, { label: 'Bài viết Blog', val: stats.blogCount, icon: 'journal-text', color: 'info' }, { label: 'Đơn đặt tour', val: stats.bookingTotal, icon: 'cart-check', color: 'success' }, { label: 'Thành viên', val: stats.userCount, icon: 'people', color: 'warning' }].map((item, idx) => (
                    <div className="col-md-3" key={idx}>
                      <div className={`card border-0 shadow-sm rounded-4 p-4 bg-${item.color} text-white position-relative`}>
                        <small className="opacity-75">{item.label}</small>
                        <h2 className="fw-bold mb-0 mt-2">{item.val}</h2>
                        <i className={`bi bi-${item.icon} position-absolute end-0 bottom-0 p-3 opacity-25 fs-1`}></i>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* QUẢN LÝ TOUR (Giữ nguyên logic cũ của bạn) */}
            {activeTab === 'tours' && (
              <div className="animation-fade-in">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold">Danh sách Tour</h4>
                  <button className="btn btn-info text-white rounded-pill px-4" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Đóng form' : '+ Thêm mới'}
                  </button>
                </div>
                {/* ... Form Tour của bạn ... */}
                {/* [Đoạn table tour của bạn giữ nguyên ở đây] */}
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <table className="table table-hover align-middle">
                    <thead className="table-light"><tr><th>ẢNH</th><th>TÊN TOUR</th><th>GIÁ</th><th className="text-center">HÀNH ĐỘNG</th></tr></thead>
                    <tbody>
                      {filteredTours.map(t => (
                        <tr key={t._id}>
                          <td><img src={resolveImageUrl(t.image)} className="rounded" style={{width:'50px', height:'35px', objectFit:'cover'}} /></td>
                          <td className="fw-bold">{t.title}</td>
                          <td className="text-danger">{t.price?.toLocaleString()}đ</td>
                          <td className="text-center">
                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditClick(t)}><i className="bi bi-pencil"></i></button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteTour(t._id)}><i className="bi bi-trash"></i></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* QUẢN LÝ BLOG (MỚI) */}
            {activeTab === 'blogs' && (
              <div className="animation-fade-in">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold">Quản lý bài viết Blog</h4>
                  <button className="btn btn-info text-white rounded-pill px-4" onClick={() => {setShowBlogForm(!showBlogForm); setIsEditingBlog(false); setBlogFormData({title:'', content:'', image:'', category:'Cẩm Nang Du Lịch', featured:false})}}>
                    {showBlogForm ? 'Đóng' : '+ Viết bài mới'}
                  </button>
                </div>
                {showBlogForm && (
                  <div className="card border-0 shadow-sm p-4 mb-4 rounded-4 border-top border-info border-4">
                    <form onSubmit={handleSubmitBlog}>
                      <div className="row g-3">
                        <div className="col-md-8"><label className="small fw-bold">Tiêu đề bài viết</label><input type="text" className="form-control" name="title" value={blogFormData.title} onChange={handleBlogInputChange} required /></div>
                        <div className="col-md-4"><label className="small fw-bold">Danh mục</label><select className="form-select" name="category" value={blogFormData.category} onChange={handleBlogInputChange}><option value="Cẩm Nang Du Lịch">Cẩm Nang Du Lịch</option><option value="Kinh nghiệm">Kinh nghiệm</option><option value="Tin tức">Tin tức</option></select></div>
                        <div className="col-md-12"><label className="small fw-bold">Link ảnh bìa</label><input type="text" className="form-control" name="image" value={blogFormData.image} onChange={handleBlogInputChange} placeholder="/assets/img/index/ten-anh.jpg" required /></div>
                        <div className="col-12"><label className="small fw-bold">Nội dung bài viết</label><textarea className="form-control" name="content" rows="5" value={blogFormData.content} onChange={handleBlogInputChange} required></textarea></div>
                      </div>
                      <button type="submit" className="btn btn-info text-white w-100 mt-3 rounded-pill fw-bold">ĐĂNG BÀI</button>
                    </form>
                  </div>
                )}
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <table className="table table-hover align-middle">
                    <thead className="table-light"><tr><th>ẢNH</th><th>TIÊU ĐỀ</th><th>DANH MỤC</th><th>NGÀY ĐĂNG</th><th className="text-center">HÀNH ĐỘNG</th></tr></thead>
                    <tbody>
                      {filteredBlogs.map(b => (
                        <tr key={b._id}>
                          <td><img src={b.image} className="rounded" style={{width:'50px', height:'35px', objectFit:'cover'}} /></td>
                          <td className="fw-bold text-truncate" style={{maxWidth:'300px'}}>{b.title}</td>
                          <td><span className="badge bg-light text-dark">{b.category}</span></td>
                          <td>{new Date(b.createdAt).toLocaleDateString('vi-VN')}</td>
                          <td className="text-center">
                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => {setBlogFormData(b); setIsEditingBlog(true); setShowBlogForm(true);}}><i className="bi bi-pencil"></i></button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteBlog(b._id)}><i className="bi bi-trash"></i></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* QUẢN LÝ BÌNH LUẬN (MỚI) */}
            {activeTab === 'reviews' && (
              <div className="animation-fade-in card border-0 shadow-sm rounded-4 p-4">
                <h4 className="fw-bold mb-4">Quản lý Đánh giá & Bình luận</h4>
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light"><tr><th>KHÁCH HÀNG</th><th>TOUR</th><th>SAO</th><th>NỘI DUNG</th><th>NGÀY</th><th className="text-center">HÀNH ĐỘNG</th></tr></thead>
                    <tbody>
                      {reviews.map(r => (
                        <tr key={r._id}>
                          <td><strong>{r.userId?.name}</strong></td>
                          <td className="small">{r.tourId?.title}</td>
                          <td><span className="text-warning fw-bold">{r.rating} <i className="bi bi-star-fill"></i></span></td>
                          <td className="small text-muted">{r.comment}</td>
                          <td style={{fontSize:'12px'}}>{new Date(r.createdAt).toLocaleDateString('vi-VN')}</td>
                          <td className="text-center">
                            <button className="btn btn-sm btn-danger rounded-pill" onClick={() => handleDeleteReview(r._id)}><i className="bi bi-trash"></i> Xóa</button>
                          </td>
                        </tr>
                      ))}
                      {reviews.length === 0 && <tr><td colSpan="6" className="text-center py-4 text-muted">Chưa có bình luận nào để quản lý.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* BOOKINGS, USERS, REVENUE (GIỮ NGUYÊN CODE CŨ CỦA BẠN...) */}
            {activeTab === 'bookings' && (
              <div className="animation-fade-in card border-0 shadow-sm rounded-4 p-4 overflow-hidden">
                <h4 className="fw-bold mb-4">Lịch sử đặt tour</h4>
                {/* ... giữ nguyên phần table bookings bạn đã gửi ... */}
                <div className="table-responsive"><table className="table table-hover align-middle small"><thead className="table-light text-muted"><tr><th>MÃ ĐƠN</th><th>THỜI GIAN</th><th>TOUR</th><th>TIỀN</th><th>TRẠNG THÁI</th><th className="text-center">XỬ LÝ</th></tr></thead><tbody>{filteredBookings.map(b => (<tr key={b._id}><td className="fw-bold">#{b._id.substring(18).toUpperCase()}</td><td><div className="fw-bold">{new Date(b.createdAt).toLocaleDateString('vi-VN')}</div><div className="text-muted" style={{fontSize: '11px'}}>{new Date(b.createdAt).toLocaleTimeString('vi-VN')}</div></td><td className="text-truncate" style={{maxWidth: '180px'}}>{b.tourId?.title}</td><td className="fw-bold text-primary">{b.totalPrice?.toLocaleString()}đ</td><td><span className={`badge rounded-pill ${b.status === 'paid' ? 'bg-success' : b.status === 'cancelled' ? 'bg-danger' : 'bg-warning text-dark'}`}>{b.status === 'paid' ? 'Thành công' : b.status === 'cancelled' ? 'Đã hủy' : 'Chờ duyệt'}</span></td><td className="text-center"><div className="d-flex justify-content-center gap-1">{b.status !== 'paid' && b.status !== 'cancelled' && (<><button className="btn btn-sm btn-success rounded-pill" onClick={() => handleUpdateStatus(b._id, 'paid')}><i className="bi bi-check-lg"></i></button><button className="btn btn-sm btn-danger rounded-pill" onClick={() => handleUpdateStatus(b._id, 'cancelled')}><i className="bi bi-x-lg"></i></button></>)}<button className="btn btn-sm btn-info text-white rounded-pill" onClick={() => setSelectedBooking(b)}><i className="bi bi-eye"></i></button></div></td></tr>))}</tbody></table></div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="animation-fade-in card border-0 shadow-sm rounded-4 p-4 overflow-hidden">
                <h4 className="fw-bold mb-4">Danh sách thành viên</h4>
                {/* ... giữ nguyên phần table users của bạn ... */}
                <table className="table table-hover align-middle"><thead className="table-light small"><tr><th>STT</th><th>HỌ TÊN</th><th>EMAIL</th><th>SĐT</th><th>QUYỀN</th><th className="text-center">THAO TÁC</th></tr></thead><tbody>{filteredUsers.map((u, i) => (<tr key={u._id}><td className="text-muted">{i + 1}</td><td className="fw-bold">{u.name}</td><td className="small">{u.email}</td><td className="small">{u.phone || 'N/A'}</td><td><span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>{u.role === 'admin' ? 'Admin' : 'User'}</span></td><td className="text-center"><button className="btn btn-sm btn-outline-primary me-2 rounded-circle" onClick={() => handleEditUserClick(u)}><i className="bi bi-pencil"></i></button><button className="btn btn-sm btn-outline-danger rounded-circle" onClick={() => handleDeleteUser(u._id)}><i className="bi bi-trash"></i></button></td></tr>))}</tbody></table>
              </div>
            )}

            {activeTab === 'revenue' && (
              <div className="animation-fade-in">
                {/* ... giữ nguyên phần doanh thu bạn đã gửi ... */}
                <h4 className="fw-bold mb-4">Báo cáo doanh thu</h4>
                <div className="row g-3 mb-4">
                  <div className="col-md-4"><div className="card rev-card rev-card-blue p-4 shadow-sm"><div className="stat-label">TỔNG DOANH THU THÁNG</div><div className="stat-value">{revenueData.totalMonth.toLocaleString()} VNĐ</div></div></div>
                  <div className="col-md-4"><div className="card rev-card rev-card-teal p-4 shadow-sm"><div className="stat-label">HÔM NAY</div><div className="stat-value">{revenueData.totalToday.toLocaleString()} VNĐ</div></div></div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* MODAL CHI TIẾT (GIỮ NGUYÊN) */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="p-3 bg-info text-white d-flex justify-content-between align-items-center"><h5 className="fw-bold mb-0">Chi tiết Đơn hàng</h5><button className="btn-close btn-close-white" onClick={() => setSelectedBooking(null)}></button></div>
            <div className="p-4">
              <div className="row mb-3"><div className="col-5 text-muted small">Mã đơn:</div><div className="col-7 fw-bold">#{selectedBooking._id.substring(18).toUpperCase()}</div></div>
              <div className="row mb-3"><div className="col-5 text-muted small">Khách:</div><div className="col-7 fw-bold text-primary">{selectedBooking.userId?.name || selectedBooking.name || 'Khách vãng lai'}</div></div>
              <div className="row mb-3"><div className="col-5 text-muted small">Số điện thoại:</div><div className="col-7 fw-bold text-dark">{selectedBooking.userId?.phone || selectedBooking.phone || 'Chưa cập nhật'}</div></div>
              <div className="row mb-3"><div className="col-5 text-muted small">Tour:</div><div className="col-7 fw-bold">{selectedBooking.tourId?.title}</div></div>
              <div className="row mb-3 pb-3 border-bottom"><div className="col-5 text-muted small">Tình trạng:</div><div className="col-7"><span className={`badge ${selectedBooking.status === 'paid' ? 'bg-success' : selectedBooking.status === 'cancelled' ? 'bg-danger' : 'bg-warning text-dark'}`}>{selectedBooking.status === 'paid' ? 'Thành công' : 'Chờ duyệt'}</span></div></div>
              <div className="row align-items-center"><div className="col-5 fw-bold">Tổng thanh toán:</div><div className="col-7 fw-bold text-danger fs-4">{selectedBooking.totalPrice?.toLocaleString()} ₫</div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;