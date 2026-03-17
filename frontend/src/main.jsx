import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // <-- DÒNG NÀY ĐỂ MENU CÓ THỂ CLICK VÀ HIỆN RA
import 'bootstrap-icons/font/bootstrap-icons.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // File CSS ở Bước 1

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);