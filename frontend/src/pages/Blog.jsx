import { Link } from 'react-router-dom'; // QUAN TRỌNG: Nhớ import Link

function Blog() {
  const featuredBlog = {
    id: 'featured', // Thêm ID cho bài nổi bật
    title: 'Xuôi dòng Cửu Long: Trải nghiệm du lịch sinh thái Bến Tre chân thực nhất',
    excerpt: 'Rời xa những ồn ào của phố thị, chuyến đi về xứ dừa mang lại một cảm giác bình yên đến lạ. Từ việc ngồi xuồng ba lá len lỏi qua những rặng dừa nước, đến việc thưởng thức kẹo dừa nóng hổi ngay tại lò...',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    date: '15/03/2026',
    author: 'Admin Team'
  };

  const blogs = [
    { id: 1, category: 'Ẩm thực', title: 'Top 10 món ăn đường phố Sài Gòn ăn là ghiền', image: 'https://images.unsplash.com/photo-1555921015-c2848f1c26e4?auto=format&fit=crop&w=800&q=80', date: '12/03/2026' },
    { id: 2, category: 'Kinh nghiệm', title: 'Cẩm nang phượt xe máy Đà Lạt an toàn cho người mới', image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=800&q=80', date: '08/03/2026' },
    { id: 3, category: 'Văn hóa', title: 'Khám phá nét đẹp Hội An qua từng con hẻm nhỏ', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80', date: '01/03/2026' },
  ];

  return (
    <div className="bg-light min-vh-100 pt-5 pb-5 mt-4">
      <div className="container py-5">
        
        {/* BÀI VIẾT NỔI BẬT */}
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden mb-5">
          <div className="row g-0">
            <div className="col-lg-7">
              <img src={featuredBlog.image} className="img-fluid w-100 h-100" style={{ objectFit: 'cover', minHeight: '350px' }} alt="..." />
            </div>
            <div className="col-lg-5 d-flex align-items-center bg-white">
              <div className="card-body p-5">
                <span className="badge bg-info mb-3 px-3 py-2 rounded-pill">Bài viết nổi bật</span>
                <h2 className="card-title fw-bold mb-3">{featuredBlog.title}</h2>
                <p className="card-text text-secondary fs-5 mb-4">{featuredBlog.excerpt}</p>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="small text-muted">
                    <i className="bi bi-person-circle me-2"></i>{featuredBlog.author} <br/>
                    <i className="bi bi-calendar-check me-2"></i>{featuredBlog.date}
                  </div>
                  {/* SỬA NÚT THÀNH LINK Ở ĐÂY */}
                  <Link to={`/blog/${featuredBlog.id}`} className="btn btn-info text-white rounded-pill px-4 fw-bold shadow-sm">
                    Đọc ngay
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DANH SÁCH BÀI VIẾT KHÁC */}
        <h4 className="fw-bold mb-4 border-bottom pb-2">Bài viết mới nhất</h4>
        <div className="row g-4">
          {blogs.map(blog => (
            <div className="col-md-4" key={blog.id}>
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-scale transition-all">
                <div className="position-relative">
                  <img src={blog.image} className="card-img-top" style={{ height: '220px', objectFit: 'cover' }} alt="..." />
                  <span className="position-absolute top-0 start-0 bg-dark text-white px-3 py-1 m-3 rounded-pill fw-bold small opacity-75">{blog.category}</span>
                </div>
                <div className="card-body p-4 d-flex flex-column">
                  <p className="text-muted small mb-2"><i className="bi bi-calendar3 me-2"></i>{blog.date}</p>
                  <h5 className="card-title fw-bold mb-3">{blog.title}</h5>
                  <div className="mt-auto">
                    {/* SỬA NÚT THÀNH LINK Ở ĐÂY */}
                    <Link to={`/blog/${blog.id}`} className="btn btn-link text-info text-decoration-none fw-bold p-0">
                      Xem chi tiết <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Blog;