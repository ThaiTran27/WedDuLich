import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { resolveImageUrl } from '../utils/imagePath'; // Đảm bảo đường dẫn này đúng

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

// Hàm loại bỏ dấu tiếng Việt để tìm kiếm chính xác hơn
const removeAccents = (str) => {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
};

const slugify = (text) => {
  if (!text) return '';
  return text.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
};

function TourList() {
  const [allTours, setAllTours] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();

  // --- STATE QUẢN LÝ BỘ LỌC ---
  // Lấy dữ liệu từ trang chủ truyền qua (nếu có)
  const initialCategory = location.state?.category || 'all';
  const initialSearch = location.state?.search || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  // --- FETCH API ---
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/tours`);
        if (res.data.success) {
          setAllTours(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách tour:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
    window.scrollTo(0, 0);
  }, []);

  // Đặt lại state nếu location.state thay đổi (người dùng bấm từ trang chủ sang)
  useEffect(() => {
    if (location.state?.category) setCategory(location.state.category);
    if (location.state?.search) setSearchTerm(location.state.search);
  }, [location.state]);

  // --- LOGIC LỌC DỮ LIỆU REAL-TIME ---
  const filteredTours = useMemo(() => {
    let result = [...allTours];

    // 1. Lọc theo từ khóa tìm kiếm (Text input)
    if (searchTerm) {
      const searchKey = removeAccents(searchTerm);
      result = result.filter(tour => 
        removeAccents(tour.title).includes(searchKey) || 
        removeAccents(tour.city).includes(searchKey)
      );
    }

    // 2. Lọc theo danh mục (Radio)
    if (category !== 'all') {
      result = result.filter(tour => 
        removeAccents(tour.category).includes(removeAccents(category))
      );
    }

    // 3. Lọc theo khoảng giá
    if (priceRange === 'under3') {
      result = result.filter(tour => tour.price < 3000000);
    } else if (priceRange === '3to7') {
      result = result.filter(tour => tour.price >= 3000000 && tour.price <= 7000000);
    } else if (priceRange === 'over7') {
      result = result.filter(tour => tour.price > 7000000);
    }

    // 4. Sắp xếp
    if (sortOrder === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [allTours, searchTerm, category, priceRange, sortOrder]);

  // Hàm xóa bộ lọc
  const clearFilter = () => {
    setSearchTerm('');
    setCategory('all');
    setPriceRange('all');
    setSortOrder('newest');
    // Xóa state trong history để URL sạch sẽ
    navigate(location.pathname, { replace: true, state: null });
  };

  return (
    <div className="bg-light pb-5" style={{ minHeight: '100vh', fontFamily: "'Montserrat', sans-serif" }}>
      <style>
        {`
          .search-hero { background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop') center/cover; padding: 120px 0 80px; color: white; margin-top: -85px; }
          .filter-sidebar { position: sticky; top: 100px; }
          .tour-card { border-radius: 20px; overflow: hidden; border: none; transition: all 0.3s; background: white; height: 100%; display: flex; flex-direction: column; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
          .tour-card:hover { transform: translateY(-8px); box-shadow: 0 15px 30px rgba(0,0,0,0.15); }
          .tour-img-box { position: relative; height: 240px; overflow: hidden; }
          .tour-img-box img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
          .tour-card:hover .tour-img-box img { transform: scale(1.08); }
          .hot-badge { position: absolute; top: 15px; left: 15px; background: linear-gradient(45deg, #ff4757, #ff6b81); color: white; font-size: 11px; font-weight: 800; padding: 5px 15px; border-radius: 30px; z-index: 2; box-shadow: 0 4px 10px rgba(255,71,87,0.3); text-transform: uppercase; }
          
          /* CSS Custom cho Radio Button Xịn xò */
          .custom-radio { display: none; }
          .custom-radio-label { display: flex; align-items: center; cursor: pointer; padding: 8px 12px; border-radius: 8px; transition: 0.2s; color: #495057; }
          .custom-radio-label:hover { background: #f8f9fa; }
          .custom-radio-label::before { content: ''; width: 18px; height: 18px; border: 2px solid #ced4da; border-radius: 50%; margin-right: 10px; transition: 0.2s; }
          .custom-radio:checked + .custom-radio-label { color: #0dcaf0; font-weight: 700; background: #e0f2fe; }
          .custom-radio:checked + .custom-radio-label::before { border-color: #0dcaf0; background: #0dcaf0; box-shadow: inset 0 0 0 3px white; }
        `}
      </style>

      {/* HERO SECTION */}
      <section className="search-hero text-center mb-5">
        <div className="container mt-4">
          <h1 className="fw-black" style={{ fontSize: '3.5rem', fontWeight: '900', letterSpacing: '1px' }}>TÌM KIẾM HÀNH TRÌNH</h1>
          <p className="fs-5 opacity-90 mt-2">Khám phá hơn {allTours.length} tour du lịch đang chờ bạn trải nghiệm</p>
        </div>
      </section>

      <div className="container">
        <div className="row g-4">
          
          {/* ================= CỘT TRÁI: BỘ LỌC (SIDEBAR) ================= */}
          <div className="col-12 col-lg-3">
            <div className="filter-sidebar bg-white p-4 rounded-4 shadow-sm border border-light">
              <h5 className="fw-bold mb-4 border-bottom pb-3"><i className="bi bi-funnel-fill text-info me-2"></i> Lọc Kết Quả</h5>
              
              {/* Lọc theo từ khóa */}
              <div className="mb-4">
                <label className="fw-bold small text-muted mb-2 text-uppercase">Từ khóa tìm kiếm</label>
                <div className="input-group shadow-sm rounded-3 overflow-hidden border">
                  <span className="input-group-text bg-white border-0"><i className="bi bi-search text-muted"></i></span>
                  <input type="text" className="form-control border-0 shadow-none px-0" placeholder="Nhập điểm đến..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>

              {/* Lọc theo danh mục */}
              <div className="mb-4">
                <label className="fw-bold small text-muted mb-2 text-uppercase">Danh mục Tour</label>
                <div className="d-flex flex-column gap-1">
                  {['all', 'Miền Bắc', 'Miền Trung', 'Miền Nam', 'Miền Tây', 'Đảo'].map(cat => (
                    <div key={cat}>
                      <input className="custom-radio" type="radio" name="category" id={`cat-${cat}`} value={cat} checked={category === cat} onChange={(e) => setCategory(e.target.value)} />
                      <label className="custom-radio-label" htmlFor={`cat-${cat}`}>
                        {cat === 'all' ? 'Tất cả danh mục' : `Tour ${cat}`}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lọc theo giá */}
              <div className="mb-5">
                <label className="fw-bold small text-muted mb-2 text-uppercase">Mức giá</label>
                <div className="d-flex flex-column gap-1">
                  <div key="price-all">
                    <input className="custom-radio" type="radio" name="price" id="price-all" value="all" checked={priceRange === 'all'} onChange={(e) => setPriceRange(e.target.value)} />
                    <label className="custom-radio-label" htmlFor="price-all">Tất cả mức giá</label>
                  </div>
                  <div key="price-under3">
                    <input className="custom-radio" type="radio" name="price" id="price-under3" value="under3" checked={priceRange === 'under3'} onChange={(e) => setPriceRange(e.target.value)} />
                    <label className="custom-radio-label" htmlFor="price-under3">Dưới 3,000,000 ₫</label>
                  </div>
                  <div key="price-3to7">
                    <input className="custom-radio" type="radio" name="price" id="price-3to7" value="3to7" checked={priceRange === '3to7'} onChange={(e) => setPriceRange(e.target.value)} />
                    <label className="custom-radio-label" htmlFor="price-3to7">Từ 3 - 7 Triệu ₫</label>
                  </div>
                  <div key="price-over7">
                    <input className="custom-radio" type="radio" name="price" id="price-over7" value="over7" checked={priceRange === 'over7'} onChange={(e) => setPriceRange(e.target.value)} />
                    <label className="custom-radio-label" htmlFor="price-over7">Trên 7,000,000 ₫</label>
                  </div>
                </div>
              </div>

              {/* Nút Xóa Bộ Lọc */}
              <button className="btn btn-outline-danger w-100 rounded-pill fw-bold shadow-sm" onClick={clearFilter}>
                XÓA BỘ LỌC
              </button>
            </div>
          </div>

          {/* ================= CỘT PHẢI: KẾT QUẢ TÌM KIẾM ================= */}
          <div className="col-12 col-lg-9">
            
            {/* Thanh Sắp xếp */}
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center bg-white p-3 rounded-4 shadow-sm border mb-4 gap-3">
              <div>
                <span className="fw-bold text-dark">Tìm thấy: <span className="text-info fs-5 mx-1">{filteredTours.length}</span> hành trình phù hợp</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="small fw-bold text-muted text-nowrap d-none d-md-block">Sắp xếp:</span>
                <select className="form-select form-select-sm border-info shadow-none rounded-pill px-3 py-2 fw-bold text-info" style={{width: '200px'}} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                  <option value="newest">Mới cập nhật</option>
                  <option value="priceAsc">Giá: Thấp đến Cao</option>
                  <option value="priceDesc">Giá: Cao xuống Thấp</option>
                </select>
              </div>
            </div>

            {/* Danh sách Tour */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-info" style={{width: '3rem', height: '3rem'}}></div>
                <p className="mt-3 text-muted fw-bold">Đang phân tích dữ liệu...</p>
              </div>
            ) : filteredTours.length === 0 ? (
              <div className="text-center py-5 bg-white rounded-4 shadow-sm border mt-4">
                <i className="bi bi-search text-muted opacity-25" style={{fontSize: '5rem'}}></i>
                <h3 className="fw-bold text-secondary mt-3">Không tìm thấy tour phù hợp</h3>
                <p className="text-muted">Thử thay đổi bộ lọc hoặc xóa các tùy chọn hiện tại để xem thêm tour.</p>
                <button className="btn btn-info text-white rounded-pill px-5 mt-2 fw-bold shadow-sm" onClick={clearFilter}>
                  Xem tất cả Tour
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {filteredTours.map((tour) => (
                  <div className="col-12 col-md-6 col-xl-4" key={tour._id}>
                    <div className="tour-card">
                      <div className="tour-img-box">
                        {tour.featured && <div className="hot-badge"><i className="bi bi-lightning-fill me-1"></i> BÁN CHẠY</div>}
                        <span className="position-absolute top-0 end-0 bg-dark text-white px-3 py-1 m-3 rounded-pill fw-bold small opacity-75 shadow-sm" style={{fontSize: '11px', zIndex: 2}}>
                          {tour.duration}
                        </span>
                        <img src={resolveImageUrl(tour.image)} alt={tour.title} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=500&q=80'; }} />
                      </div>
                      <div className="p-4 d-flex flex-column flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-2 small fw-bold">
                          <span className="text-muted"><i className="bi bi-geo-alt-fill text-danger me-1"></i> {tour.city}</span>
                          <span className="badge bg-light text-info border border-info">{tour.category || 'Tour Việt'}</span>
                        </div>
                        <h5 className="fw-bold mb-3 text-dark flex-grow-1" style={{lineHeight: '1.5', fontSize: '1.15rem'}}>{tour.title}</h5>
                        <div className="d-flex justify-content-between align-items-end mt-auto pt-3 border-top">
                          <div>
                            <small className="text-muted d-block" style={{fontSize: '11px', fontWeight: '700'}}>Giá trọn gói</small>
                            <span className="fw-bold text-danger fs-5">{tour.price?.toLocaleString('vi-VN')} đ</span>
                          </div>
                          <Link to={`/tours/${slugify(tour.title)}-${tour._id}.html`} className="btn btn-info text-white rounded-pill px-4 py-2 fw-bold shadow-sm" style={{fontSize: '14px'}}>
                            Chi tiết
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TourList;