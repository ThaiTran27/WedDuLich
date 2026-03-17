import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer id="wrapper_footer">
      <div className="container pt-3">
        <div className="row">
          
          {/* Cột 1: Hỗ trợ tư vấn */}
          <div className="col-12 col-md-6 p-2 col-lg-4">
            <p className="fs-4 text-uppercase fw-bold text-center">Hỗ trợ tư vấn</p>
            <p>
              <span className="fw-bold">
                <i className="bi bi-envelope-at-fill text-danger"></i> MAIL:
              </span>
              <a href="mailto:dungcobamdo@gmail.com" className="ms-1">thaithinh@gmail.com</a>
            </p>
            <p>
              <span className="fw-bold">
                <i className="bi bi-telephone-fill text-primary"></i> TEL:
              </span>
              <a href="tel:+0686868686" className="ms-1">0686.868.686</a>
            </p>
            <div className="gr_contact fs-4 text-center text-md-start">
              <a className="mx-1 text-primary" href="#"><i className="bi bi-messenger"></i></a>
              <a className="mx-1 text-success" href="#"><i className="bi bi-whatsapp"></i></a>
              <a className="mx-1 text-danger" href="#"><i className="bi bi-instagram"></i></a>
            </div>
          </div>

          {/* Cột 2: Thông tin cần biết */}
          <div className="col-12 col-md-6 p-2 col-lg-4 text-center">
            <p className="fs-4 text-uppercase fw-bold text-center">Thông tin cần biết</p>
            <p><Link to="#" className="text-decoration-none text-dark hover-info">Điều kiện, điều khoản</Link></p>
            <p><Link to="#" className="text-decoration-none text-dark">Phương thức thanh toán</Link></p>
            <p><Link to="#" className="text-decoration-none text-dark">Chính sách bảo mật</Link></p>
            <p><Link to="#" className="text-decoration-none text-dark">Quy định</Link></p>
          </div>

          {/* Cột 3: Thông tin liên hệ (Bản đồ) */}
          <div className="col-12 p-2 col-lg-4">
            <p className="fs-4 text-uppercase fw-bold text-center">Thông tin liên hệ</p>
            <h5 className="fs-5 text-center">Trường Đại học Công Nghiệp TP.HCM</h5>
            <p className="text-center text-lg-start">
              <i className="bi bi-geo-alt-fill text-danger"></i>
              <span className="fw-bold text-uppercase ms-1">Địa chỉ:</span>
              <span className="ms-1">12 Nguyễn Văn Bảo, P.4, Q.Gò Vấp, TP.HCM</span>
            </p>
            <iframe 
              className="w-100 rounded shadow-sm" 
              height="200"
              src="https://maps.google.com/maps?q=12%20Nguyễn%20Văn%20Bảo,%20Gò%20Vấp&t=&z=15&ie=UTF8&iwloc=&output=embed"
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          
        </div>
        
        <div className="row text-center pt-3 pb-2 user-select-none border-top mt-3">
          <p className="mb-0 text-muted">©Copyright Thái Thịnh</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;