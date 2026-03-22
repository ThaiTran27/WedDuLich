import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { resolveImageUrl } from '../../public/assets/img/index/imagePath';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filterType, setFilterType] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    _id: '', title: '', city: '', price: '', duration: '', image: '', description: '', availableSeats: 20, startDate: '', endDate: '', category: '', featured: false
  });

  const [showBlogForm, setShowBlogForm] = useState(false);
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [blogFormData, setBlogFormData] = useState({ _id: '', title: '', content: '', image: '', category: 'Cẩm Nang Du Lịch', featured: false });

  const [selectedBooking, setSelectedBooking] = useState(null);

  const [showUserForm, setShowUserForm] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [userFormData, setUserFormData] = useState({ _id: '', name: '', email: '', phone: '', password: '', role: 'user' });

  const [notification, setNotification] = useState({ visible: false, message: '', type: 'success' });

  const [showImagePicker, setShowImagePicker] = useState(false);
  const [availableImages, setAvailableImages] = useState([
    'tour-1.jpg', 'tour-2.jpg', 'tour-3.jpg', 'tour-4.jpg', 'tour-5.jpg', 'tour-6.jpg',
    'ha-noi-en-370x370.jpg', 'Moc-Chau-370x370.jpg', 'ninh-binh-370x370.jpg',
    'CamPha_QuanNinh_Carousel.jpg', 'co-hong-da-lat-760x370.jpg', 'Vinh-ha-long.jpg',
    'anh-cau-rong-da-nang-phun-lua-dep_111044330.jpg', 'Bà-Nà-2.jpg', 'cau-vang-ba-na-hills.jpg',
    'han-quoc-370x370.jpg', 'tour-phansipan.png', 'about.png'
  ]);
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => { fetchData(); }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ visible: true, message, type });
    setTimeout(() => setNotification({ visible: false, message: '', type: 'success' }), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tourRes, bookRes, userRes, blogRes, reviewRes, catRes] = await Promise.all([
        axios.get('http://127.0.0.1:5000/api/tours'),
        axios.get('http://127.0.0.1:5000/api/bookings'),
        axios.get('http://127.0.0.1:5000/api/auth/users').catch(() => ({ data: { success: true, data: [] } })),
        axios.get('http://127.0.0.1:5000/api/blogs'),
        axios.get('http://127.0.0.1:5000/api/reviews/all').catch(() => ({ data: { success: true, data: [] } })),
        axios.get('http://127.0.0.1:5000/api/categories').catch(() => ({ data: { success: true, data: [] } }))
      ]);

      setTours(tourRes.data.success ? tourRes.data.data : (tourRes.data || []));
      setBookings(bookRes.data.success ? bookRes.data.data : (bookRes.data || []));
      setUsers(userRes.data.success ? userRes.data.data : (userRes.data || []));
      setBlogs(blogRes.data.success ? blogRes.data.data : []);
      setReviews(reviewRes.data?.data || []);
      setAvailableCategories(catRes.data.success ? catRes.data.data.map(cat => cat.name) : []);
      if (!catRes.data.success) showNotification('Không thể lấy danh mục từ server', 'danger');
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const revenueData = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const paidBookings = (bookings || []).filter(b => b?.status === 'paid');
    
    const monthlyPaid = paidBookings.filter(b => {
      const d = new Date(b.createdAt);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    });
    const totalMonth = monthlyPaid.reduce((sum, b) => sum + (Number(b?.totalPrice) || 0), 0);

    const todayPaid = paidBookings.filter(b => new Date(b.createdAt).toDateString() === now.toDateString());
    const totalToday = todayPaid.reduce((sum, b) => sum + (Number(b?.totalPrice) || 0), 0);

    const tourCounts = {};
    paidBookings.forEach(b => {
      if (b.tourId && b.tourId.title) {
        tourCounts[b.tourId.title] = (tourCounts[b.tourId.title] || 0) + 1;
      }
    });
    let popularTour = 'Chưa xác định';
    let maxCount = 0;
    for (const [title, count] of Object.entries(tourCounts)) {
      if (count > maxCount) { maxCount = count; popularTour = title; }
    }

    return { totalMonth, totalToday, successCount: paidBookings.length, popularTour };
  }, [bookings]);

  const filteredRevenueBookings = useMemo(() => {
    let list = bookings.filter(b => b.status === 'paid');
    const today = new Date();
    if (filterType === 'day') {
      list = list.filter(b => new Date(b.createdAt).toDateString() === today.toDateString());
    } else if (filterType === 'month') {
      list = list.filter(b => new Date(b.createdAt).getMonth() === today.getMonth() && new Date(b.createdAt).getFullYear() === today.getFullYear());
    }
    if (searchTerm) {
      list = list.filter(b => b._id.toLowerCase().includes(searchTerm.toLowerCase()) || b.tourId?.title?.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return list;
  }, [bookings, filterType, searchTerm]);

  const stats = useMemo(() => {
    const paid = bookings.filter(b => b.status === 'paid');
    const totalRevenue = paid.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    return { totalRevenue, bookingTotal: bookings.length, tourCount: tours.length, userCount: users.length, blogCount: blogs.length };
  }, [bookings, tours, users, blogs]);

  // ========================================================
  // HÀM TRỢ THỦ XUẤT EXCEL CHỐNG LỖI DẤU PHẨY VÀ LỖI FONT
  // ========================================================
  const escapeCSV = (str) => {
    if (str === null || str === undefined) return '""';
    const escaped = String(str).replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const downloadCSV = (csvContent, fileName) => {
    const BOM = "\uFEFF"; 
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. Xuất Excel: Danh sách Người dùng
  const exportUsersToCSV = () => {
    const headers = ['STT', 'Họ Tên', 'Email', 'Số điện thoại', 'Vai trò'];
    const csvRows = [headers.join(',')];
    filteredUsers.forEach((u, i) => {
      const row = [ i + 1, escapeCSV(u.name), escapeCSV(u.email), escapeCSV(u.phone || 'N/A'), escapeCSV(u.role) ];
      csvRows.push(row.join(','));
    });
    downloadCSV(csvRows.join('\n'), 'Danh_Sach_Nguoi_Dung.csv');
  };

  // 2. Xuất Excel: Danh sách Tour
  const exportToursToCSV = () => {
    const headers = ['STT', 'Tên Tour', 'Thành phố', 'Giá (VNĐ)', 'Thời lượng', 'Danh mục', 'Trạng thái'];
    const csvRows = [headers.join(',')];
    filteredTours.forEach((t, i) => {
      const statusStr = t.featured ? 'Nổi bật' : 'Thường';
      const row = [ i + 1, escapeCSV(t.title), escapeCSV(t.city), escapeCSV(t.price), escapeCSV(t.duration), escapeCSV(t.category), escapeCSV(statusStr) ];
      csvRows.push(row.join(','));
    });
    downloadCSV(csvRows.join('\n'), 'Danh_Sach_Tour.csv');
  };

  // 3. Xuất Excel: Lịch sử Đơn Hàng
  const exportBookingsToCSV = () => {
    const headers = ['STT', 'Mã Đơn', 'Ngày Đặt', 'Khách Hàng', 'SĐT', 'Tên Tour', 'Tổng Tiền (VNĐ)', 'Trạng Thái'];
    const csvRows = [headers.join(',')];
    filteredBookings.forEach((b, i) => {
      const statusStr = b.status === 'paid' ? 'Thành công' : b.status === 'cancelled' ? 'Đã hủy' : 'Chờ duyệt';
      const userName = b.userId?.name || b.name || 'Khách vãng lai';
      const userPhone = b.userId?.phone || b.phone || 'N/A';
      const row = [ i + 1, escapeCSV('#' + b._id.substring(18).toUpperCase()), escapeCSV(new Date(b.createdAt).toLocaleDateString('vi-VN')), escapeCSV(userName), escapeCSV(userPhone), escapeCSV(b.tourId?.title || 'Tour đã xóa'), escapeCSV(b.totalPrice), escapeCSV(statusStr) ];
      csvRows.push(row.join(','));
    });
    downloadCSV(csvRows.join('\n'), 'Lich_Su_Don_Hang.csv');
  };

  // 4. Xuất Excel: Báo Cáo Doanh Thu
  const exportRevenueToCSV = () => {
    const headers = ['STT', 'Mã Đơn', 'Ngày Đặt', 'Khách Hàng', 'Tên Tour', 'Doanh Thu (VNĐ)', 'Trạng Thái'];
    const csvRows = [headers.join(',')];
    filteredRevenueBookings.forEach((b, i) => {
      const userName = b.userId?.name || b.name || 'Khách vãng lai';
      const row = [ i + 1, escapeCSV('#' + b._id.substring(18).toUpperCase()), escapeCSV(new Date(b.createdAt).toLocaleDateString('vi-VN')), escapeCSV(userName), escapeCSV(b.tourId?.title || 'Tour đã xóa'), escapeCSV(b.totalPrice), escapeCSV('Đã Thanh Toán') ];
      csvRows.push(row.join(','));
    });
    downloadCSV(csvRows.join('\n'), 'Bao_Cao_Doanh_Thu_Chi_Tiet.csv');
  };

  // --- CÁC HÀM XỬ LÝ API (GIỮ NGUYÊN) ---
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const handleBlogInputChange = (e) => setBlogFormData({...blogFormData, [e.target.name]: e.target.value});
  const handleSubmitBlog = async (e) => {
    e.preventDefault();
    try {
      const cfg = getAuthHeaders();
      if (!cfg) { showNotification('Bạn chưa đăng nhập hoặc token đã hết hạn!', 'danger'); return; }
      if (isEditingBlog) await axios.put(`http://127.0.0.1:5000/api/blogs/${blogFormData._id}`, blogFormData, cfg);
      else await axios.post('http://127.0.0.1:5000/api/blogs', blogFormData, cfg);
      showNotification('Lưu bài viết thành công!', 'success');
      setShowBlogForm(false); setIsEditingBlog(false); fetchData();
    } catch (error) { showNotification(`Lỗi khi lưu Blog: ${error.message}`, 'danger'); }
  };
  const handleDeleteBlog = async (id) => {
    if (window.confirm('Xóa bài viết này?')) {
      const cfg = getAuthHeaders();
      if (!cfg) return alert('Bạn chưa đăng nhập!');
      await axios.delete(`http://127.0.0.1:5000/api/blogs/${id}`, cfg); fetchData();
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm('Xóa bình luận này?')) { await axios.delete(`http://127.0.0.1:5000/api/reviews/${id}`); fetchData(); }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    if (window.confirm(`Xác nhận chuyển trạng thái sang: ${newStatus === 'paid' ? 'Đã thanh toán' : 'Đã hủy'}?`)) {
      try { await axios.put(`http://127.0.0.1:5000/api/bookings/${id}`, { status: newStatus }); alert('Thành công!'); fetchData(); setSelectedBooking(null); } 
      catch (error) { alert('Lỗi!'); }
    }
  };

  const handleDeleteTour = async (id) => {
    if (window.confirm('Xóa tour này?')) {
      const cfg = getAuthHeaders();
      if (!cfg) return showNotification('Bạn chưa đăng nhập!', 'danger');
      try { await axios.delete(`http://127.0.0.1:5000/api/tours/${id}`, cfg); fetchData(); showNotification('Xóa tour thành công!', 'success'); } 
      catch (error) { showNotification(`Xóa tour lỗi`, 'danger'); }
    }
  };

  const handleInputChange = (e) => { setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); };
  const resetForm = () => { setFormData({ _id: '', title: '', city: '', price: '', duration: '', image: '', description: '', availableSeats: 20, startDate: '', endDate: '', category: '', featured: false }); setIsEditing(false); setShowForm(false); };
  const handleEditClick = (tour) => { setFormData({...tour}); setIsEditing(true); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleSubmitTour = async (e) => {
    e.preventDefault();
    try {
      const cfg = getAuthHeaders();
      if (!cfg) return showNotification('Bạn chưa đăng nhập!', 'danger');
      if (isEditing) await axios.put(`http://127.0.0.1:5000/api/tours/${formData._id}`, formData, cfg);
      else await axios.post('http://127.0.0.1:5000/api/tours', formData, cfg);
      resetForm(); fetchData(); showNotification('Lưu tour thành công!', 'success');
    } catch (error) { showNotification(`Lưu không thành công`, 'danger'); }
  };

  const handleUserInputChange = (e) => setUserFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const resetUserForm = () => { setUserFormData({ _id: '', name: '', email: '', phone: '', password: '', role: 'user' }); setIsEditingUser(false); setShowUserForm(false); };
  const handleEditUserClick = (user) => { setUserFormData({ _id: user._id, name: user.name, email: user.email, phone: user.phone || '', password: '', role: user.role || 'user' }); setIsEditingUser(true); setShowUserForm(true); };
  const handleDeleteUser = async (id) => { 
    if (window.confirm('Chắc chắn xóa người dùng này?')) { try { await axios.delete(`http://127.0.0.1:5000/api/auth/users/${id}`); fetchData(); } catch (e) { alert('Lỗi xóa user!'); } } 
  };
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
      {notification.visible && (
        <div className={`position-fixed top-0 end-0 m-3 alert alert-${notification.type} shadow`} style={{ zIndex: 2000, minWidth: '280px' }}>
          {notification.message}
        </div>
      )}
      <style>{`
        .rev-card { border-radius: 12px; border: none; padding: 20px; transition: 0.3s; height: 100%; box-shadow: 0 4px 6px rgba(0,0,0,0.05); } 
        .rev-card-blue { background: #3b82f6; color: white; } 
        .rev-card-green { background: #10b981; color: white; }
        .rev-card-white { background: #ffffff; color: #333; border: 1px solid #e5e7eb !important; } 
        .stat-label { font-size: 0.8rem; text-transform: uppercase; font-weight: 600; opacity: 0.9; margin-bottom: 8px;} 
        .stat-value { font-size: 1.8rem; font-weight: 700; margin-bottom: 5px; }
        .stat-sub { font-size: 0.8rem; opacity: 0.8; }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1050; display: flex; justify-content: center; align-items: center; } 
        .modal-box { background: white; border-radius: 16px; width: 90%; max-width: 500px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2); animation: scaleIn 0.3s ease; } @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
      
      <div className="container-fluid px-4 mt-4">
        <div className="row g-4">
          
          {/* SIDEBAR */}
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
                  { id: 'blogs', icon: 'journal-text', label: 'Quản lý Blog' }, 
                  { id: 'bookings', icon: 'receipt', label: 'Đơn hàng' }, 
                  { id: 'reviews', icon: 'star-half', label: 'Bình luận' }, 
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

            {/* QUẢN LÝ TOUR */}
            {activeTab === 'tours' && (
              <div className="animation-fade-in">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold mb-0">Danh sách Tour</h4>
                  <div className="d-flex gap-2">
                    <button className="btn btn-success rounded-pill px-4 shadow-sm" onClick={exportToursToCSV}>
                      <i className="bi bi-file-earmark-excel me-2"></i>Xuất Excel
                    </button>
                    <button className="btn btn-info text-white rounded-pill px-4 shadow-sm" onClick={() => setShowForm(!showForm)}>
                      {showForm ? 'Đóng form' : '+ Thêm mới'}
                    </button>
                  </div>
                </div>
                
                {/* Form Tour */}
                {showForm && (
                  <div className="card border-0 shadow-sm p-4 mb-4 rounded-4 border-top border-info border-4">
                    <h5 className="fw-bold mb-3">{isEditing ? 'Cập nhật Tour' : 'Thêm Tour mới'}</h5>
                    <form onSubmit={handleSubmitTour}>
                      <div className="row g-3">
                        <div className="col-md-6"><label className="small fw-bold">Tên Tour</label><input type="text" className="form-control" name="title" value={formData.title} onChange={handleInputChange} required /></div>
                        <div className="col-md-6"><label className="small fw-bold">Thành phố</label><input type="text" className="form-control" name="city" value={formData.city} onChange={handleInputChange} required /></div>
                        <div className="col-md-3"><label className="small fw-bold">Giá (VNĐ)</label><input type="number" className="form-control" name="price" value={formData.price} onChange={handleInputChange} required /></div>
                        <div className="col-md-3"><label className="small fw-bold">Thời lượng tour</label><input type="text" className="form-control" name="duration" value={formData.duration} onChange={handleInputChange} placeholder="VD: 3 ngày 2 đêm" required /></div>
                        <div className="col-md-3"><label className="small fw-bold">Ghế trống</label><input type="number" className="form-control" name="availableSeats" value={formData.availableSeats} onChange={handleInputChange} required /></div>
                        <div className="col-md-3"><label className="small fw-bold">Danh mục</label><select className="form-select" name="category" value={formData.category} onChange={handleInputChange} required><option value="">-- Chọn danh mục --</option>{availableCategories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}</select></div>
                        <div className="col-md-6"><label className="small fw-bold">Ngày khởi hành</label><input type="text" className="form-control" name="startDate" value={formData.startDate} onChange={handleInputChange} placeholder="VD: Thứ 7 hàng tuần" required /></div>
                        <div className="col-md-6"><label className="small fw-bold">Ngày kết thúc</label><input type="text" className="form-control" name="endDate" value={formData.endDate} onChange={handleInputChange} placeholder="VD: Chủ nhật hàng tuần" required /></div>
                        <div className="col-md-12">
                          <label className="small fw-bold">Chọn Ảnh</label>
                          <div className="d-flex gap-2">
                            <input type="text" className="form-control" name="image" value={formData.image} onChange={handleInputChange} placeholder="VD: tour-1.jpg hoặc /assets/img/index/tour-1.jpg" required />
                            <button type="button" className="btn btn-outline-info rounded-pill px-3" onClick={() => setShowImagePicker(!showImagePicker)}><i className="bi bi-image"></i> Chọn</button>
                          </div>
                          {formData.image && <div className="mt-2"><img src={formData.image.includes('/') ? resolveImageUrl(formData.image) : `/assets/img/index/${formData.image}`} alt="Preview" className="rounded" style={{width:'100px', height:'70px', objectFit:'cover'}} onError={(e) => {e.target.style.display='none'}} /></div>}
                        </div>
                        {showImagePicker && (
                          <div className="col-12 border rounded-3 p-3 bg-light">
                            <label className="small fw-bold mb-3 d-block">Chọn ảnh từ thư viện (Nhấp để chọn):</label>
                            <div className="row g-2">
                              {availableImages.map((img) => (
                                <div key={img} className="col-md-3 col-sm-4 col-6">
                                  <div
                                    className={`position-relative rounded-2 cursor-pointer overflow-hidden ${formData.image === img ? 'border-4 border-success' : 'border-1 border-secondary'}`}
                                    onClick={() => { setFormData({...formData, image: img}); setShowImagePicker(false); }}
                                    style={{cursor: 'pointer', aspectRatio: '3/2'}}
                                  >
                                    <img src={`/assets/img/index/${img}`} alt={img} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                                    {formData.image === img && <i className="bi bi-check-circle-fill" style={{position:'absolute', bottom:'5px', right:'5px', color:'#10b981', fontSize:'20px', textShadow: '0 0 2px white'}}></i>}
                                  </div>
                                  <small className="text-muted text-center d-block text-truncate mt-1">{img}</small>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="col-12"><label className="small fw-bold">Mô tả Tour</label><textarea className="form-control" name="description" rows="4" value={formData.description} onChange={handleInputChange} required></textarea></div>
                        <div className="col-md-12"><div className="form-check form-switch"><input className="form-check-input" type="checkbox" name="featured" id="tourFeatured" checked={formData.featured} onChange={(e) => setFormData({...formData, featured: e.target.checked})} /><label className="form-check-label fw-bold" htmlFor="tourFeatured">Tour nổi bật</label></div></div>
                      </div>
                      <div className="d-flex gap-2 mt-4">
                        <button type="submit" className="btn btn-info text-white rounded-pill px-5 fw-bold flex-grow-1">{isEditing ? 'Cập nhật' : 'Thêm mới'}</button>
                        <button type="button" className="btn btn-outline-secondary rounded-pill px-5 fw-bold" onClick={resetForm}>Hủy</button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <table className="table table-hover align-middle mb-0">
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

            {/* QUẢN LÝ BLOG */}
            {activeTab === 'blogs' && (
              <div className="animation-fade-in">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold mb-0">Quản lý bài viết Blog</h4>
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
                        <div className="col-md-12">
                          <label className="small fw-bold">Chọn Ảnh Bìa</label>
                          <div className="d-flex gap-2">
                            <input type="text" className="form-control" name="image" value={blogFormData.image} onChange={handleBlogInputChange} placeholder="/assets/img/index/ten-anh.jpg" required />
                            <button type="button" className="btn btn-outline-info rounded-pill px-3" onClick={() => setShowImagePicker(!showImagePicker)}><i className="bi bi-image"></i> Chọn</button>
                          </div>
                          {blogFormData.image && <div className="mt-2"><img src={blogFormData.image} alt="Preview" className="rounded" style={{width:'100px', height:'70px', objectFit:'cover'}} /></div>}
                        </div>
                        {showImagePicker && (
                          <div className="col-12 border rounded-3 p-3 bg-light">
                            <label className="small fw-bold mb-3 d-block">Chọn ảnh từ thư viện (Nhấp để chọn):</label>
                            <div className="row g-2">
                              {availableImages.map((img) => (
                                <div key={img} className="col-md-3 col-sm-4 col-6">
                                  <div
                                    className={`position-relative rounded-2 cursor-pointer overflow-hidden ${blogFormData.image === `/assets/img/index/${img}` ? 'border-4 border-success' : 'border-1 border-secondary'}`}
                                    onClick={() => { setBlogFormData({...blogFormData, image: `/assets/img/index/${img}`}); setShowImagePicker(false); }}
                                    style={{cursor: 'pointer', aspectRatio: '3/2'}}
                                  >
                                    <img src={`/assets/img/index/${img}`} alt={img} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                                    {blogFormData.image === `/assets/img/index/${img}` && <i className="bi bi-check-circle-fill" style={{position:'absolute', bottom:'5px', right:'5px', color:'#10b981', fontSize:'20px', textShadow: '0 0 2px white'}}></i>}
                                  </div>
                                  <small className="text-muted text-center d-block text-truncate mt-1">{img}</small>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="col-12"><label className="small fw-bold">Nội dung bài viết</label><textarea className="form-control" name="content" rows="5" value={blogFormData.content} onChange={handleBlogInputChange} required></textarea></div>
                      </div>
                      <button type="submit" className="btn btn-info text-white w-100 mt-3 rounded-pill fw-bold">ĐĂNG BÀI</button>
                    </form>
                  </div>
                )}
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <table className="table table-hover align-middle mb-0">
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

            {/* QUẢN LÝ BÌNH LUẬN */}
            {activeTab === 'reviews' && (
              <div className="animation-fade-in card border-0 shadow-sm rounded-4 p-4">
                <h4 className="fw-bold mb-4">Quản lý Đánh giá & Bình luận</h4>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light"><tr><th>KHÁCH HÀNG</th><th>TOUR/BLOG</th><th>SAO</th><th>NỘI DUNG</th><th>NGÀY</th><th className="text-center">HÀNH ĐỘNG</th></tr></thead>
                    <tbody>
                      {reviews.map(r => (
                        <tr key={r._id}>
                          <td><strong>{r.userId?.name}</strong></td>
                          <td className="small">{r.tourId?.title || r.blogId?.title || 'Không rõ'}</td>
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

            {/* QUẢN LÝ ĐƠN HÀNG */}
            {activeTab === 'bookings' && (
              <div className="animation-fade-in">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold mb-0">Lịch sử đặt tour</h4>
                  <button className="btn btn-success rounded-pill px-4 shadow-sm" onClick={exportBookingsToCSV}>
                    <i className="bi bi-file-earmark-excel me-2"></i>Xuất Excel
                  </button>
                </div>
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <table className="table table-hover align-middle small mb-0">
                    <thead className="table-light text-muted"><tr><th>MÃ ĐƠN</th><th>THỜI GIAN</th><th>TOUR</th><th>TIỀN</th><th>TRẠNG THÁI</th><th className="text-center">XỬ LÝ</th></tr></thead>
                    <tbody>
                      {filteredBookings.map(b => (
                        <tr key={b._id}>
                          <td className="fw-bold">#{b._id.substring(18).toUpperCase()}</td>
                          <td><div className="fw-bold">{new Date(b.createdAt).toLocaleDateString('vi-VN')}</div><div className="text-muted" style={{fontSize: '11px'}}>{new Date(b.createdAt).toLocaleTimeString('vi-VN')}</div></td>
                          <td className="text-truncate" style={{maxWidth: '180px'}}>{b.tourId?.title}</td>
                          <td className="fw-bold text-primary">{b.totalPrice?.toLocaleString()}đ</td>
                          <td><span className={`badge rounded-pill px-3 py-2 ${b.status === 'paid' ? 'bg-success' : b.status === 'cancelled' ? 'bg-danger' : 'bg-warning text-dark'}`}>{b.status === 'paid' ? 'Thành công' : b.status === 'cancelled' ? 'Đã hủy' : 'Chờ duyệt'}</span></td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-1">
                              {b.status !== 'paid' && b.status !== 'cancelled' && (
                                <>
                                  <button className="btn btn-sm btn-success rounded-pill" onClick={() => handleUpdateStatus(b._id, 'paid')}><i className="bi bi-check-lg"></i></button>
                                  <button className="btn btn-sm btn-danger rounded-pill" onClick={() => handleUpdateStatus(b._id, 'cancelled')}><i className="bi bi-x-lg"></i></button>
                                </>
                              )}
                              <button className="btn btn-sm btn-info text-white rounded-pill" onClick={() => setSelectedBooking(b)}><i className="bi bi-eye"></i></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* QUẢN LÝ NGƯỜI DÙNG */}
            {activeTab === 'users' && (
              <div className="animation-fade-in">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold mb-0">Quản lý Người dùng</h4>
                  <div className="d-flex gap-2">
                    <button className="btn btn-success rounded-pill px-4 shadow-sm" onClick={exportUsersToCSV}>
                      <i className="bi bi-file-earmark-excel me-2"></i>Xuất Excel
                    </button>
                    <button className="btn btn-info text-white rounded-pill px-4 shadow-sm" onClick={() => {setShowUserForm(!showUserForm); setIsEditingUser(false); setUserFormData({ _id: '', name: '', email: '', phone: '', password: '', role: 'user' })}}>
                      {showUserForm ? 'Đóng form' : '+ Thêm User'}
                    </button>
                  </div>
                </div>

                {showUserForm && (
                  <div className="card border-0 shadow-sm p-4 mb-4 rounded-4 border-top border-info border-4">
                    <h5 className="fw-bold mb-3">{isEditingUser ? 'Cập nhật Người dùng' : 'Thêm Người dùng mới'}</h5>
                    <form onSubmit={handleSubmitUser}>
                      <div className="row g-3">
                        <div className="col-md-6"><label className="small fw-bold">Họ tên</label><input type="text" className="form-control" name="name" value={userFormData.name} onChange={handleUserInputChange} required /></div>
                        <div className="col-md-6"><label className="small fw-bold">Email</label><input type="email" className="form-control" name="email" value={userFormData.email} onChange={handleUserInputChange} disabled={isEditingUser} required /></div>
                        <div className="col-md-6"><label className="small fw-bold">Số điện thoại</label><input type="text" className="form-control" name="phone" value={userFormData.phone} onChange={handleUserInputChange} /></div>
                        <div className="col-md-3"><label className="small fw-bold">Vai trò</label><select className="form-select" name="role" value={userFormData.role} onChange={handleUserInputChange}><option value="user">User</option><option value="admin">Admin</option></select></div>
                        {!isEditingUser && <div className="col-md-3"><label className="small fw-bold">Mật khẩu</label><input type="password" className="form-control" name="password" value={userFormData.password} onChange={handleUserInputChange} required /></div>}
                      </div>
                      <button type="submit" className="btn btn-info text-white mt-4 rounded-pill px-5 fw-bold shadow-sm">{isEditingUser ? 'Cập nhật' : 'Đăng ký User'}</button>
                    </form>
                  </div>
                )}

                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small"><tr><th>STT</th><th>HỌ TÊN</th><th>EMAIL</th><th>SĐT</th><th>QUYỀN</th><th className="text-center">THAO TÁC</th></tr></thead>
                    <tbody>
                      {filteredUsers.map((u, i) => (
                        <tr key={u._id}>
                          <td className="text-muted">{i + 1}</td>
                          <td className="fw-bold">{u.name}</td>
                          <td className="small">{u.email}</td>
                          <td className="small">{u.phone || 'N/A'}</td>
                          <td><span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>{u.role === 'admin' ? 'Admin' : 'User'}</span></td>
                          <td className="text-center">
                            <button className="btn btn-sm btn-outline-primary me-2 rounded-circle" onClick={() => handleEditUserClick(u)}><i className="bi bi-pencil"></i></button>
                            <button className="btn btn-sm btn-outline-danger rounded-circle" onClick={() => handleDeleteUser(u._id)}><i className="bi bi-trash"></i></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* BÁO CÁO DOANH THU */}
            {activeTab === 'revenue' && (
              <div className="animation-fade-in">
                
                <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded-pill shadow-sm">
                  <div className="d-flex align-items-center w-50 px-3 border-end">
                    <i className="bi bi-search text-muted me-2"></i>
                    <input type="text" className="form-control border-0 shadow-none bg-transparent" placeholder="Tìm kiếm mã đơn hoặc tên tour..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                  <div className="btn-group pe-2">
                    <button className={`btn btn-sm ${filterType === 'all' ? 'btn-info text-white fw-bold' : 'btn-light text-muted'}`} onClick={() => setFilterType('all')}>Tất cả</button>
                    <button className={`btn btn-sm ${filterType === 'day' ? 'btn-info text-white fw-bold' : 'btn-light text-muted'}`} onClick={() => setFilterType('day')}>Hôm nay</button>
                    <button className={`btn btn-sm ${filterType === 'month' ? 'btn-info text-white fw-bold' : 'btn-light text-muted'}`} onClick={() => setFilterType('month')}>Tháng này</button>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold mb-0 text-dark"><i className="bi bi-graph-up-arrow text-primary me-2"></i>Báo Cáo Doanh Thu</h4>
                  <button className="btn btn-success rounded-pill px-4 shadow-sm" onClick={exportRevenueToCSV}>
                    <i className="bi bi-file-earmark-excel me-2"></i>Xuất Excel Doanh Thu
                  </button>
                </div>
                
                <div className="row g-3 mb-4">
                  <div className="col-md-3">
                    <div className="rev-card rev-card-blue">
                      <div className="stat-label"><i className="bi bi-currency-dollar me-1"></i>DOANH THU THÁNG</div>
                      <div className="stat-value">{revenueData.totalMonth.toLocaleString()} VNĐ</div>
                      <div className="stat-sub"><i className="bi bi-arrow-up-short"></i> Cập nhật liên tục</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="rev-card rev-card-white">
                      <div className="stat-label text-muted"><i className="bi bi-calendar-day me-1"></i>DOANH THU HÔM NAY</div>
                      <div className="stat-value text-dark">{revenueData.totalToday.toLocaleString()} VNĐ</div>
                      <div className="stat-sub text-success"><i className="bi bi-activity"></i> Hôm nay</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="rev-card rev-card-green">
                      <div className="stat-label"><i className="bi bi-check-circle me-1"></i>ĐƠN THÀNH CÔNG</div>
                      <div className="stat-value">{revenueData.successCount}</div>
                      <div className="stat-sub">Đã thu tiền</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="rev-card rev-card-white">
                      <div className="stat-label text-muted"><i className="bi bi-star me-1"></i>TOUR PHỔ BIẾN</div>
                      <div className="stat-value text-dark fs-5 text-truncate" title={revenueData.popularTour}>{revenueData.popularTour}</div>
                      <div className="stat-sub text-muted">Dựa trên lượt đặt</div>
                    </div>
                  </div>
                </div>

                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light text-muted small">
                      <tr><th>Mã Đơn</th><th>Ngày Đặt</th><th>Tên Tour</th><th>Khách Hàng</th><th>Tổng Tiền</th><th>Trạng Thái</th><th className="text-center">Thao tác</th></tr>
                    </thead>
                    <tbody>
                      {filteredRevenueBookings.map(b => (
                        <tr key={b._id}>
                          <td className="fw-bold text-secondary">#{b._id.substring(18).toUpperCase()}</td>
                          <td>{new Date(b.createdAt).toLocaleDateString('vi-VN')}</td>
                          <td className="fw-bold text-truncate" style={{maxWidth: '200px'}}>{b.tourId?.title || <span className="text-muted fst-italic">Tour đã xóa</span>}</td>
                          <td>{b.userId?.name || b.name || 'Khách vãng lai'}</td>
                          <td className="fw-bold text-primary">{b.totalPrice?.toLocaleString()}đ</td>
                          <td><span className="badge bg-success rounded-pill px-3 py-2">Đã Thanh Toán</span></td>
                          <td className="text-center">
                            <button className="btn btn-sm btn-link text-info text-decoration-none fw-bold" onClick={() => setSelectedBooking(b)}>[Xem]</button>
                          </td>
                        </tr>
                      ))}
                      {filteredRevenueBookings.length === 0 && (
                        <tr><td colSpan="7" className="text-center py-4 text-muted">Không có dữ liệu doanh thu nào.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* MODAL CHI TIẾT ĐƠN HÀNG */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="p-3 bg-info text-white d-flex justify-content-between align-items-center"><h5 className="fw-bold mb-0">Chi tiết Đơn hàng</h5><button className="btn-close btn-close-white" onClick={() => setSelectedBooking(null)}></button></div>
            <div className="p-4">
              <div className="row mb-3"><div className="col-5 text-muted small">Mã đơn:</div><div className="col-7 fw-bold">#{selectedBooking._id.substring(18).toUpperCase()}</div></div>
              <div className="row mb-3"><div className="col-5 text-muted small">Khách:</div><div className="col-7 fw-bold text-primary">{selectedBooking.userId?.name || selectedBooking.name || 'Khách vãng lai'}</div></div>
              <div className="row mb-3"><div className="col-5 text-muted small">Số điện thoại:</div><div className="col-7 fw-bold text-dark">{selectedBooking.userId?.phone || selectedBooking.phone || 'Chưa cập nhật'}</div></div>
              <div className="row mb-3"><div className="col-5 text-muted small">Tour:</div><div className="col-7 fw-bold">{selectedBooking.tourId?.title || 'Tour đã bị xóa'}</div></div>
              <div className="row mb-3 pb-3 border-bottom"><div className="col-5 text-muted small">Tình trạng:</div><div className="col-7"><span className={`badge ${selectedBooking.status === 'paid' ? 'bg-success' : selectedBooking.status === 'cancelled' ? 'bg-danger' : 'bg-warning text-dark'}`}>{selectedBooking.status === 'paid' ? 'Thành công' : selectedBooking.status === 'cancelled' ? 'Đã hủy' : 'Chờ duyệt'}</span></div></div>
              <div className="row align-items-center"><div className="col-5 fw-bold">Tổng thanh toán:</div><div className="col-7 fw-bold text-danger fs-4">{selectedBooking.totalPrice?.toLocaleString()} ₫</div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;