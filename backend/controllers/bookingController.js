const Booking = require('../models/Booking');
const User = require('../models/User'); 

const createBooking = async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();
    res.status(201).json({ success: true, message: 'Đặt tour thành công! Vui lòng tiến hành thanh toán.', data: savedBooking });
  } catch (error) { res.status(500).json({ success: false, message: 'Lỗi khi đặt tour', error: error.message }); }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('userId', 'name email phone').populate('tourId', 'title price');
    res.status(200).json({ success: true, data: bookings });
  } catch (error) { res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách booking' }); }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentMethod } = req.body; 
    let newStatus = paymentMethod === 'cash' ? 'pending_confirmation' : 'paid'; 
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, { status: newStatus }, { new: true });
    if (!updatedBooking) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn đặt tour' });
    res.status(200).json({ success: true, message: 'Cập nhật trạng thái thành công', data: updatedBooking });
  } catch (error) { res.status(500).json({ success: false, message: 'Lỗi cập nhật trạng thái', error: error.message }); }
};

const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId }).populate('tourId', 'title image price duration').sort({ createdAt: -1 }); 
    res.status(200).json({ success: true, data: bookings });
  } catch (error) { res.status(500).json({ success: false, message: 'Lỗi khi lấy lịch sử đặt tour' }); }
};

// --- MÁY QUÉT LƯỚI TÌM KIẾM BẤT CHẤP LỖI GÕ ---
const trackOrder = async (req, res) => {
  try {
    const queryVal = req.query.code || req.query.phone || "";
    if (!queryVal) return res.status(400).json({ success: false, message: 'Vui lòng cung cấp thông tin tra cứu.' });

    // Tự động làm sạch mọi dấu hiệu lạ (xoá #, xóa khoảng trắng, in thường)
    const cleanQuery = queryVal.replace(/#/g, '').replace(/\s+/g, '').toLowerCase();

    // Móc toàn bộ Data từ DB lên quét (Để đảm bảo 100% không sót)
    const allBookings = await Booking.find()
      .populate('tourId', 'title image duration price')
      .populate('userId')
      .sort({ createdAt: -1 });

    const bookings = allBookings.filter(b => {
      // Quét Mã Đơn: Chuyển ID sang chữ thường và tìm xem có chứa "a93a19" không
      const idMatch = String(b._id).toLowerCase().includes(cleanQuery);
      
      // Quét SĐT: Vứt hết dấu, chỉ giữ các con số để so sánh cho chắc chắn
      const bPhone = b.phone ? String(b.phone).replace(/\D/g, '') : '';
      const uPhone = b.userId?.phone ? String(b.userId.phone).replace(/\D/g, '') : '';
      const phoneMatch = bPhone.includes(cleanQuery) || uPhone.includes(cleanQuery);

      return idMatch || phoneMatch;
    });

    if (bookings.length === 0) {
      // DÒNG NÀY ĐỂ BÁO CÁO MẬT: Nó sẽ hiện lên khung đỏ bên giao diện cho biết máy chủ tìm cái gì
      return res.status(404).json({ 
        success: false, 
        message: `Rất tiếc! Hệ thống đã quét ${allBookings.length} đơn hàng với từ khóa [${cleanQuery}] nhưng không khớp.` 
      });
    }

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, { status: status }, { new: true });
    if (!updatedBooking) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    res.status(200).json({ success: true, message: 'Cập nhật trạng thái thành công', data: updatedBooking });
  } catch (error) { res.status(500).json({ success: false, message: 'Lỗi server', error: error.message }); }
};

module.exports = { createBooking, getAllBookings, updatePaymentStatus, getUserBookings, trackOrder, updateBookingStatus };