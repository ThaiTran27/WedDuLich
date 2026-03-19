import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { resolveImageUrl } from '../utils/imagePath';

function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:5000/api/blogs/${id}`);
        // Hỗ trợ cả 2 kiểu trả về: { success: true, data: {...} } hoặc {...}
        const payload = res.data;
        const data = payload?.data || payload;
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
    <div className="bg-white min-vh-100 pt-5 mt-4">
      {/* Ảnh bìa bài viết */}
      <div style={{ height: '400px', background: `url(${resolveImageUrl(blog.image)}) center/cover`, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' }}></div>
        <div className="container position-relative z-1 h-100 d-flex flex-column justify-content-end pb-5 text-white">
          <Link to="/blog" className="text-white text-decoration-none mb-3 d-inline-block hover-info">
            <i className="bi bi-arrow-left me-2"></i> Quay lại Blog
          </Link>
          <h1 className="display-4 fw-bold mb-3">{blog.title}</h1>
          <div className="d-flex gap-4">
            <span><i className="bi bi-person-circle me-2"></i>{blog.author || 'Admin'}</span>
            <span><i className="bi bi-calendar3 me-2"></i>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('vi-VN') : blog.date}</span>
          </div>
        </div>
      </div>

      {/* Nội dung chi tiết */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="fs-5 text-secondary" style={{ lineHeight: '1.8', whiteSpace: 'pre-line', textAlign: 'justify' }}>
              {blog.content}
            </div>
            
            <hr className="my-5" />
            
            <div className="d-flex justify-content-between align-items-center bg-light p-4 rounded-4">
              <span className="fw-bold">Chia sẻ bài viết này:</span>
              <div className="d-flex gap-2">
                <button className="btn btn-primary rounded-circle"><i className="bi bi-facebook"></i></button>
                <button className="btn btn-info text-white rounded-circle"><i className="bi bi-twitter"></i></button>
                <button className="btn btn-danger rounded-circle"><i className="bi bi-pinterest"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetail;