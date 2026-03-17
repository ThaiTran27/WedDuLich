import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    const fetchTours = async () => {
      const res = await axios.get('http://127.0.0.1:5000/api/tours');
      if (res.data.success) setTours(res.data.data.slice(0, 6)); // Lấy 6 tour tiêu biểu
    };
    fetchTours();
  }, []);

  return (
    <div>
      {/* SECTION 1: HERO BANNER (Giống trang mẫu) */}
      <section className="hero-section position-relative text-white d-flex align-items-center" 
               style={{ height: '70vh', background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1500&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container text-center">
          <h1 className="display-3 fw-bold mb-3 font_DPTBlacksword">Khám phá Việt Nam cùng Thái</h1>
          <p className="fs-4 mb-4">Trải nghiệm những hành trình độc đáo và chuyên nghiệp nhất</p>
          
          {/* THANH TÌM KIẾM NHANH */}
          <div className="bg-white p-2 rounded-pill shadow-lg d-inline-flex align-items-center w-75">
            <input type="text" className="form-control border-0 rounded-pill px-4" placeholder="Bạn muốn đi đâu?" />
            <button className="btn btn-info text-white rounded-pill px-5 fw-bold ms-2 py-2">TÌM KIẾM</button>
          </div>
        </div>
      </section>

      {/* SECTION 2: TOUR NỔI BẬT */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h2 className="fw-bold text-dark mb-0">TOUR BÁN CHẠY NHẤT</h2>
              <div className="bg-info" style={{ height: '4px', width: '60px' }}></div>
            </div>
            <Link to="/tour-trong-nuoc" className="text-info fw-bold text-decoration-none">Xem tất cả <i className="bi bi-arrow-right"></i></Link>
          </div>

          <div className="row g-4">
            {tours.map(tour => (
              <div className="col-12 col-md-4" key={tour._id}>
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-scale transition-all">
                  <div className="position-relative">
                    <img src={tour.image} className="card-img-top" style={{ height: '220px', objectFit: 'cover' }} alt={tour.title} />
                    <span className="position-absolute top-0 start-0 bg-danger text-white px-3 py-1 m-3 rounded-pill fw-bold small">Hot Tour</span>
                  </div>
                  <div className="card-body p-4">
                    <h5 className="card-title fw-bold text-dark mb-3" style={{ height: '50px', overflow: 'hidden' }}>{tour.title}</h5>
                    <div className="d-flex justify-content-between align-items-center border-top pt-3">
                      <span className="text-danger fw-bold fs-5">{tour.price.toLocaleString('vi-VN')} ₫</span>
                      <Link to={`/tours/${tour._id}`} className="btn btn-outline-info rounded-pill px-3 btn-sm fw-bold">Chi tiết</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;