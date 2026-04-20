import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // Nếu chưa đăng nhập hoặc không phải admin/staff -> Đá về trang Login
  if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
    alert("khu vực này chỉ dành cho Admin/Staff nhé!");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;