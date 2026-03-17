import { useParams, Link } from 'react-router-dom';

function BlogDetail() {
  const { id } = useParams();

  // Dữ liệu mô phỏng nội dung các bài viết
  const blogData = {
    'featured': {
      title: 'Xuôi dòng Cửu Long: Trải nghiệm du lịch sinh thái Bến Tre chân thực nhất',
      content: 'Rời xa những ồn ào của phố thị, chuyến đi về xứ dừa Bến Tre mang lại một cảm giác bình yên đến lạ. Từ việc ngồi xuồng ba lá len lỏi qua những rặng dừa nước rợp bóng mát, nghe tiếng chim hót líu lo, đến việc ghé thăm các lò kẹo dừa truyền thống, tận mắt thấy quy trình làm kẹo và thưởng thức những viên kẹo nóng hổi vừa ra lò.\n\nKhông chỉ có vậy, miền Tây còn thết đãi du khách bằng những bữa cơm dân dã mà đậm đà tình nghĩa. Cá tai tượng chiên xù cuốn bánh tráng, canh chua cá lóc hay lẩu mắm là những đặc sản không thể bỏ qua. Nếu bạn đang tìm kiếm một nơi để "chữa lành" tâm hồn, Bến Tre chắc chắn là điểm đến lý tưởng.',
      image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1500&q=80',
      date: '15/03/2026',
      author: 'Admin Team'
    },
    '1': {
      title: 'Top 10 món ăn đường phố Sài Gòn ăn là ghiền',
      content: 'Sài Gòn không chỉ nổi tiếng với những tòa nhà cao tầng mà còn là thiên đường ẩm thực đường phố. Đầu tiên phải kể đến Bánh mì Sài Gòn với lớp vỏ giòn rụm và nhân pate thơm lừng. Tiếp theo là bánh tráng nướng (pizza Việt Nam) nóng hổi ven Hồ Con Rùa, hay những ly súp cua đặc sóng sánh thịt và óc heo...\n\nĐến Sài Gòn mà chưa làm một vòng "food tour" từ quận 1 sang quận 4 thì quả là một thiếu sót lớn!',
      image: 'https://images.unsplash.com/photo-1555921015-c2848f1c26e4?auto=format&fit=crop&w=1500&q=80',
      date: '12/03/2026',
      author: 'Trần Minh Thái'
    },
    '2': {
      title: 'Cẩm nang phượt xe máy Đà Lạt an toàn cho người mới',
      content: 'Đường đèo lên Đà Lạt luôn là một thử thách hấp dẫn với những tín đồ đam mê xê dịch. Tuy nhiên, để có một chuyến đi an toàn, bạn cần chuẩn bị kỹ lưỡng. Hãy kiểm tra lại hệ thống phanh, lốp xe trước khi xuất phát. Đi với tốc độ vừa phải, giữ khoảng cách an toàn và tuyệt đối không vượt ẩu ở những khúc cua khuất tầm nhìn...',
      image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1500&q=80',
      date: '08/03/2026',
      author: 'Phượt thủ'
    },
    '3': {
      title: 'Khám phá nét đẹp Hội An qua từng con hẻm nhỏ',
      content: 'Hội An luôn mang trong mình một vẻ đẹp hoài cổ, tĩnh lặng. Sáng sớm thức dậy, thuê một chiếc xe đạp dạo quanh phố cổ, hít hà mùi hương của hoa giấy và thưởng thức một ổ bánh mì Phượng hay tô cao lầu trứ danh. Đừng quên thả đèn hoa đăng trên dòng sông Hoài khi màn đêm buông xuống nhé.',
      image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1500&q=80',
      date: '01/03/2026',
      author: 'Admin Team'
    }
  };

  const blog = blogData[id];

  if (!blog) return <div className="text-center py-5 mt-5"><h2>Không tìm thấy bài viết!</h2></div>;

  return (
    <div className="bg-white min-vh-100 pt-5 mt-4">
      {/* Ảnh bìa bài viết */}
      <div style={{ height: '400px', background: `url(${blog.image}) center/cover`, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' }}></div>
        <div className="container position-relative z-1 h-100 d-flex flex-column justify-content-end pb-5 text-white">
          <Link to="/blog" className="text-white text-decoration-none mb-3 d-inline-block hover-info">
            <i className="bi bi-arrow-left me-2"></i> Quay lại Blog
          </Link>
          <h1 className="display-4 fw-bold mb-3">{blog.title}</h1>
          <div className="d-flex gap-4">
            <span><i className="bi bi-person-circle me-2"></i>{blog.author}</span>
            <span><i className="bi bi-calendar3 me-2"></i>{blog.date}</span>
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