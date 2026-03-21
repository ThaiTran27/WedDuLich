import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { resolveImageUrl } from '../../public/assets/img/index/imagePath';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filterType, setFilterType] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [formData, setFormData] = useState({
    _id: '', title: '', city: '', price: '', duration: '', image: '', description: '', availableSeats: 20, startDate: '', endDate: '', category: '', featured: false
  });

  const [showUserForm, setShowUserForm] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [userFormData, setUserFormData] = useState({ _id: '', name: '', email: '', phone: '', password: '', role: 'user' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tourRes, bookRes, userRes] = await Promise.all([
        axios.get('http://127.0.0.1:5000/api/tours'),
        axios.get('http://127.0.0.1:5000/api/bookings'),
        axios.get('http://127.0.0.1:5000/api/auth/users').catch(() => ({ data: { success: true, data: [] } }))
      ]);

      setTours(tourRes.data.success ? tourRes.data.data : (tourRes.data || []));
      setBookings(bookRes.data.success ? bookRes.data.data : (bookRes.data || []));
      setUsers(userRes.data.success ? userRes.data.data : (userRes.data || []));
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
                             t.city.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             (t.category && t.category.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [tours, searchTerm]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [users, searchTerm]);

  const stats = useMemo(() => {
    const paid = bookings.filter(b => b.status === 'paid');
    const totalRevenue = paid.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    return { totalRevenue, bookingTotal: bookings.length, tourCount: tours.length, userCount: users.length };
  }, [bookings, tours, users]);

  const revenueData = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const paidBookings = bookings.filter(b => b.status === 'paid');
    
    const monthlyPaid = paidBookings.filter(b => {
      const d = new Date(b.createdAt);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    });
    const totalMonth = monthlyPaid.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    const todayPaid = paidBookings.filter(b => new Date(b.createdAt).toDateString() === now.toDateString());
    const totalToday = todayPaid.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    const tourCounts = paidBookings.reduce((acc, b) => {
      const name = b.tourId?.title || 'Chưa xác định';
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});
    const popularTour = Object.entries(tourCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || "N/A";

    const details = filteredBookings.filter(b => b.status === 'paid').sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

    return { totalMonth, totalToday, successCount: paidBookings.length, popularTour, details };
  }, [bookings, filteredBookings]);

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
    } catch (error) {
      alert('Lỗi cập nhật trạng thái nổi bật!');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData(prev => ({ ...prev, image: `/assets/img/index/${file.name}` }));
  };

  const resetForm = () => {
    setFormData({ _id: '', title: '', city: '', price: '', duration: '', image: '', description: '', availableSeats: 20, startDate: '', endDate: '', category: '', featured: false });
    setIsEditing(false);
    setShowForm(false);
  };

  const handleEditClick = (tour) => {
    setFormData({
      _id: tour._id, title: tour.title, city: tour.city, price: tour.price, duration: tour.duration,
      image: tour.image, description: tour.description, availableSeats: tour.availableSeats,
      startDate: tour.startDate || '', endDate: tour.endDate || '',
      category: tour.category || '', featured: tour.featured || false
    });
    setIsEditing(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitTour = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://127.0.0.1:5000/api/tours/${formData._id}`, formData);
        alert('Cập nhật thành công!');
      } else {
        await axios.post('http://127.0.0.1:5000/api/tours', formData);
        alert('Thêm mới thành công!');
      }
      resetForm();
      fetchData();
    } catch (error) { alert('Lỗi khi lưu!'); }
  };

  const handleUserInputChange = (e) => setUserFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const resetUserForm = () => { setUserFormData({ _id: '', name: '', email: '', phone: '', password: '', role: 'user' }); setIsEditingUser(false); setShowUserForm(false); };
  const handleEditUserClick = (user) => { setUserFormData({ _id: user._id, name: user.name, email: user.email, phone: user.phone || '', password: '', role: user.role || 'user' }); setIsEditingUser(true); setShowUserForm(true); window.scrollTo(0,0); };
  const handleDeleteUser = async (id) => { if (window.confirm('Chắc chắn xóa người dùng này?')) { try { await axios.delete(`http://127.0.0.1:5000/api/auth/users/${id}`); fetchData(); } catch (e) { alert('Lỗi xóa user!'); } } };
  const handleSubmitUser = async (e) => {
    e.preventDefault();
    try {
      if (isEditingUser) await axios.put(`http://127.0.0.1:5000/api/auth/users/${userFormData._id}`, userFormData);
      else await axios.post('http://127.0.0.1:5000/api/auth/register', userFormData);
      resetUserForm(); fetchData(); alert('Lưu thành công!');
    } catch (error) { alert(error.response?.data?.message || 'Lỗi lưu user!'); }
  };

  const exportToCSV = (data, filename, type) => {
    let headers = ""; let rows = "";
    
    if (type === 'bookings' || type === 'revenue') { 
      headers = "Mã Đơn,Ngày Đặt,Tên Tour,Khách Hàng,Số Điện Thoại,Tổng Tiền,Trạng Thái\n"; 
      rows = data.map(b => {
        const statusText = b.status === 'paid' ? 'Thành công' : b.status === 'cancelled' ? 'Đã hủy' : 'Chờ duyệt';
        const phoneText = b.userId?.phone || b.phone || '';
        return `"#${b._id.substring(18).toUpperCase()}",${new Date(b.createdAt).toLocaleDateString('vi-VN')},"${b.tourId?.title || 'Tour đã xóa'}","${b.userId?.name || b.name || 'Khách vãng lai'}","${phoneText}",${b.totalPrice},"${statusText}"`;
      }).join("\n"); 
    } 
    else if (type === 'users') { 
      headers = "STT,Họ Tên,Email,Số Điện Thoại,Quyền\n"; 
      rows = data.map((u, i) => `${i+1},"${u.name}","${u.email}","${u.phone || ''}","${u.role === 'admin' ? 'Admin' : 'User'}"`).join("\n"); 
    }
    else if (type === 'tours') {
      headers = "STT,Tên Tour,Giá,Danh Mục,Nổi Bật\n";
      rows = data.map((t, i) => `${i+1},"${t.title}",${t.price},"${t.category || ''}","${t.featured ? 'Có' : 'Không'}"`).join("\n");
    }

    const blob = new Blob(["\uFEFF" + headers + rows], { type: 'text/csv;charset=utf-8;' }); 
    const link = document.createElement("a"); 
    link.href = URL.createObjectURL(blob); 
    link.download = filename; 
    link.click();
  };

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><div className="spinner-border text-info"></div></div>;

  return (
    <div className="bg-light pb-5" style={{ paddingTop: '90px', minHeight: '100vh', position: 'relative' }}>
      <style>{`
        .rev-card { border-radius: 12px; border: none; transition: 0.3s; color: white; height: 100%; } .rev-card-blue { background: #1a73e8; } .rev-card-grey { background: #f8f9fa; color: #333; border: 1px solid #e0e0e0 !important; } .rev-card-teal { background: #4db6ac; } .rev-card-white { background: #ffffff; color: #333; border: 1px solid #e0e0e0 !important; } .stat-label { font-size: 0.85rem; opacity: 0.9; font-weight: 500; display: flex; align-items: center; gap: 8px; } .stat-value { font-size: 1.6rem; font-weight: 700; margin: 10px 0; }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1050; display: flex; justify-content: center; align-items: center; } .modal-box { background: white; border-radius: 16px; width: 90%; max-width: 500px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2); animation: scaleIn 0.3s ease; } @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        /* CSS cho nút gạt Nổi bật */
        .form-check-inputFeatured { width: 2.5rem !important; height: 1.2rem !important; cursor: pointer; transition: 0.2s; }
        .form-check-inputFeatured:checked { background-color: #198754; border-color: #198754; }
      `}</style>
      <div className="container-fluid px-4 mt-4">
        <div className="row g-4">
          
          {/* SIDEBAR */}
          <div className="col-12 col-lg-3 col-xl-2">
            <div className="bg-dark text-white rounded-4 shadow-sm overflow-hidden sticky-top" style={{top: '100px'}}>
              <div className="p-4 text-center border-bottom border-secondary"><div className="bg-info rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{width:'50px', height:'50px'}}><i className="bi bi-shield-lock-fill fs-3 text-white"></i></div><h6 className="fw-bold mb-0 small">HỆ THỐNG QUẢN TRỊ</h6></div>
              <div className="py-2">{[{ id: 'overview', icon: 'speedometer2', label: 'Tổng quan' }, { id: 'tours', icon: 'map', label: 'Quản lý Tour' }, { id: 'bookings', icon: 'receipt', label: 'Đơn hàng' }, { id: 'users', icon: 'people', label: 'Người dùng' }, { id: 'revenue', icon: 'graph-up-arrow', label: 'Doanh thu' }].map(item => (<div key={item.id} className={`p-3 cursor-pointer ${activeTab === item.id ? 'bg-info text-white' : ''}`} onClick={() => {setActiveTab(item.id); setSearchTerm('');}} style={{cursor: 'pointer'}}><i className={`bi bi-${item.icon} me-2`}></i> {item.label}</div>))}</div>
            </div>
          </div>

          {/* NỘI DUNG CHÍNH */}
          <div className="col-12 col-lg-9 col-xl-10">
            
            {/* THANH CÔNG CỤ CHUNG */}
            {activeTab !== 'overview' && (
              <div className="mb-4 d-flex flex-wrap gap-3 align-items-center justify-content-between">
                <div className="input-group shadow-sm rounded-pill overflow-hidden border bg-white" style={{maxWidth: '400px'}}><span className="input-group-text bg-white border-0"><i className="bi bi-search"></i></span><input type="text" className="form-control border-0" placeholder={`Tìm kiếm trong ${activeTab === 'tours' ? 'danh sách tour' : activeTab === 'bookings' ? 'đơn hàng' : activeTab === 'users' ? 'người dùng' : 'doanh thu'}...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                
                <div className="d-flex gap-3 align-items-center">
                  {(activeTab === 'bookings' || activeTab === 'revenue') && (
                    <div className="bg-white p-1 rounded-pill shadow-sm border d-flex gap-1">
                      <button onClick={() => setFilterType('all')} className={`btn btn-sm rounded-pill px-3 ${filterType === 'all' ? 'btn-info text-white' : 'btn-light'}`}>Tất cả</button>
                      <button onClick={() => setFilterType('day')} className={`btn btn-sm rounded-pill px-3 ${filterType === 'day' ? 'btn-info text-white' : 'btn-light'}`}>Trong ngày</button>
                      <button onClick={() => setFilterType('month')} className={`btn btn-sm rounded-pill px-3 ${filterType === 'month' ? 'btn-info text-white' : 'btn-light'}`}>Trong tháng</button>
                    </div>
                  )}

                  {activeTab === 'tours' && <button onClick={() => exportToCSV(filteredTours, `danh-sach-tour.csv`, 'tours')} className="btn btn-success rounded-pill px-3 shadow-sm"><i className="bi bi-file-earmark-excel me-1"></i> Xuất Excel</button>}
                  {activeTab === 'bookings' && <button onClick={() => exportToCSV(filteredBookings, `don-hang.csv`, 'bookings')} className="btn btn-success rounded-pill px-3 shadow-sm"><i className="bi bi-file-earmark-excel me-1"></i> Xuất Excel</button>}
                  {activeTab === 'revenue' && <button onClick={() => exportToCSV(revenueData.details, `bao-cao-doanh-thu.csv`, 'revenue')} className="btn btn-success rounded-pill px-3 shadow-sm"><i className="bi bi-file-earmark-excel me-1"></i> Xuất Excel</button>}
                  {activeTab === 'users' && (
                    <>
                      <button onClick={() => { if(showUserForm) resetUserForm(); else setShowUserForm(true); }} className="btn btn-info text-white rounded-pill px-3 shadow-sm">{showUserForm ? 'Đóng Form' : '+ Thêm User'}</button>
                      <button onClick={() => exportToCSV(filteredUsers, `nguoi-dung.csv`, 'users')} className="btn btn-success rounded-pill px-3 shadow-sm"><i className="bi bi-file-earmark-excel me-1"></i> Xuất Excel</button>
                    </>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'overview' && (<div className="animation-fade-in"><h4 className="fw-bold mb-4">Chào bạn, hôm nay hệ thống thế nào?</h4><div className="row g-4">{[{ label: 'Tổng số Tour', val: stats.tourCount, icon: 'map', color: 'primary' }, { label: 'Đơn đặt tour', val: stats.bookingTotal, icon: 'cart-check', color: 'success' }, { label: 'Thành viên', val: stats.userCount, icon: 'people', color: 'warning' }, { label: 'Doanh thu (VNĐ)', val: stats.totalRevenue.toLocaleString(), icon: 'cash-stack', color: 'danger' }].map((item, idx) => (<div className="col-md-3" key={idx}><div className={`card border-0 shadow-sm rounded-4 p-4 bg-${item.color} text-white position-relative`}><small className="opacity-75">{item.label}</small><h2 className="fw-bold mb-0 mt-2">{item.val}</h2><i className={`bi bi-${item.icon} position-absolute end-0 bottom-0 p-3 opacity-25 fs-1`}></i></div></div>))}</div></div>)}
            
            {/* --- TAB 1: QUẢN LÝ TOUR --- */}
            {activeTab === 'tours' && (
              <div className="animation-fade-in">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold"><i className="bi bi-grid-fill text-info me-2"></i>Danh sách Tour ({filteredTours.length})</h4>
                  <button className="btn btn-info text-white rounded-pill px-4" onClick={() => { if(showForm) resetForm(); else setShowForm(true); }}>
                    {showForm ? 'Đóng form' : '+ Thêm mới'}
                  </button>
                </div>
                {showForm && (
                  <div className="card border-0 shadow-sm p-4 mb-4 rounded-4 border-top border-info border-4">
                    <form onSubmit={handleSubmitTour}>
                       <div className="row g-3">
                         <div className="col-md-6"><label className="small fw-bold">Tên Tour *</label><input type="text" className="form-control" name="title" value={formData.title} onChange={handleInputChange} required /></div>
                         <div className="col-md-3"><label className="small fw-bold">Giá *</label><input type="number" className="form-control" name="price" value={formData.price} onChange={handleInputChange} required /></div>
                         <div className="col-md-3"><label className="small fw-bold">Thành phố *</label><input type="text" className="form-control" name="city" value={formData.city} onChange={handleInputChange} required /></div>
                         <div className="col-md-6"><label className="small fw-bold">Hình ảnh *</label><input type="file" className="form-control" onChange={handleFileChange} /></div>
                         <div className="col-md-3"><label className="small fw-bold">Bắt đầu *</label><input type="text" className="form-control" name="startDate" value={formData.startDate} onChange={handleInputChange} required /></div>
                         <div className="col-md-3"><label className="small fw-bold">Kết thúc *</label><input type="text" className="form-control" name="endDate" value={formData.endDate} onChange={handleInputChange} required /></div>
                         
                         <div className="col-md-6">
                           <label className="small fw-bold">Danh mục Tour *</label>
                           <select className="form-select" name="category" value={formData.category} onChange={handleInputChange} required>
                             <option value="" disabled>-- Chọn danh mục --</option>
                             <optgroup label="✈️ Tour Trong Nước">
                               <option value="Miền Tây">Miền Tây</option>
                               <option value="Miền Nam">Miền Nam</option>
                               <option value="Miền Trung">Miền Trung</option>
                               <option value="Miền Bắc">Miền Bắc</option>
                               <option value="Tây Nguyên">Tây Nguyên</option>
                               <option value="Đảo">Biển Đảo</option>
                             </optgroup>
                             <optgroup label="🌍 Tour Quốc Tế">
                               <option value="Châu Á">Châu Á</option>
                               <option value="Châu Âu">Châu Âu</option>
                               <option value="Châu Phi">Châu Phi</option>
                               <option value="Bắc Mỹ">Bắc Mỹ</option>
                               <option value="Nam Mỹ">Nam Mỹ</option>
                               <option value="Châu Đại Dương/Úc">Châu Đại Dương/Úc</option>
                             </optgroup>
                           </select>
                         </div>
                         <div className="col-md-6 d-flex align-items-center pt-4">
                           <div className="form-check form-switch ps-4">
                             <input className="form-check-input form-check-inputFeatured" type="checkbox" id="featuredSwitchForm" name="featured" checked={formData.featured} onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))} />
                             <label className="form-check-label small fw-bold text-danger ms-2 mt-1" htmlFor="featuredSwitchForm">
                               {formData.featured ? 'ĐANG BẬT NỔI BẬT' : 'TẮT NỔI BẬT'}
                             </label>
                           </div>
                         </div>

                         <div className="col-12"><label className="small fw-bold">Mô tả *</label><textarea className="form-control" name="description" value={formData.description} onChange={handleInputChange} rows="2" required></textarea></div>
                       </div>
                       <button type="submit" className="btn btn-info text-white w-100 mt-4 rounded-pill fw-bold">{isEditing ? 'CẬP NHẬT' : 'XÁC NHẬN LƯU'}</button>
                    </form>
                  </div>
                )}
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light text-muted small">
                      <tr><th>ẢNH</th><th>TÊN TOUR</th><th>GIÁ</th><th>DANH MỤC</th><th className="text-center">NỔI BẬT</th><th className="text-center">HÀNH ĐỘNG</th></tr>
                    </thead>
                    <tbody>
                      {filteredTours.map(t => (
                        <tr key={t._id}>
                          <td><img src={resolveImageUrl(t.image)} className="rounded" style={{width:'50px', height:'35px', objectFit:'cover'}} /></td>
                          <td className="fw-bold small">{t.title}</td>
                          <td className="text-danger small">{t.price?.toLocaleString()}đ</td>
                          
                          <td className="small text-muted">{t.category || 'Chưa có'}</td>
                          <td className="text-center">
                            <div className="form-check form-switch d-inline-block">
                              <input className="form-check-input form-check-inputFeatured" type="checkbox" checked={t.featured || false} onChange={() => handleToggleFeatured(t._id, t.featured)} title="Bật/Tắt tin nổi bật" />
                            </div>
                          </td>

                          <td className="text-center">
                            <button className="btn btn-sm btn-outline-primary me-2 rounded-circle" onClick={() => handleEditClick(t)}><i className="bi bi-pencil"></i></button>
                            <button className="btn btn-sm btn-outline-danger rounded-circle" onClick={() => handleDeleteTour(t._id)}><i className="bi bi-trash"></i></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === 'bookings' && (<div className="animation-fade-in card border-0 shadow-sm rounded-4 p-4 overflow-hidden"><h4 className="fw-bold mb-4">Lịch sử đặt tour</h4><div className="table-responsive"><table className="table table-hover align-middle small"><thead className="table-light text-muted"><tr><th>MÃ ĐƠN</th><th>THỜI GIAN</th><th>TOUR</th><th>TIỀN</th><th>TRẠNG THÁI</th><th className="text-center">XỬ LÝ</th></tr></thead><tbody>{filteredBookings.map(b => (<tr key={b._id}><td className="fw-bold">#{b._id.substring(18).toUpperCase()}</td><td><div className="fw-bold">{new Date(b.createdAt).toLocaleDateString('vi-VN')}</div><div className="text-muted" style={{fontSize: '11px'}}>{new Date(b.createdAt).toLocaleTimeString('vi-VN')}</div></td><td className="text-truncate" style={{maxWidth: '180px'}}>{b.tourId?.title}</td><td className="fw-bold text-primary">{b.totalPrice?.toLocaleString()}đ</td><td><span className={`badge rounded-pill ${b.status === 'paid' ? 'bg-success' : b.status === 'cancelled' ? 'bg-danger' : 'bg-warning text-dark'}`}>{b.status === 'paid' ? 'Thành công' : b.status === 'cancelled' ? 'Đã hủy' : 'Chờ duyệt'}</span></td><td className="text-center"><div className="d-flex justify-content-center gap-1">{b.status !== 'paid' && b.status !== 'cancelled' && (<><button className="btn btn-sm btn-success rounded-pill" onClick={() => handleUpdateStatus(b._id, 'paid')}><i className="bi bi-check-lg"></i></button><button className="btn btn-sm btn-danger rounded-pill" onClick={() => handleUpdateStatus(b._id, 'cancelled')}><i className="bi bi-x-lg"></i></button></>)}<button className="btn btn-sm btn-info text-white rounded-pill" onClick={() => setSelectedBooking(b)}><i className="bi bi-eye"></i></button></div></td></tr>))}</tbody></table></div></div>)}
            {activeTab === 'users' && (<div className="animation-fade-in">{showUserForm && (<div className="card border-0 shadow-sm p-4 mb-4 rounded-4 border-top border-info border-4"><form onSubmit={handleSubmitUser}><div className="row g-3"><div className="col-md-4"><label className="small fw-bold">Họ và tên *</label><input type="text" className="form-control" name="name" value={userFormData.name} onChange={handleUserInputChange} required /></div><div className="col-md-4"><label className="small fw-bold">Email *</label><input type="email" className="form-control" name="email" value={userFormData.email} onChange={handleUserInputChange} required disabled={isEditingUser} /></div><div className="col-md-4"><label className="small fw-bold">Số điện thoại</label><input type="text" className="form-control" name="phone" value={userFormData.phone} onChange={handleUserInputChange} /></div>{!isEditingUser && <div className="col-md-6"><label className="small fw-bold">Mật khẩu *</label><input type="password" className="form-control" name="password" value={userFormData.password} onChange={handleUserInputChange} required minLength="6"/></div>}<div className="col-md-6"><label className="small fw-bold">Quyền hạn</label><select className="form-select" name="role" value={userFormData.role} onChange={handleUserInputChange}><option value="user">User</option><option value="admin">Admin</option></select></div></div><button type="submit" className="btn btn-info text-white w-100 mt-4 rounded-pill fw-bold">{isEditingUser ? 'CẬP thự' : 'TẠO MỚI'}</button></form></div>)}<div className="card border-0 shadow-sm rounded-4 p-4 overflow-hidden"><h4 className="fw-bold mb-4">Danh sách thành viên</h4><table className="table table-hover align-middle"><thead className="table-light small"><tr><th>STT</th><th>HỌ TÊN</th><th>EMAIL</th><th>SĐT</th><th>QUYỀN</th><th className="text-center">THAO TÁC</th></tr></thead><tbody>{filteredUsers.map((u, i) => (<tr key={u._id}><td className="text-muted">{i + 1}</td><td className="fw-bold">{u.name}</td><td className="small">{u.email}</td><td className="small">{u.phone || 'N/A'}</td><td><span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>{u.role === 'admin' ? 'Admin' : 'User'}</span></td><td className="text-center"><button className="btn btn-sm btn-outline-primary me-2 rounded-circle" onClick={() => handleEditUserClick(u)}><i className="bi bi-pencil"></i></button><button className="btn btn-sm btn-outline-danger rounded-circle" onClick={() => handleDeleteUser(u._id)}><i className="bi bi-trash"></i></button></td></tr>))}</tbody></table></div></div>)}
            {activeTab === 'revenue' && (<div className="animation-fade-in"><div className="d-flex justify-content-between align-items-center mb-4"><h4 className="fw-bold text-dark"><i className="bi bi-graph-up-arrow text-primary me-2"></i>Báo Cáo Doanh Thu</h4></div><div className="row g-3 mb-4"><div className="col-md-3"><div className="card rev-card rev-card-blue p-4 shadow-sm"><div className="stat-label"><i className="bi bi-currency-dollar"></i> TỔNG DOANH THU</div><div className="stat-value">{revenueData.totalMonth.toLocaleString()} VNĐ</div></div></div><div className="col-md-3"><div className="card rev-card rev-card-grey p-4 shadow-sm"><div className="stat-label text-muted"><i className="bi bi-calendar-check"></i> HÔM NAY</div><div className="stat-value text-dark">{revenueData.totalToday.toLocaleString()} VNĐ</div></div></div><div className="col-md-3"><div className="card rev-card rev-card-teal p-4 shadow-sm"><div className="stat-label"><i className="bi bi-bag-check"></i> ĐƠN HÀNG THÀNH CÔNG</div><div className="stat-value">{revenueData.successCount}</div></div></div><div className="col-md-3"><div className="card rev-card rev-card-white p-4 shadow-sm"><div className="stat-label text-muted"><i className="bi bi-star"></i> TOUR PHỔ BIẾN</div><div className="stat-value text-dark text-truncate" style={{fontSize: '1.2rem'}}>{revenueData.popularTour}</div></div></div></div><div className="card border-0 shadow-sm rounded-4 p-4 bg-white"><h5 className="fw-bold mb-4 border-bottom pb-2">Chi Tiết</h5><div className="table-responsive"><table className="table table-hover align-middle"><thead className="table-light"><tr className="small text-muted"><th>Mã Đơn</th><th>Ngày Đặt</th><th>Tên Tour</th><th>Khách Hàng</th><th>Tổng Tiền</th><th>Trạng Thái</th><th className="text-center">Thao tác</th></tr></thead><tbody>{revenueData.details.map((b, idx) => (<tr key={idx} className="small"><td className="fw-bold text-muted">#{b._id.substring(18).toUpperCase()}</td><td>{new Date(b.createdAt).toLocaleDateString('vi-VN')}</td><td className="fw-bold" style={{maxWidth: '200px'}}>{b.tourId?.title || 'Tour đã xóa'}</td><td>{b.userId?.name || b.name || 'Khách vãng lai'}</td><td className="fw-bold text-primary">{b.totalPrice?.toLocaleString()}</td><td><span className="badge bg-success px-2 py-1 rounded-1">Đã Thanh Toán</span></td><td className="text-center"><button className="btn btn-link btn-sm text-info p-0 text-decoration-none fw-bold" onClick={() => setSelectedBooking(b)}>[Xem]</button></td></tr>))}</tbody></table></div></div></div>)}
          </div>
        </div>
      </div>

      {/* MODAL CHI TIẾT ĐƠN HÀNG ĐÃ THÊM SỐ ĐIỆN THOẠI */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="p-3 bg-info text-white d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">Chi tiết Đơn hàng</h5>
              <button className="btn-close btn-close-white" onClick={() => setSelectedBooking(null)}></button>
            </div>
            <div className="p-4">
              <div className="row mb-3">
                <div className="col-5 text-muted small">Mã đơn:</div>
                <div className="col-7 fw-bold">#{selectedBooking._id.substring(18).toUpperCase()}</div>
              </div>
              <div className="row mb-3">
                <div className="col-5 text-muted small">Thời gian:</div>
                <div className="col-7">{new Date(selectedBooking.createdAt).toLocaleString('vi-VN')}</div>
              </div>
              <div className="row mb-3">
                <div className="col-5 text-muted small">Khách:</div>
                <div className="col-7 fw-bold text-primary">{selectedBooking.userId?.name || selectedBooking.name || 'Khách vãng lai'}</div>
              </div>
              
              {/* THÊM HÀNG HIỂN THỊ SỐ ĐIỆN THOẠI */}
              <div className="row mb-3">
                <div className="col-5 text-muted small">Số điện thoại:</div>
                <div className="col-7 fw-bold text-dark">{selectedBooking.userId?.phone || selectedBooking.phone || 'Chưa cập nhật'}</div>
              </div>

              <div className="row mb-3">
                <div className="col-5 text-muted small">Tour:</div>
                <div className="col-7 fw-bold">{selectedBooking.tourId?.title}</div>
              </div>
              <div className="row mb-3 pb-3 border-bottom">
                <div className="col-5 text-muted small">Tình trạng:</div>
                <div className="col-7">
                  <span className={`badge ${selectedBooking.status === 'paid' ? 'bg-success' : selectedBooking.status === 'cancelled' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                    {selectedBooking.status === 'paid' ? 'Thành công' : selectedBooking.status === 'cancelled' ? 'Đã hủy' : 'Chờ duyệt'}
                  </span>
                </div>
              </div>
              <div className="row align-items-center">
                <div className="col-5 fw-bold">Tổng thanh toán:</div>
                <div className="col-7 fw-bold text-danger fs-4">{selectedBooking.totalPrice?.toLocaleString()} ₫</div>
              </div>
            </div>
            <div className="p-3 bg-light d-flex justify-content-end gap-2 border-top">
              <button className="btn btn-secondary rounded-pill px-4" onClick={() => setSelectedBooking(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;