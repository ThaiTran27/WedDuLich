import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/auth/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Email hoặc mật khẩu không đúng!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" 
         style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/assets/img/index/Vinh-ha-long.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', paddingTop: '80px' }}>
      <div className="col-11 col-sm-8 col-md-6 col-lg-4">
        <div className="card border-0 shadow-lg rounded-4 p-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <div className="text-center mb-4">
            <h2 className="fw-bold text-info font_DPTBlacksword" style={{ fontSize: '2.5rem' }}>Du lịch Việt</h2>
            <p className="text-muted small fw-bold">Chào mừng trở lại! 👋</p>
          </div>

          {error && <div className="alert alert-danger py-2 text-center small">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label fw-bold text-secondary small">Email đăng nhập</label>
              <input type="email" className="form-control rounded-pill bg-light border-0 py-2 px-3" placeholder="admin@gmail.com" onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold text-secondary small">Mật khẩu</label>
              <input type="password" className="form-control rounded-pill bg-light border-0 py-2 px-3" placeholder="••••••" onChange={(e) => setPassword(e.target.value)} required />
              
              {/* QUÊN MẬT KHẨU NẰM DƯỚI GÓC PHẢI */}
              <div className="text-end mt-2">
                <Link to="/forgot-password" size="sm" className="text-info text-decoration-none small fw-bold">Quên mật khẩu?</Link>
              </div>
            </div>

            <button type="submit" className="btn btn-info text-white w-100 rounded-pill py-2 fw-bold mt-3 shadow-sm" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : 'ĐĂNG NHẬP'}
            </button>
          </form>

          <p className="text-center mt-4 mb-0 text-muted small">
            Chưa có tài khoản? <Link to="/register" className="text-info fw-bold text-decoration-none">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;