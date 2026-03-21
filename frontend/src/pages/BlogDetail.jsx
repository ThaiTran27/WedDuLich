import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { resolveImageUrl } from '../../public/assets/img/index/imagePath'; // Đã sửa lại đường dẫn import cho đúng cấu trúc của bạn

function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:5000/api/blogs/${id}`);
        const data = res.data?.data || res.data;
        setBlog(data);
      } catch (err) {
        setError('Không tìm thấy bài viết hoặc lỗi kết nối tới server.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="spinner-border text-info" style={{ width: '3rem', height: '3rem' }}></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="text-center py-5 mt-5">
        <h2 className="fw-bold text-secondary">{error || 'Không tìm thấy bài viết!'}</h2>
        <Link to="/blog" className="btn btn-info text-white mt-3 rounded-pill px-4">
          Quay lại Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-vh-100" style={{ paddingTop: '80px' }}>
      {/* Ảnh bìa bài viết với Overlay */}
      <div 
        className="position-relative d-flex align-items-end" 
        style={{ 
          height: '500px', 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url(${resolveImageUrl(blog.image)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container pb-5 text-white">
          <Link to="/blog" className="text-white text-decoration-none mb-4 d-inline-block p-2 rounded-pill bg-white bg-opacity-25 shadow-sm">
            <i className="bi bi-arrow-left ms-2 me-2"></i> Quay lại danh sách
          </Link>
          <div className="badge bg-info mb-3 px-3 py-2 rounded-pill">{blog.category}</div>
          <h1 className="display-3 fw-bold mb-4" style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}>{blog.title}</h1>
          <div className="d-flex gap-4 fs-5 opacity-90">
            <span><i className="bi bi-person-circle me-2"></i>{blog.author?.name || 'Admin'}</span>
            <span><i className="bi bi-calendar3 me-2"></i>{new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
          </div>
        </div>
      </div>

      {/* Nội dung chi tiết bài viết */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-9 col-xl-8">
            <article className="blog-content">
              {/* Đoạn text này sẽ hiển thị đúng định dạng bạn nhập trong Admin */}
              <div 
                className="text-dark lh-lg" 
                style={{ 
                  fontSize: '1.2rem', 
                  whiteSpace: 'pre-line', 
                  textAlign: 'justify' 
                }}
              >
                {blog.content}
              </div>
            </article>
            
            <hr className="my-5 opacity-25" />
            
            {/* Thanh chia sẻ bài viết */}
            <div className="d-flex flex-wrap justify-content-between align-items-center bg-light p-4 rounded-5 shadow-sm border border-white">
              <span className="fw-bold text-dark fs-5"><i className="bi bi-share-fill me-2 text-primary"></i>Chia sẻ bài viết:</span>
              <div className="d-flex gap-3">
                <button className="btn btn-primary rounded-circle shadow-sm" style={{width: '45px', height: '45px'}}><i className="bi bi-facebook"></i></button>
                <button className="btn btn-info text-white rounded-circle shadow-sm" style={{width: '45px', height: '45px'}}><i className="bi bi-twitter"></i></button>
                <button className="btn btn-danger rounded-circle shadow-sm" style={{width: '45px', height: '45px'}}><i className="bi bi-messenger"></i></button>
              </div>
            </div>

            {/* Điều hướng bài viết khác */}
            <div className="mt-5 text-center">
              <Link to="/blog" className="btn btn-outline-info rounded-pill px-5 py-3 fw-bold">
                KHÁM PHÁ CÁC BÀI VIẾT KHÁC
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetail;