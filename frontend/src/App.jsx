import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // <-- THÊM DÒNG NÀY

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const TourDetails = lazy(() => import('./pages/TourDetails'));
const PaymentSandbox = lazy(() => import('./pages/PaymentSandbox'));


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* THANH ĐIỀU HƯỚNG SẼ LUÔN HIỂN THỊ Ở TRÊN CÙNG */}
        <Navbar />

        {/* PHẦN NỘI DUNG CHÍNH SẼ THAY ĐỔI KHI CHUYỂN TRANG */}
        <main className="flex-grow">
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-xl font-semibold text-blue-500 animate-pulse">Đang tải trang...</div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/tour/:id" element={<TourDetails />} />
              <Route path="/payment/:bookingId" element={<PaymentSandbox />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;