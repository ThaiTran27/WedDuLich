import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
// Đã bỏ thư viện axios vì không cần tải lại lịch sử nữa

const socket = io('http://127.0.0.1:5000', { autoConnect: false });

function ChatWidget() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [chatMode, setChatMode] = useState('menu'); 
  
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]); // Khởi tạo mảng rỗng, không tải từ DB lên nữa
  const messagesEndRef = useRef(null);

  const [currentUser, setCurrentUser] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState('user');

  // Lấy thông tin User hoặc tạo Khách ảo
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      setCurrentUser(user.name);
      setCurrentUserRole(user.role || 'user');
    } else {
      let guestName = sessionStorage.getItem('guestName');
      if (!guestName) {
        guestName = `Khách_${Math.floor(Math.random() * 1000)}`;
        sessionStorage.setItem('guestName', guestName);
      }
      setCurrentUser(guestName);
      setCurrentUserRole('guest');
    }
  }, []);

  // --- ĐÃ SỬA: Xóa phần gọi API fetchChatHistory ---
  // Giờ chỉ còn lắng nghe tin nhắn mới (Real-time)
  useEffect(() => {
    socket.on('receive_message', (data) => {
      setChatLog((prev) => [...prev, data]);
    });
    return () => socket.off('receive_message'); 
  }, []);

  // Cuộn xuống tin nhắn cuối cùng
  useEffect(() => {
    if (chatMode === 'live') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatLog, isOpen, chatMode]);

  const startLiveChat = () => {
    socket.connect(); 
    setChatMode('live');
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim() !== '') {
      const msgData = {
        sender: currentUser,
        text: message,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        role: currentUserRole
      };
      socket.emit('send_message', msgData);
      setMessage('');
    }
  };

  const handleMenuClick = (path) => {
    setIsOpen(false); 
    navigate(path);   
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999 }}>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="btn btn-info text-white rounded-circle shadow-lg d-flex align-items-center justify-content-center hover-scale"
          style={{ width: '60px', height: '60px' }}
        >
          <i className="bi bi-chat-dots-fill fs-3"></i>
        </button>
      )}

      {isOpen && (
        <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{ width: '350px', height: '480px', display: 'flex', flexDirection: 'column' }}>
          
          <div className="bg-info text-white p-3 d-flex justify-content-between align-items-center shadow-sm z-1">
            <div className="d-flex align-items-center">
              {chatMode === 'live' && (
                <button onClick={() => setChatMode('menu')} className="btn btn-sm text-white p-0 me-2 border-0" title="Quay lại Menu">
                  <i className="bi bi-arrow-left fs-5"></i>
                </button>
              )}
              <h6 className="mb-0 fw-bold"><i className="bi bi-headset me-2"></i>CSKH Du Lịch Việt</h6>
            </div>
            <button onClick={() => setIsOpen(false)} className="btn-close btn-close-white"></button>
          </div>

          {chatMode === 'menu' ? (
            <div className="card-body bg-light d-flex flex-column align-items-center justify-content-center p-4">
              <div className="bg-white p-3 rounded-4 shadow-sm text-center mb-4 w-100 border position-relative">
                <div className="position-absolute top-0 start-50 translate-middle bg-white rounded-circle p-1 shadow-sm">
                  <img src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" alt="bot" style={{width: '40px'}}/>
                </div>
                <h5 className="fw-bold text-info mt-3 mb-2">👋 Xin chào!</h5>
                <p className="text-muted small mb-0">
                  Chào mừng bạn đến với Du lịch Việt. Bạn đang quan tâm đến thông tin gì ạ?
                </p>
              </div>
              
              <div className="w-100 d-flex flex-column gap-2">
                <button className="btn btn-outline-info rounded-pill fw-bold text-start px-4" onClick={() => handleMenuClick('/tour-trong-nuoc')}>
                  🌍 Xem danh sách Tour
                </button>
                <button className="btn btn-outline-info rounded-pill fw-bold text-start px-4" onClick={() => handleMenuClick('/gioi-thieu')}>
                  📖 Giới thiệu công ty
                </button>
                <button className="btn btn-outline-info rounded-pill fw-bold text-start px-4" onClick={() => handleMenuClick('/lien-he')}>
                  📞 Thông tin liên hệ
                </button>
                
                <div className="text-center text-muted my-1 small">hoặc</div>
                
                <button className="btn btn-info text-white rounded-pill fw-bold shadow-sm py-2" onClick={startLiveChat}>
                  <i className="bi bi-person-lines-fill me-2"></i> Chat với Nhân viên
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="card-body" style={{ overflowY: 'auto', flexGrow: 1, backgroundColor: '#f8f9fa' }}>
                <div className="text-center text-muted mb-3 small bg-white rounded-pill py-1 border shadow-sm mx-auto" style={{maxWidth: '80%'}}>
                  Đã kết nối với Tổng đài viên!
                </div>
                
                {chatLog.map((msg, index) => {
                  // Logic phân Trái/Phải
                  const iAmAdmin = currentUserRole === 'admin' || currentUserRole === 'staff';
                  const msgFromAdmin = msg.role === 'admin' || msg.role === 'staff';
                  const isRightSide = iAmAdmin ? msgFromAdmin : !msgFromAdmin;
                  
                  return (
                    <div key={index} className={`mb-3 ${isRightSide ? 'text-end' : 'text-start'}`}>
                      <div 
                        className={`d-inline-block p-2 px-3 rounded-4 shadow-sm ${isRightSide ? 'bg-info text-white' : msgFromAdmin ? 'bg-warning text-dark' : 'bg-white text-dark'}`} 
                        style={{ 
                          maxWidth: '85%', 
                          textAlign: 'left',
                          borderBottomRightRadius: isRightSide ? '4px' : '16px',
                          borderBottomLeftRadius: !isRightSide ? '4px' : '16px'
                        }}
                      >
                        <small className="d-block fw-bold mb-1" style={{ fontSize: '11px', opacity: isRightSide ? 0.9 : 0.6 }}>
                          {msgFromAdmin ? '👨‍💻 Tư vấn viên' : msg.sender}
                        </small>
                        <span style={{ fontSize: '14px' }}>{msg.text}</span>
                      </div>
                      <div style={{ fontSize: '10px' }} className="text-muted mt-1 px-1">{msg.time}</div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 bg-white border-top">
                <form onSubmit={handleSend} className="d-flex gap-2">
                  <input 
                    type="text" 
                    className="form-control rounded-pill bg-light border-0 px-3" 
                    placeholder="Nhập câu hỏi của bạn..." 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                  />
                  <button type="submit" className="btn btn-info text-white rounded-circle shadow-sm" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                    <i className="bi bi-send-fill"></i>
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatWidget;