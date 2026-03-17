import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
  // KHAI BÁO STATE ĐỂ LƯU DỮ LIỆU TOUR VÀ TRẠNG THÁI LOADING
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  // GỌI API LẤY DỮ LIỆU TỪ BACKEND KHI VỪA VÀO TRANG
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/tours');
        // Giả sử API trả về { success: true, data: [...] }
        setTours(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải danh sách tour:', error);
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  return (
    <div style={{ overflow: 'hidden' }}>
      
      {/* ========================== SLIDER & SEARCH BAR ========================== */}
      <div className="position-relative">
        {/* CAROUSEL */}
        <div id="header_carousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators text-center">
            <div className="d-none d-lg-inline-block">
              <button type="button" data-bs-target="#header_carousel" data-bs-slide-to="0" className="active"></button>
              <button type="button" data-bs-target="#header_carousel" data-bs-slide-to="1"></button>
              <button type="button" data-bs-target="#header_carousel" data-bs-slide-to="2"></button>
            </div>
            <a className="btn btn-info text-white rounded-pill d-inline-block d-lg-none mb-5 p-3 fw-bold fs-5 shadow" href="#form_find_tour_responsive">
              Tìm tour ngay!
            </a>
          </div>
          <div className="carousel-inner h-100">
            <div className="carousel-item active relative">
              <img className="d-block w-100 object-fit-cover" style={{height: '100vh'}} src="/assets/img/index/anh-cau-rong-da-nang-phun-lua-dep_111044330.jpg" alt="Đà Nẵng" />
              <div className="position-absolute top-0 start-0 w-100 h-100" style={{background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))'}}></div>
              <div className="carousel-caption pb-5">
                <h3 className="font_DPTBlacksword display-4 fw-bold text-white shadow-sm">Cầu Rồng Đà Nẵng</h3>
                <p className="text-info fs-5 fw-bold tracking-wider text-uppercase">Thành phố Đà Nẵng, Việt Nam</p>
              </div>
            </div>
            <div className="carousel-item relative">
              <img className="d-block w-100 object-fit-cover" style={{height: '100vh'}} src="/assets/img/index/Vinh-ha-long.jpg" alt="Vịnh Hạ Long" />
              <div className="position-absolute top-0 start-0 w-100 h-100" style={{background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))'}}></div>
              <div className="carousel-caption pb-5">
                <h3 className="font_DPTBlacksword display-4 fw-bold text-white shadow-sm">Vịnh Hạ Long</h3>
                <p className="text-info fs-5 fw-bold tracking-wider text-uppercase">Quảng Ninh, Việt Nam</p>
              </div>
            </div>
            <div className="carousel-item relative">
              <img className="d-block w-100 object-fit-cover" style={{height: '100vh'}} src="/assets/img/index/pexels-marcus-nguyen-328033-980221.jpg" alt="TP HCM" />
              <div className="position-absolute top-0 start-0 w-100 h-100" style={{background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))'}}></div>
              <div className="carousel-caption pb-5">
                <h3 className="font_DPTBlacksword display-4 fw-bold text-white shadow-sm">Thành phố Hồ Chí Minh</h3>
                <p className="text-info fs-5 fw-bold tracking-wider text-uppercase">Thành phố lớn nhất Việt Nam</p>
              </div>
            </div>
          </div>
          <div className="d-none d-lg-block">
            <button className="carousel-control-prev" type="button" data-bs-target="#header_carousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon"></span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#header_carousel" data-bs-slide="next">
              <span className="carousel-control-next-icon"></span>
            </button>
          </div>
        </div>

        {/* SEARCHBAR KÍNH MỜ */}
        <div className="header_searchbar position-absolute translate-middle z-3 w-75" style={{ top: '95%', left: '50%' }}>
          <div className="d-none d-lg-block bg-white bg-opacity-90 rounded-4 shadow-lg p-3" style={{ backdropFilter: 'blur(10px)' }}>
            <form action="">
              <div className="row g-3 align-items-center">
                <div className="col-lg-3 col-12">
                  <label className="form-label fw-bold text-secondary ps-3" htmlFor="location">
                    <i className="bi bi-geo-alt-fill text-info"></i> Điểm đến
                  </label>
                  <input id="location" className="form-control rounded-pill border-0 bg-light p-3" type="text" placeholder="Bạn muốn đi đâu?" />
                </div>
                <div className="col-lg-3 col-12">
                  <label className="form-label fw-bold text-secondary ps-3" htmlFor="location-start">
                    <i className="bi bi-send-fill text-info"></i> Khởi hành
                  </label>
                  <input id="location-start" className="form-control rounded-pill border-0 bg-light p-3" type="text" placeholder="Nơi khởi hành" />
                </div>
                <div className="col-lg-3 col-12">
                  <label className="form-label fw-bold text-secondary ps-3" htmlFor="check-out-date">
                    <i className="bi bi-calendar-week text-info"></i> Ngày đi
                  </label>
                  <input id="check-out-date" className="form-control rounded-pill border-0 bg-light p-3" type="date" />
                </div>
                <div className="col-lg-3 col-12 text-center mt-auto">
                  <button id="timKiemBtn" type="button" className="btn btn-info text-white fw-bold rounded-pill w-100 p-3 shadow-sm hover-shadow">
                    <i className="bi bi-search me-2"></i> TÌM KIẾM
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <main id="wrapper_content" className="pt-5 mt-5">
        
        {/* ========================== ABOUT ========================== */}
        <section className="content_about pt-5">
          <div className="container">
            <div className="row align-items-center py-5 flex-lg-row-reverse">
              <div className="col-lg-6 col-12 text-center text-lg-start ps-lg-5">
                <h3 className="font_DPTBlacksword text-info pb-3 display-5">Hành trình tuyệt vời</h3>
                <p className="fs-5 text-secondary">
                  Thế giới ngoài kia bao la, hãy để <span className="font_DPTBlacksword text-dark fs-4">Du lịch Việt</span> đồng hành cùng bạn.
                </p>
                <p className="text-muted">
                  Hơn 16 năm kinh nghiệm, chúng tôi cam kết đem lại những trải nghiệm đẳng cấp và khác biệt.
                </p>
                <div className="border-0 bg-light rounded-4 mt-4 shadow-sm p-3">
                  <div className="row align-items-center p-3 text-center">
                    <div className="col"><i className="bi bi-airplane text-info display-6"></i><br/><span className="fw-bold mt-2 d-inline-block">Bay đẳng cấp</span></div>
                    <div className="col"><i className="bi bi-buildings text-info display-6"></i><br/><span className="fw-bold mt-2 d-inline-block">Resort xịn</span></div>
                    <div className="col"><i className="bi bi-globe-americas text-info display-6"></i><br/><span className="fw-bold mt-2 d-inline-block">100+ Tour</span></div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-12 text-center mt-5 mt-lg-0 position-relative">
                <div className="position-absolute bg-info rounded-circle opacity-25" style={{width: '300px', height: '300px', top: '-20px', left: '10%'}}></div>
                <img className="img-fluid rounded-4 shadow-lg position-relative" src="/assets/img/index/about.png" alt="About Us" />
              </div>
            </div>
          </div>
        </section>

        {/* ========================== DESTINATION ========================== */}
        <section className="content_destination bg-light mt-5">
          <div className="container px-lg-5 py-5">
            <h3 className="font_DPTBlacksword text-info text-center pb-4 display-6">Điểm đến hấp dẫn</h3>
            <div className="row m-0 text-center">
              <div className="col-lg-8 col-12 p-lg-2">
                <div className="box_img position-relative m-auto rounded-4 overflow-hidden shadow w-100 transition-all hover-shadow">
                  <img className="img-fluid w-100 object-fit-cover" style={{height: '370px'}} src="/assets/img/index/co-hong-da-lat-760x370.jpg" alt="Đà Lạt" />
                  <div className="img_dark position-absolute top-0 start-0 bg-dark w-100 h-100 opacity-25"></div>
                  <div className="img_title position-absolute bottom-0 start-0 p-4 w-100 text-start" style={{background: 'linear-gradient(transparent, rgba(0,0,0,0.8))'}}>
                    <span className="font_DPTBlacksword fs-2 text-white">Đà Lạt mộng mơ</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-12 p-lg-2 pt-3 pt-lg-2">
                <div className="box_img position-relative m-auto rounded-4 overflow-hidden shadow w-100 transition-all hover-shadow">
                  <img className="img-fluid w-100 object-fit-cover" style={{height: '370px'}} src="/assets/img/index/ha-noi-en-370x370.jpg" alt="Hà Nội" />
                  <div className="img_dark position-absolute top-0 start-0 bg-dark w-100 h-100 opacity-25"></div>
                  <div className="img_title position-absolute bottom-0 start-0 p-4 w-100 text-start" style={{background: 'linear-gradient(transparent, rgba(0,0,0,0.8))'}}>
                    <span className="font_DPTBlacksword fs-2 text-white">Hà Nội hoài cổ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================== DANH SÁCH TOUR TỪ MONGODB ========================== */}
        <section className="content_newTour tour_quocte py-5">
          <div className="container px-lg-5 py-5">
            <div className="d-flex justify-content-between align-items-end mb-5">
              <div>
                <h3 className="font_DPTBlacksword text-info pb-2 display-6 mb-0">Tour Nổi Bật</h3>
                <p className="text-muted mb-0">Những chuyến đi được khách hàng yêu thích nhất</p>
              </div>
              <a href="#" className="btn btn-outline-info rounded-pill fw-bold d-none d-md-inline-block">
                Xem tất cả <i className="bi bi-arrow-right"></i>
              </a>
            </div>

            {/* KIỂM TRA LOADING HOẶC RENDER TOUR */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-info" style={{width: '3rem', height: '3rem'}} role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h5 className="text-muted mt-3">Đang lấy dữ liệu từ hệ thống...</h5>
              </div>
            ) : (
              <div className="row g-4">
                {tours.slice(0, 6).map((tour) => (
                  <div className="col-lg-4 col-md-6" key={tour._id}>
                    {/* THẺ CARD TOUR CỦA BOOTSTRAP */}
                    <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden transition-all hover-shadow">
                      <div className="position-relative">
                        {/* Ảnh Tour */}
                        <img 
                          src={tour.image} 
                          className="card-img-top object-fit-cover" 
                          style={{height: '240px'}} 
                          alt={tour.title}
                          onError={(e) => e.target.src = '/assets/img/index/ha-noi-en-370x370.jpg'} // Ảnh dự phòng nếu lỗi
                        />
                        {/* Tag Thời gian */}
                        <span className="position-absolute top-0 end-0 bg-info text-white fw-bold px-3 py-2 rounded-start-pill mt-3 shadow-sm">
                          <i className="bi bi-clock me-1"></i> {tour.duration}
                        </span>
                      </div>
                      
                      <div className="card-body d-flex flex-column p-4">
                        <h5 className="card-title fw-bold text-dark mb-3 line-clamp-2" style={{lineHeight: '1.4'}}>
                          {tour.title}
                        </h5>
                        <p className="card-text text-secondary mb-4 flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {tour.description}
                        </p>
                        
                        {/* Khu vực Giá và Nút Đặt */}
                        <div className="d-flex justify-content-between align-items-center mt-auto border-top pt-3">
                          <div>
                            <small className="text-muted d-block text-uppercase fw-bold" style={{fontSize: '0.75rem'}}>Giá trọn gói</small>
                            <span className="text-danger fw-bold fs-5">
                              {tour.price.toLocaleString('vi-VN')} ₫
                            </span>
                          </div>
                          <Link to={`/tour/${tour._id}`} className="btn btn-info text-white rounded-pill fw-bold px-4 shadow-sm hover-scale">
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
        </section>

      </main>
    </div>
  );
}

export default Home;