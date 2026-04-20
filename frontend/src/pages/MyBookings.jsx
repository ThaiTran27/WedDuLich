import { useEffect, useState } from 'react';
import axios from 'axios';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchMyBookings = async () => {
      const res = await axios.get(`http://127.0.0.1:5000/api/bookings/user/${user._id}`);
      if (res.data.success) setBookings(res.data.data);
    };
    fetchMyBookings();
  }, [user._id]);

  return (
    <div className="container py-5 mt-5">
      <h2 className="fw-bold mb-4">LỊCH SỬ ĐẶT TOUR CỦA BẠN</h2>
      <div className="table-responsive bg-white shadow-sm rounded-4 p-3">
        <table className="table">
          <thead>
            <tr>
              <th>Tên Tour</th>
              <th>Số người</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b._id}>
                <td className="fw-bold">{b.tourId.title}</td>
                <td>{b.guestSize}</td>
                <td className="text-danger fw-bold">{b.totalPrice.toLocaleString()} ₫</td>
                <td>
                  <span className={`badge ${b.status === 'paid' ? 'bg-success' : 'bg-warning'}`}>
                    {b.status === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default MyBookings;