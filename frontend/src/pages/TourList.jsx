import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { resolveImageUrl } from '../../public/assets/img/index/imagePath';

// BÍ QUYẾT Ở ĐÂY: Hàm chuyển đổi Tiếng Việt có dấu thành không dấu, xóa khoảng trắng thừa
const removeAccents = (str) => {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
};

const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

function TourList() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5000/api/tours');
        if (res.data.success) {
          let fetchedTours = res.data.data;

          // LOGIC LỌC DỮ LIỆU ĐÃ ĐƯỢC BỌC HÀM KHỬ DẤU TIẾNG VIỆT
          if (location.state) {
            if (location.state.city) {
              fetchedTours = fetchedTours.filter(tour => 
                removeAccents(tour.city).includes(removeAccents(location.state.city))
              );
            }
            if (location.state.category) {
              fetchedTours = fetchedTours.filter(tour => 
                removeAccents(tour.category).includes(removeAccents(location.state.category))
              );
            }
            if (location.state.duration) {
              fetchedTours = fetchedTours.filter(tour => 
                removeAccents(tour.duration).includes(removeAccents(location.state.duration))
              );
            }
            if (location.state.search) {
              const searchKey = removeAccents(location.state.search);
              fetchedTours = fetchedTours.filter(tour => 
                removeAccents(tour.title).includes(searchKey) || 
                removeAccents(tour.city).includes(searchKey) ||
                removeAccents(tour.category).includes(searchKey)
              );
            }
          }

          setTours(fetchedTours);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách tour:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, [location.state]);

  // Hàm xóa bộ lọc (Sửa lại để nó giữ nguyên trang hiện tại thay vì nhảy về tour trong nước)
  const clearFilter = () => {
    navigate(location.pathname, { replace: true, state: null });
  };

  const activeFilterKeyword = location.state?.city || location.state?.category || location.state?.duration || location.state?.search;

  return (
    <div className="bg-light min-vh-100 pt-5 pb-5">
      <div className="bg-dark text-white text-center py-5 mb-5" style={{ background: 'url("https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1500&q=80") center/cover', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}></div>
        <div className="container position-relative z-1 pt-5">
          <h1 className="display-4 fw-bold font_DPTBlacksword mt-4">Danh Sách Tour</h1>
          <p className="fs-5">Khám phá những điểm đến tuyệt vời nhất cùng chúng tôi</p>
        </div>
      </div>

      <div className="container">
        
        {activeFilterKeyword && (
          <div className="alert alert-info text-center mx-auto mb-5 border-0 shadow-sm rounded-pill d-flex justify-content-center align-items-center" style={{ maxWidth: '700px' }}>
            <i className="bi bi-funnel-fill me-2"></i>
            Đang lọc kết quả theo: 
            <strong className="mx-2 text-danger">"{activeFilterKeyword}"</strong>
            <button onClick={clearFilter} className="btn btn-sm btn-outline-danger rounded-pill fw-bold ms-3 shadow-none">
              Xóa lọc <i className="bi bi-x-lg"></i>
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-info"></div></div>
        ) : tours.length > 0 ? (
          <div className="row g-4">
            {tours.map(tour => (
              <div className="col-12 col-md-6 col-lg-4" key={tour._id}>
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden transition-all hover-scale">
                  <div className="position-relative">
                    <img 
                      src={resolveImageUrl(tour.image)}
                      className="card-img-top" 
                      style={{ height: '250px', objectFit: 'cover' }} 
                      alt={tour.title}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80'; }}
                    />
                    {tour.featured && (
                      <span className="position-absolute top-0 start-0 bg-danger text-white px-3 py-1 m-3 rounded-pill fw-bold small shadow-sm">
                        <i className="bi bi-fire me-1"></i> Nổi bật
                      </span>
                    )}
                    <span className="position-absolute top-0 end-0 bg-info text-white px-3 py-1 m-3 rounded-pill fw-bold small shadow-sm">
                      {tour.duration || '3 Ngày 2 Đêm'}
                    </span>
                  </div>
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <p className="text-muted small mb-0"><i className="bi bi-geo-alt-fill text-danger me-1"></i>{tour.city}</p>
                      <span className="badge bg-light text-secondary border">{tour.category || 'Tour Việt'}</span>
                    </div>
                    
                    <h5 className="card-title fw-bold text-dark mb-3" style={{ height: '50px', overflow: 'hidden' }}>{tour.title}</h5>
                    <div className="mt-auto d-flex justify-content-between align-items-center border-top pt-3">
                      <span className="text-danger fw-bold fs-5">{tour.price.toLocaleString('vi-VN')} ₫</span>
                      <Link to={`/tours/${slugify(tour.title)}-${tour._id}.html`} className="btn btn-outline-info rounded-pill px-4 fw-bold shadow-sm">
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <i className="bi bi-search text-muted" style={{ fontSize: '4rem', opacity: '0.3' }}></i>
            <h4 className="fw-bold mt-3 text-secondary">Rất tiếc, chưa tìm thấy tour!</h4>
            <p className="text-muted mb-4">Hiện tại hệ thống chưa có tour nào thuộc danh mục <strong className="text-danger">"{activeFilterKeyword}"</strong>.</p>
            <button onClick={clearFilter} className="btn btn-info text-white rounded-pill px-5 py-2 fw-bold shadow-sm">
              <i className="bi bi-arrow-repeat me-2"></i> Xem toàn bộ Tour
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TourList;