import { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [tours, setTours] = useState([]);
  const [formData, setFormData] = useState({ title: '', city: '', price: 0, duration: '', image: '', description: '' });
  const [editingId, setEditingId] = useState(null); // Để biết đang Sửa hay đang Thêm mới

  const API_URL = 'http://127.0.0.1:5000/api/tours';

  // 1. Lấy danh sách Tour từ Backend
  const fetchTours = async () => {
    try {
      const res = await axios.get(API_URL);
      if (res.data.success) setTours(res.data.data);
    } catch (err) {
      console.error("Lỗi tải danh sách:", err);
    }
  };

  useEffect(() => { fetchTours(); }, []);

  // 2. Xử lý thay đổi Input trong Form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Thêm hoặc Cập nhật Tour
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Nếu có ID -> Đang ở chế độ Sửa (PUT)
        await axios.put(`${API_URL}/${editingId}`, formData);
        alert("Cập nhật thành công!");
      } else {
        // Nếu không có ID -> Thêm mới (POST)
        await axios.post(API_URL, formData);
        alert("Thêm tour mới thành công!");
      }
      setFormData({ title: '', city: '', price: 0, duration: '', image: '', description: '' });
      setEditingId(null);
      fetchTours(); // Load lại danh sách
    } catch (err) {
      alert("Có lỗi xảy ra,kiểm tra lại Backend nhé!");
    }
  };

  // 4. Xử lý Xóa Tour
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tour này không? Hành động này không thể hoàn tác!")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchTours();
      } catch (err) {
        alert("Xóa thất bại!");
      }
    }
  };

  // 5. Đưa dữ liệu lên Form để Sửa
  const startEdit = (tour) => {
    setEditingId(tour._id);
    setFormData({
      title: tour.title,
      city: tour.city,
      price: tour.price,
      duration: tour.duration,
      image: tour.image,
      description: tour.description
    });
    window.scrollTo(0, 0); // Cuộn lên đầu trang để thấy Form
  };

  return (
    <div className="container py-5 mt-5">
      <h2 className="fw-bold text-info mb-4 text-center">QUẢN TRỊ VIÊN - QUẢN LÝ TOUR</h2>

      {/* FORM THÊM / SỬA */}
      <div className="card shadow-sm border-0 rounded-4 p-4 mb-5 bg-white">
        <h4 className="fw-bold mb-3">{editingId ? "Cập nhật Tour" : "Thêm Tour Mới"}</h4>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Tên Tour</label>
            <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <label className="form-label fw-bold">Thành phố</label>
            <input type="text" name="city" className="form-control" value={formData.city} onChange={handleChange} />
          </div>
          <div className="col-md-3">
            <label className="form-label fw-bold">Giá (VNĐ)</label>
            <input type="number" name="price" className="form-control" value={formData.price} onChange={handleChange} required />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-bold">Thời gian (VD: 3 ngày 2 đêm)</label>
            <input type="text" name="duration" className="form-control" value={formData.duration} onChange={handleChange} />
          </div>
          <div className="col-md-8">
            <label className="form-label fw-bold">Link hình ảnh (URL)</label>
            <input type="text" name="image" className="form-control" value={formData.image} onChange={handleChange} />
          </div>
          <div className="col-12">
            <label className="form-label fw-bold">Mô tả lịch trình</label>
            <textarea name="description" className="form-control" rows="3" value={formData.description} onChange={handleChange}></textarea>
          </div>
          <div className="col-12 text-end">
            {editingId && <button type="button" className="btn btn-secondary me-2" onClick={() => {setEditingId(null); setFormData({title:'', city:'', price:0, duration:'', image:'', description:''})}}>Hủy</button>}
            <button type="submit" className="btn btn-info text-white fw-bold px-4">{editingId ? "Lưu thay đổi" : "Thêm vào danh sách"}</button>
          </div>
        </form>
      </div>

      {/* BẢNG DANH SÁCH TOUR */}
      <div className="table-responsive bg-white shadow-sm rounded-4 p-3">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Hình ảnh</th>
              <th>Tên Tour</th>
              <th>Giá</th>
              <th className="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {tours.map(tour => (
              <tr key={tour._id}>
                <td><img src={tour.image} alt="" style={{ width: '80px', height: '50px', objectFit: 'cover' }} className="rounded" /></td>
                <td className="fw-bold">{tour.title}</td>
                <td className="text-danger fw-bold">{tour.price.toLocaleString()} ₫</td>
                <td className="text-center">
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(tour)}>
                    <i className="bi bi-pencil-square"></i> Sửa
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(tour._id)}>
                    <i className="bi bi-trash"></i> Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;