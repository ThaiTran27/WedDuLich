import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // Nếu chưa đăng nhập hoặc không phải admin -> Đá về trang Login
  if (!user || user.role !== 'admin') {
    alert("Thái ơi, khu vực này chỉ dành cho Admin nhé!");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;