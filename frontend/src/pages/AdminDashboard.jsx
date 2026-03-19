import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { resolveImageUrl } from '../../public/assets/img/index/imagePath';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('tours');
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // BỘ LỌC THỜI GIAN: 'all', 'day', 'month'
  const [filterType, setFilterType] = useState('all');

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    _id: '', title: '', city: '', price: '', duration: '', image: '', description: '', availableSeats: 20, startDate: '', endDate: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const tourRes = await axios.get('http://127.0.0.1:5000/api/tours');
      setTours(tourRes.data.success ? tourRes.data.data : (tourRes.data || []));

      const bookRes = await axios.get('http://127.0.0.1:5000/api/bookings');
      if (bookRes.data.success) setBookings(bookRes.data.data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC LỌC ĐƠN HÀNG THEO THỜI GIAN ---
  const filteredBookings = useMemo(() => {
    const today = new Date();
    return bookings.filter(b => {
      const bDate = new Date(b.createdAt);
      if (filterType === 'day') {
        return bDate.toDateString() === today.toDateString();
      }
      if (filterType === 'month') {
        return bDate.getMonth() === today.getMonth() && bDate.getFullYear() === today.getFullYear();
      }
      return true; // 'all'
    });
  }, [bookings, filterType]);

  // --- LOGIC TÍNH TOÁN DOANH THU & BIỂU ĐỒ CSS NHÀ LÀM ---
  const stats = useMemo(() => {
    const paid = filteredBookings.filter(b => b.status === 'paid');
    const totalRevenue = paid.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const totalGuests = paid.reduce((sum, b) => sum + (b.guestSize || 0), 0);
    
    const tourStats = paid.reduce((acc, b) => {
      const title = b.tourId?.title || 'Khác';
      acc[title] = (acc[title] || 0) + (b.totalPrice || 0);
      return acc;
    }, {});

    const chartData = Object.entries(tourStats).map(([name, value]) => ({ name, value }));
    const maxVal = Math.max(...chartData.map(d => d.value), 1); 

    return { totalRevenue, totalGuests, count: paid.length, chartData, maxVal };
  }, [filteredBookings]);

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData(prev => ({ ...prev, image: `/assets/img/index/${file.name}` }));
  };

  const resetForm = () => {
    setFormData({ _id: '', title: '', city: '', price: '', duration: '', image: '', description: '', availableSeats: 20, startDate: '', endDate: '' });
    setIsEditing(false);
    setShowForm(false);
  };

  const handleEditClick = (tour) => {
    setFormData({
      _id: tour._id, title: tour.title, city: tour.city, price: tour.price, duration: tour.duration,
      image: tour.image, description: tour.description, availableSeats: tour.availableSeats,
      startDate: tour.startDate || '', endDate: tour.endDate || ''
    });
    setIsEditing(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteTour = async (id) => {
    if (window.confirm('Thái có chắc muốn xóa Tour này không?')) {
      try {
        await axios.delete(`http://127.0.0.1:5000/api/tours/${id}`);
        alert('Đã xóa thành công!');
        fetchData();
      } catch (error) {
        alert('Lỗi khi xóa tour!');
      }
    }
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

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><div className="spinner-border text-info"></div></div>;

  return (
    <div className="bg-light pb-5" style={{ paddingTop: '90px', minHeight: '100vh' }}>
      <div className="container-fluid px-4 mt-4">
        <div className="row g-4">
          
          {/* SIDEBAR */}
          <div className="col-12 col-lg-3 col-xl-2">
            <div className="bg-dark text-white rounded-4 shadow-sm overflow-hidden sticky-top" style={{top: '100px'}}>
              <div className="p-4 text-center border-bottom border-secondary">
                <div className="bg-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{width:'50px', height:'50px'}}><i className="bi bi-person-badge fs-3 text-info"></i></div>
                <h6 className="fw-bold mb-0 small">ADMIN PORTAL</h6>
              </div>
              <div className="py-2">
                <div className={`p-3 cursor-pointer ${activeTab === 'tours' ? 'bg-info' : ''}`} onClick={() => setActiveTab('tours')} style={{cursor: 'pointer'}}><i className="bi bi-map me-2"></i> Quản lý Tour</div>
                <div className={`p-3 cursor-pointer ${activeTab === 'bookings' ? 'bg-info' : ''}`} onClick={() => setActiveTab('bookings')} style={{cursor: 'pointer'}}><i className="bi bi-receipt me-2"></i> Đơn Đặt Tour</div>
                <div className={`p-3 cursor-pointer ${activeTab === 'revenue' ? 'bg-info' : ''}`} onClick={() => setActiveTab('revenue')} style={{cursor: 'pointer'}}><i className="bi bi-graph-up-arrow me-2"></i> Doanh Thu</div>
              </div>
            </div>
          </div>

          {/* NỘI DUNG CHÍNH */}
          <div className="col-12 col-lg-9 col-xl-10">
            
            {/* BỘ LỌC THỜI GIAN */}
            {(activeTab === 'bookings' || activeTab === 'revenue') && (
              <div className="d-flex justify-content-end mb-4">
                <div className="bg-white p-1 rounded-pill shadow-sm border d-flex gap-1">
                  <button onClick={() => setFilterType('all')} className={`btn btn-sm rounded-pill px-3 ${filterType === 'all' ? 'btn-info text-white' : 'btn-light'}`}>Tất cả</button>
                  <button onClick={() => setFilterType('day')} className={`btn btn-sm rounded-pill px-3 ${filterType === 'day' ? 'btn-info text-white' : 'btn-light'}`}>Trong ngày</button>
                  <button onClick={() => setFilterType('month')} className={`btn btn-sm rounded-pill px-3 ${filterType === 'month' ? 'btn-info text-white' : 'btn-light'}`}>Trong tháng</button>
                </div>
              </div>
            )}

            {/* TAB 1: QUẢN LÝ TOUR */}
            {activeTab === 'tours' && (
              <div className="animation-fade-in">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold"><i className="bi bi-grid-fill text-info me-2"></i>Danh sách Tour</h4>
                  <button className="btn btn-info text-white rounded-pill px-4" onClick={() => { if(showForm) resetForm(); else setShowForm(true); }}>
                    {showForm ? 'Đóng' : 'Thêm mới'}
                  </button>
                </div>
                {showForm && (
                  <div className="card border-0 shadow-sm p-4 mb-4 rounded-4 border-top border-info border-4">
                    <form onSubmit={handleSubmitTour}>
                       <div className="row g-3">
                         <div className="col-md-6"><label className="small fw-bold">Tên Tour *</label><input type="text" className="form-control" name="title" value={formData.title} onChange={handleInputChange} required /></div>
                         <div className="col-md-3"><label className="small fw-bold">Giá *</label><input type="number" className="form-control" name="price" value={formData.price} onChange={handleInputChange} required /></div>
                         <div className="col-md-3"><label className="small fw-bold">Thành phố *</label><input type="text" className="form-control" name="city" value={formData.city} onChange={handleInputChange} required /></div>
                         <div className="col-md-6"><label className="small fw-bold">Hình ảnh (Chọn từ file) *</label><input type="file" className="form-control" onChange={handleFileChange} /></div>
                         <div className="col-md-3"><label className="small fw-bold">Bắt đầu *</label><input type="text" className="form-control" name="startDate" value={formData.startDate} onChange={handleInputChange} required /></div>
                         <div className="col-md-3"><label className="small fw-bold">Kết thúc *</label><input type="text" className="form-control" name="endDate" value={formData.endDate} onChange={handleInputChange} required /></div>
                         <div className="col-12"><label className="small fw-bold">Mô tả *</label><textarea className="form-control" name="description" value={formData.description} onChange={handleInputChange} rows="2" required></textarea></div>
                       </div>
                       <button type="submit" className="btn btn-info text-white w-100 mt-4 rounded-pill fw-bold">{isEditing ? 'CẬP NHẬT' : 'XÁC NHẬN LƯU'}</button>
                    </form>
                  </div>
                )}
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light text-muted small"><tr><th>ẢNH</th><th>TÊN TOUR</th><th>GIÁ</th><th className="text-center">HÀNH ĐỘNG</th></tr></thead>
                    <tbody>
                      {tours.map(t => (
                        <tr key={t._id}>
                          <td><img src={resolveImageUrl(t.image)} className="rounded" style={{width:'50px', height:'35px', objectFit:'cover'}} /></td>
                          <td className="fw-bold">{t.title}</td>
                          <td className="text-danger fw-bold">{t.price?.toLocaleString()}đ</td>
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

            {/* TAB 2: QUẢN LÝ ĐƠN HÀNG */}
            {activeTab === 'bookings' && (
              <div className="animation-fade-in card border-0 shadow-sm rounded-4 p-4 overflow-hidden">
                <h4 className="fw-bold mb-4">Đơn đặt tour</h4>
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light text-muted small">
                      <tr>
                        <th>MÃ ĐƠN</th>
                        <th>THỜI GIAN ĐẶT</th>
                        <th>TOUR</th>
                        <th>KHÁCH</th>
                        <th>TỔNG TIỀN</th>
                        <th>TRẠNG THÁI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map(b => (
                        <tr key={b._id}>
                          <td className="fw-bold">#{b._id.substring(18).toUpperCase()}</td>
                          <td className="small">
                            <div className="text-dark fw-bold">{new Date(b.createdAt).toLocaleDateString('vi-VN')}</div>
                            <div className="text-muted" style={{fontSize: '11px'}}>{new Date(b.createdAt).toLocaleTimeString('vi-VN')}</div>
                          </td>
                          <td className="text-truncate" style={{maxWidth: '180px'}}>{b.tourId?.title}</td>
                          <td className="text-center">{b.guestSize}</td>
                          <td className="fw-bold text-primary">{b.totalPrice?.toLocaleString()}đ</td>
                          <td><span className={`badge rounded-pill ${b.status === 'paid' ? 'bg-success' : 'bg-warning text-dark'}`}>{b.status === 'paid' ? 'Đã thu' : 'Chờ'}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: DOANH THU (BIỂU ĐỒ NHÀ LÀM) */}
            {activeTab === 'revenue' && (
              <div className="animation-fade-in">
                <div className="row g-4 mb-4">
                  <div className="col-md-5">
                    <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-primary text-white position-relative overflow-hidden">
                       <h5 className="fw-bold opacity-75">Thực thu</h5>
                       <h1 className="fw-bold mb-3" style={{fontSize: '3rem'}}>{stats.totalRevenue.toLocaleString()} ₫</h1>
                       <div className="d-flex gap-4 border-top border-white border-opacity-25 pt-3 mt-3">
                          <div><small className="opacity-75">Số đơn</small><h5 className="mb-0 fw-bold">{stats.count}</h5></div>
                          <div><small className="opacity-75">Số khách</small><h5 className="mb-0 fw-bold">{stats.totalGuests}</h5></div>
                       </div>
                       <i className="bi bi-graph-up-arrow position-absolute end-0 bottom-0 opacity-25 p-3" style={{fontSize: '6rem'}}></i>
                    </div>
                  </div>
                  
                  <div className="col-md-7">
                    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                      <h6 className="fw-bold mb-4 text-secondary">Doanh thu theo Tour</h6>
                      <div className="d-flex align-items-end justify-content-around h-100 pb-2" style={{minHeight: '220px'}}>
                        {stats.chartData.length > 0 ? stats.chartData.map((item, idx) => (
                          <div key={idx} className="text-center d-flex flex-column align-items-center" style={{flex: 1, maxWidth: '60px'}}>
                            <div className="bg-info rounded-top shadow-sm transition-all" 
                                 style={{ 
                                   height: `${(item.value / stats.maxVal) * 160}px`, 
                                   width: '70%', minHeight: '4px',
                                   background: 'linear-gradient(to top, #0dcaf0, #0aa2c0)'
                                 }}
                                 title={item.name + ': ' + item.value.toLocaleString() + 'đ'}>
                            </div>
                            <div className="mt-2 text-truncate w-100 px-1" style={{fontSize: '10px', color: '#666'}} title={item.name}>{item.name}</div>
                          </div>
                        )) : <p className="text-muted w-100 text-center">Chưa có dữ liệu.</p>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                  <h6 className="fw-bold mb-3 border-bottom pb-2">Bảng xếp hạng Tour</h6>
                  <div className="table-responsive">
                    <table className="table table-borderless table-sm">
                      <tbody>
                        {stats.chartData.sort((a,b) => b.value - a.value).map((item, idx) => (
                          <tr key={idx}>
                            <td className="py-2 text-muted small">#{idx + 1}</td>
                            <td className="py-2 fw-bold small">{item.name}</td>
                            <td className="py-2 text-end text-danger fw-bold small">{item.value.toLocaleString()} ₫</td>
                            <td className="py-2" style={{width: '120px'}}>
                               <div className="progress" style={{height: '6px', marginTop: '8px'}}>
                                  <div className="progress-bar bg-success" style={{width: `${(item.value / (stats.totalRevenue || 1)) * 100}%`}}></div>
                               </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;