function Pricing() {
  return (
    <div className="bg-light pb-5" style={{ minHeight: '100vh', paddingTop: '80px' }}>
      <div className="container mt-5">
        <div className="text-center mb-5">
          <h6 className="text-info fw-bold">DỊCH VỤ ĐI KÈM</h6>
          <h2 className="fw-bold display-5">Bảng Giá Thuê Xe Du Lịch</h2>
          <p className="text-muted fs-5">Cam kết dàn xe đời mới, tài xế kinh nghiệm, giá cả minh bạch.</p>
        </div>

        <div className="row g-4 justify-content-center">
          {/* Card 1 */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 h-100 text-center hover-scale transition-all">
              <div className="card-header bg-white border-0 pt-5 pb-3">
                <h4 className="fw-bold">Xe 4 - 7 Chỗ</h4>
                <div className="display-5 fw-bold text-info my-3">800.000 ₫</div>
                <p className="text-muted small">/ Ngày (Giao động theo lịch trình)</p>
              </div>
              <div className="card-body px-4 pb-5">
                <ul className="list-unstyled text-start text-secondary mb-4">
                  <li className="mb-3"><i className="bi bi-check-circle-fill text-success me-2"></i> Xe đời mới (Vios, Xpander, Innova)</li>
                  <li className="mb-3"><i className="bi bi-check-circle-fill text-success me-2"></i> Đã bao gồm lương tài xế</li>
                  <li className="mb-3"><i className="bi bi-check-circle-fill text-success me-2"></i> Không bao gồm phí cầu đường</li>
                  <li className="mb-3"><i className="bi bi-check-circle-fill text-success me-2"></i> Nước suối & Khăn lạnh miễn phí</li>
                </ul>
                <button className="btn btn-outline-info rounded-pill w-100 fw-bold py-2">Liên hệ đặt xe</button>
              </div>
            </div>
          </div>

          {/* Card 2 (Nổi bật) */}
          <div className="col-md-4">
            <div className="card border-info shadow-lg rounded-4 h-100 text-center position-relative">
              <span className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-danger px-4 py-2 fs-6">Phổ biến nhất</span>
              <div className="card-header bg-info text-white border-0 pt-5 pb-3 rounded-top-4">
                <h4 className="fw-bold">Xe 16 Chỗ</h4>
                <div className="display-5 fw-bold my-3">1.500.000 ₫</div>
                <p className="small opacity-75">/ Ngày (Giao động theo lịch trình)</p>
              </div>
              <div className="card-body px-4 pb-5 mt-3">
                <ul className="list-unstyled text-start text-secondary mb-4">
                  <li className="mb-3"><i className="bi bi-check-circle-fill text-success me-2"></i> Xe Ford Transit, Hyundai Solati</li>
                  <li className="mb-3"><i className="bi bi-check-circle-fill text-success me-2"></i> Ghế ngả cao cấp, không gian rộng</li>
                  <li className="mb-3"><i className="bi bi-check-circle-fill text-success me-2"></i> Tặng nón du lịch và nước suối</li>
                  <li className="mb-3"><i className="bi bi-check-circle-fill text-success me-2"></i> Phù hợp cho nhóm gia đình, công ty</li>
                </ul>
                <button className="btn btn-info text-white rounded-pill w-100 fw-bold py-2 shadow-sm">Liên hệ đặt xe ngay</button>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 h-100 text-center hover-scale transition-all">
              <div className="card-header bg-white border-0 pt-5 pb-3">
                <h4 className="fw-bold">Xe 29 - 45 Chỗ</h4>
                <div className="display-5 fw-bold text-info my-3">2.800.000 ₫</div>
                <p className="text-muted small">/ Ngày (Giao động theo lịch trình)</p>
              </div>
              <div className="card-body px-4 pb-5">
                <ul className="list-unstyled text-start text-secondary mb-4">
                  <li className="mb-3"><i className="bi bi-check-circle-fill text-success me-2"></i> Xe Thaco, Universe đời mới nhất</li>
                  <li className="mb-3"><i className="bi bi-check-circle-fill text-success me-2"></i> Hệ thống Karaoke giải trí trên xe</li>
                  <li className="mb-3"><i className="bi bi-check-circle-fill text-success me-2"></i> Hầm hành lý siêu rộng</li>
                  <li className="mb-3"><i className="bi bi-check-circle-fill text-success me-2"></i> Chuyên phục vụ teambuilding</li>
                </ul>
                <button className="btn btn-outline-info rounded-pill w-100 fw-bold py-2">Liên hệ đặt xe</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;