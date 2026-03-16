# 🌍 HỆ THỐNG QUẢN LÝ ĐẶT TOUR DU LỊCH (TOURMANAGER)

Hệ thống quản lý du lịch toàn diện giúp người dùng tìm kiếm, đặt tour và thanh toán trực tuyến qua môi trường thử nghiệm (Sandbox). Dự án được xây dựng theo mô hình Full-stack hiện đại, tối ưu hóa hiệu năng và giao diện người dùng.

---

## ✨ Tính năng chính

### 👤 Dành cho Khách hàng
* **Khám phá Tour:** Giao diện thẻ Tour hiện đại, trực quan với hiệu ứng hover sinh động.
* **Chi tiết Tour:** Xem thông tin chi tiết, lịch trình và ảnh chất lượng cao.
* **Hệ thống Auth:** Đăng ký, đăng nhập bảo mật với JWT (JSON Web Token).
* **Đặt Tour (Booking):** Tính toán tổng tiền tự động dựa trên số lượng khách.
* **Thanh toán Sandbox:** Cổng thanh toán giả lập tích hợp luồng xử lý thực tế.

### 🛡️ Dành cho Quản trị viên (Admin)
* **Thống kê doanh thu:** Theo dõi doanh thu, tổng số đơn hàng và số lượng khách qua thẻ KPI.
* **Quản lý đơn hàng:** Bảng dữ liệu chi tiết, theo dõi trạng thái thanh toán theo thời gian thực.

---

## 🛠️ Công nghệ sử dụng

### Frontend (Client)
* **React.js (Vite):** Thư viện xây dựng giao diện người dùng.
* **Tailwind CSS:** Framework thiết kế giao diện hiện đại, tối ưu CSS.
* **React Router Dom:** Điều hướng trang (Home, Login, Detail, Admin, Payment).
* **Axios:** Gọi API kết nối với Backend.
* **Code Splitting (lazy, Suspense):** Tối ưu hóa tốc độ tải trang.

### Backend (Server)
* **Node.js & Express:** Môi trường thực thi và Framework xây dựng RESTful API.
* **MongoDB & Mongoose:** Cơ sở dữ liệu NoSQL và thư viện quản lý Schema.
* **Bcryptjs:** Mã hóa mật khẩu người dùng.
* **JSON Web Token (JWT):** Xác thực và phân quyền người dùng.

---

## 📂 Cấu trúc dự án (Project Structure)

```text
quan-ly-du-lich/
├── backend/                # Server-side logic
│   ├── controllers/        # Xử lý logic API (Auth, Tour, Booking)
│   ├── models/             # Định nghĩa Schema MongoDB (User, Tour, Booking)
│   ├── routes/             # Định nghĩa các đường dẫn API
│   ├── server.js           # File khởi chạy server chính
│   └── .env                # Biến môi trường (DB URL, JWT Secret)
├── frontend/               # Client-side (React.js)
│   ├── src/
│   │   ├── components/     # Các thành phần dùng chung (Navbar, Card)
│   │   ├── pages/          # Các trang giao diện chính (Home, Login, Dashboard,...)
│   │   ├── App.jsx         # Cấu hình Routing & Suspense
│   │   ├── main.jsx        # File khởi tạo React
│   │   └── index.css       # Cấu hình Tailwind CSS
│   ├── tailwind.config.js  # Cấu hình Framework Tailwind
│   └── vite.config.js      # Cấu hình build tool Vite
└── README.md               # Tài liệu hướng dẫn dự án