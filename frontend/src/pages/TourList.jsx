import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function TourList() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5000/api/tours');
        if (res.data.success) {
          setTours(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách tour:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  return (
    <div className="bg-light min-vh-100 pt-5 pb-5">
      {/* Banner nhỏ trên đầu */}
      <div className="bg-dark text-white text-center py-5 mb-5" style={{ background: 'url("https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1500&q=80") center/cover', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}></div>
        <div className="container position-relative z-1 pt-5">
          <h1 className="display-4 fw-bold font_DPTBlacksword mt-4">Danh Sách Tour</h1>
          <p className="fs-5">Khám phá những điểm đến tuyệt vời nhất cùng chúng tôi</p>
        </div>
      </div>

      <div className="container">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-info"></div></div>
        ) : (
          <div className="row g-4">
            {tours.map(tour => (
              <div className="col-12 col-md-6 col-lg-4" key={tour._id}>
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden transition-all hover-scale">
                  <div className="position-relative">
                    <img 
                      src={tour.image} 
                      className="card-img-top" 
                      style={{ height: '250px', objectFit: 'cover' }} 
                      alt={tour.title}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80'; }}
                    />
                    <span className="position-absolute top-0 end-0 bg-info text-white px-3 py-1 m-3 rounded-pill fw-bold small">
                      {tour.duration || '3 Ngày 2 Đêm'}
                    </span>
                  </div>
                  <div className="card-body p-4 d-flex flex-column">
                    <p className="text-muted small mb-2"><i className="bi bi-geo-alt-fill text-danger me-1"></i>{tour.city}</p>
                    <h5 className="card-title fw-bold text-dark mb-3" style={{ height: '50px', overflow: 'hidden' }}>{tour.title}</h5>
                    <div className="mt-auto d-flex justify-content-between align-items-center border-top pt-3">
                      <span className="text-danger fw-bold fs-5">{tour.price.toLocaleString('vi-VN')} ₫</span>
                      <Link to={`/tours/${tour._id}`} className="btn btn-outline-info rounded-pill px-4 fw-bold shadow-sm">
                        Xem chi tiết
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
  );
}

export default TourList;