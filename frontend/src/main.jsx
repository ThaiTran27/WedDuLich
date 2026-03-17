import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// 1. IMPORT BOOTSTRAP (CSS + JS) - Cực kỳ quan trọng để menu hoạt động
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// 2. IMPORT BOOTSTRAP ICONS (Để hiện mấy cái hình icon nhỏ nhỏ)
import 'bootstrap-icons/font/bootstrap-icons.css'

// 3. CSS CỦA RIÊNG BẠN (Để dưới cùng để có thể ghi đè CSS nếu cần)
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)