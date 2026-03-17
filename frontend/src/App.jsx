import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Footer from './components/Footer'; 

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const TourDetails = lazy(() => import('./pages/TourDetails'));
const PaymentSandbox = lazy(() => import('./pages/PaymentSandbox'));
const Account = lazy(() => import('./pages/Account'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* THANH ĐIỀU HƯỚNG SẼ LUÔN HIỂN THỊ Ở TRÊN CÙNG */}
        <Navbar />

        {/* PHẦN NỘI DUNG CHÍNH SẼ THAY ĐỔI KHI CHUYỂN TRANG */}
        <main className="flex-grow pt-20">
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-xl font-semibold text-blue-500 animate-pulse">Đang tải trang...</div>
            </div>
          }>
            <Routes>
              {/* Trang chủ */}
              <Route path="/" element={<Home />} />
              
              {/* Hệ thống tài khoản */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/tai-khoan" element={<Account />} />
              
              {/* Quản lý Tour & Đặt hàng */}
              <Route path="/tour/:id" element={<TourDetails />} />
              <Route path="/payment/:bookingId" element={<PaymentSandbox />} />
              
              {/* Trang quản trị */}
              <Route path="/admin" element={<Dashboard />} />
            </Routes>
          </Suspense>
        </main>

        {/* CHÂN TRANG SẼ LUÔN HIỂN THỊ Ở DƯỚI CÙNG CỦA MỌI TRANG */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;