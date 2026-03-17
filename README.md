🌏 DU LỊCH VIỆT - TOURISM MANAGEMENT SYSTEM
Dự án Website quản lý và đặt tour du lịch được phát triển bằng bộ công nghệ MERN Stack. Hệ thống cung cấp trải nghiệm mượt mà từ việc tìm kiếm tour, đặt chỗ cho đến thanh toán giả lập.

🚀 Tính năng nổi bật
Hệ thống tài khoản: * Đăng ký, Đăng nhập (Bảo mật bằng mật khẩu băm Bcrypt).

Khôi phục mật khẩu (Forgot Password).

Lời chào cá nhân hóa trên Navbar theo tên người dùng.

Quản lý Tour:

Hiển thị danh sách Tour đa dạng (Trong nước & Quốc tế).

Xem chi tiết Tour với hình ảnh, lịch trình và mô tả chi tiết.

Đặt Tour & Thanh toán:

Tính toán tổng tiền dựa trên số lượng hành khách.

Hệ thống Payment Sandbox (Thanh toán giả lập) để kiểm tra luồng tiền đơn hàng.

Giao diện (UI/UX):

Thiết kế hiện đại, responsive hoàn toàn (đã fix lỗi Navbar ẩn hiện trên máy tính).

Sử dụng hiệu ứng Glassmorphism (Kính mờ) cho các form đăng nhập.

🛠 Công nghệ sử dụng
Frontend: React.js, React Router v6, Axios, Bootstrap 5, Bootstrap Icons.

Backend: Node.js, Express.js.

Database: MongoDB (Mongoose ODM).

Bảo mật: JSON Web Token (JWT), Bcrypt.js.

Công cụ: Docker (hỗ trợ triển khai), VS Code, MongoDB Compass.

📁 Cấu trúc thư mục

/du-lich-viet
├── /backend
│   ├── /config          # Kết nối Database
│   ├── /controllers     # Logic xử lý (Auth, Tour, Booking)
│   ├── /models          # Schema dữ liệu MongoDB
│   ├── /routes          # Định nghĩa các API endpoint
│   └── server.js        # File chạy chính của Backend
├── /frontend
│   ├── /src
│   │   ├── /components  # Navbar, Footer, v.v.
│   │   ├── /pages       # Home, Login, Register, TourDetails, Payment...
│   │   ├── App.jsx      # Cấu hình Routes
│   │   └── main.jsx     # Điểm khởi đầu của React
└── README.md