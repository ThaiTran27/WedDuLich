import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { resolveImageUrl } from '../../public/assets/img/index/imagePath';

function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const blogRes = await axios.get(`http://127.0.0.1:5000/api/blogs/${id}`);
        const blogData = blogRes.data?.data || blogRes.data;
        
        if (blogData && blogData._id) {
          setBlog(blogData);
          try {
            // Gọi API lấy bình luận của Blog
            const reviewRes = await axios.get(`http://127.0.0.1:5000/api/reviews/blog/${id}`);
            setReviews(reviewRes.data?.data || []);
          } catch (e) {
            console.log("Bài viết chưa có bình luận nào.");
          }
        } else {
          setError('Bài viết này không tồn tại trên hệ thống.');
        }
      } catch (err) {
        setError('Không thể kết nối tới máy chủ.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const userString = localStorage.getItem('user');
    if (!userString) {
      alert("Vui lòng đăng nhập để bình luận!");
      return;
    }
    const user = JSON.parse(userString);
    setSubmitting(true);

    try {
      await axios.post(`http://127.0.0.1:5000/api/reviews`, {
        blogId: id,
        userId: user.id || user._id,
        comment,
        rating: 5
      });
      setComment('');
      // Load lại danh sách bình luận mới nhất
      const updated = await axios.get(`http://127.0.0.1:5000/api/reviews/blog/${id}`);
      setReviews(updated.data.data);
      alert("Đăng bình luận thành công!");
    } catch (err) {
      alert("Lỗi khi gửi bình luận. Thái nhớ restart server backend nhé!");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center bg-light"><div className="spinner-border text-info" style={{ width: '3rem', height: '3rem' }}></div></div>;

  if (error || !blog) return (
    <div className="text-center py-5 mt-5 bg-light vh-100">
      <div className="container p-5 bg-white rounded-5 shadow-sm d-inline-block">
        <i className="bi bi-exclamation-triangle-fill text-warning display-1"></i>
        <h2 className="fw-bold text-dark mt-3">{error || 'Không tìm thấy bài viết!'}</h2>
        <Link to="/blog" className="btn btn-info text-white mt-3 rounded-pill px-5 py-2 fw-bold shadow-sm">Quay lại danh sách Blog</Link>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-vh-100" style={{ paddingTop: '80px' }}>
      {/* Banner Ảnh bìa - ĐÃ FIX BỎ KHUNG XANH */}
      <div 
        className="position-relative d-flex align-items-end shadow-sm" 
        style={{ 
          height: '550px', 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.8)), url(${resolveImageUrl(blog.image)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="container pb-5 text-white">
          <Link to="/blog" className="text-white text-decoration-none mb-4 d-inline-block p-2 rounded-pill bg-white bg-opacity-25 hover-shadow transition-all">
            <i className="bi bi-chevron-left ms-2 me-2"></i> Quay lại Blog
          </Link>
          <div className="badge bg-warning text-dark mb-3 px-3 py-2 rounded-pill fw-bold">#{blog.category}</div>
          <h1 className="display-4 fw-bold mb-4" style={{ textShadow: '2px 4px 10px rgba(0,0,0,0.3)' }}>{blog.title}</h1>
          
          {/* PHẦN ĐÃ FIX: Chỉ giữ icon và text, KHÔNG CÒN BORDER XANH */}
          <div className="d-flex gap-4 fs-5 opacity-90 mt-2">
            <span className="d-flex align-items-center">
              <i className="bi bi-person-circle me-2 text-warning"></i>
              {blog.author?.name || 'Ban quản trị'}
            </span>
            <span className="d-flex align-items-center">
              <i className="bi bi-calendar-check me-2 text-warning"></i>
              {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
            </span>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-9 col-xl-8">
            <article className="blog-content mb-5">
              <div className="text-dark lh-lg" style={{ fontSize: '1.25rem', whiteSpace: 'pre-line', textAlign: 'justify', fontFamily: 'serif' }}>
                {blog.content}
              </div>
            </article>
            
            <hr className="my-5 opacity-25" />

            <div className="comment-section">
              <h3 className="fw-bold mb-4 text-primary d-flex align-items-center">
                <i className="bi bi-chat-left-heart-fill me-3"></i> Thảo luận ({reviews.length})
              </h3>
              
              <div className="bg-light p-4 rounded-5 mb-5 shadow-sm">
                <h6 className="fw-bold mb-3">Gửi bình luận của bạn</h6>
                <form onSubmit={handleCommentSubmit}>
                  <textarea 
                    className="form-control border-0 shadow-sm mb-3 p-3 rounded-4" 
                    rows="4" 
                    placeholder="Bạn thấy bài viết này thế nào? Chia sẻ cùng mọi người nhé..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  ></textarea>
                  <button type="submit" className="btn btn-info text-white rounded-pill px-5 fw-bold shadow" disabled={submitting}>
                    {submitting ? 'Đang gửi...' : 'Đăng bình luận'}
                  </button>
                </form>
              </div>

              <div className="reviews-list">
                {reviews.map((rev) => (
                  <div key={rev._id} className="d-flex mb-4 p-4 rounded-4 bg-white shadow-sm border border-light">
                    <div className="flex-shrink-0">
                      <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5 shadow-sm" style={{ width: '50px', height: '50px' }}>
                        {rev.userId?.name?.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="ms-3 w-100">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <h6 className="fw-bold mb-0 text-dark">{rev.userId?.name}</h6>
                        <small className="text-muted"><i className="bi bi-clock-history me-1"></i>{new Date(rev.createdAt).toLocaleDateString('vi-VN')}</small>
                      </div>
                      <p className="text-secondary mb-0 mt-1">{rev.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetail;