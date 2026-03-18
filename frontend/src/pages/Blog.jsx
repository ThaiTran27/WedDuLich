import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios'; // THÊM DÒNG NÀY

function Blog() {
  const categories = ['Tất cả', 'Cẩm Nang Du Lịch', 'Đặc Sản Miền Tây', 'Địa Điểm Du Lịch', 'Văn Hóa Miền Tây'];
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  
  // ---> KHAI BÁO STATE CHO BLOG <---
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---> HÀM GỌI API LẤY BLOG TỪ MONGODB <---
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5000/api/blogs');
        if (res.data.success) {
          setBlogs(res.data.data);
        }
      } catch (error) {
        console.error('Lỗi lấy blog:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const location = useLocation();
  useEffect(() => {
    if (location.state && location.state.category) {
      setActiveCategory(location.state.category);
    } else {
      setActiveCategory('Tất cả');
    }
  }, [location.state]);

  const filteredBlogs = activeCategory === 'Tất cả' 
    ? blogs 
    : blogs.filter(blog => blog.category === activeCategory);

  return (
    <div className="bg-light pb-5" style={{ minHeight: '100vh', paddingTop: '70px' }}>
      
      {/* KHU VỰC BANNER (Giữ nguyên như cũ) */}
      <div className="position-relative d-flex align-items-center" style={{ height: '420px', background: 'url("https://images.unsplash.com/photo-1596423735880-5ec80c550cc4?auto=format&fit=crop&w=1500&q=80") center/cover no-repeat' }}>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}></div>
        <div className="container position-relative z-1 text-white text-start">
          <div style={{ maxWidth: '750px' }}>
            <h1 className="fw-bold display-4 mb-3">Blog Du Lịch – Du Lịch Việt</h1>
            <p className="fs-5" style={{ lineHeight: '1.6', opacity: '0.95' }}>Khám phá kinh nghiệm du lịch, mẹo hay, điểm đến nổi bật và hướng dẫn chi tiết cho chuyến đi của bạn.</p>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        {/* THANH LỌC DANH MỤC */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div className="d-flex flex-wrap gap-2">
            {categories.map((cat, index) => (
              <button 
                key={index}
                onClick={() => setActiveCategory(cat)}
                className={`btn rounded-pill px-4 py-2 fw-bold transition-all ${
                  activeCategory === cat 
                  ? 'btn-info text-white shadow-sm' 
                  : 'bg-white border-0 text-secondary hover-bg-light shadow-sm' 
                }`}
                style={{ fontSize: '14px' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* LƯỚI BÀI VIẾT TỪ DATABASE */}
        {loading ? (
           <div className="text-center py-5"><div className="spinner-border text-info"></div></div>
        ) : (
          <div className="row g-4 mt-2">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map(blog => (
                <div className="col-12 col-md-6 col-lg-4" key={blog._id}> {/* Đổi .id thành ._id của MongoDB */}
                  <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden transition-all hover-scale" style={{ cursor: 'pointer' }}>
                    <div className="position-relative">
                      <img src={blog.image} className="card-img-top" style={{ height: '220px', objectFit: 'cover' }} alt={blog.title} />
                      <span className="position-absolute top-0 start-0 bg-dark text-white px-3 py-1 m-3 rounded-pill fw-bold small opacity-75">
                        {blog.category}
                      </span>
                    </div>
                    <div className="card-body p-4 d-flex flex-column">
                      <h5 className="card-title fw-bold mb-3" style={{ lineHeight: '1.4' }}>{blog.title}</h5>
                      <p className="card-text text-secondary small" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {blog.excerpt}
                      </p>
                      <div className="mt-auto pt-3 border-top">
                        <Link to={`/blog/${blog._id}`} className="btn btn-link text-info text-decoration-none fw-bold p-0"> {/* Sửa lại Link để nhận _id */}
                          Xem chi tiết <i className="bi bi-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <h5 className="text-muted">Chưa có bài viết nào trong chuyên mục này.</h5>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Blog;