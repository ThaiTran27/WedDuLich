const Booking = require('../models/Booking');

// [POST] /api/bookings - Tạo đơn đặt tour mới
const createBooking = async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();

    res.status(201).json({
      success: true,
      message: 'Đặt tour thành công! Vui lòng tiến hành thanh toán.',
      data: savedBooking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi đặt tour', error: error.message });
  }
};

// [GET] /api/bookings - Lấy danh sách tất cả các đơn đặt (Dành cho Admin)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email phone') 
      .populate('tourId', 'title price');
    
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách booking' });
  }
};

// [PUT] /api/bookings/:id/pay - Cập nhật trạng thái thanh toán (Khách hàng)
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentMethod } = req.body; 

    let newStatus = 'paid'; 
    if (paymentMethod === 'cash') {
      newStatus = 'pending_confirmation';
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id, 
      { status: newStatus }, 
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn đặt tour' });
    }

    res.status(200).json({ success: true, message: 'Cập nhật trạng thái thành công', data: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi cập nhật trạng thái', error: error.message });
  }
};

// [GET] /api/bookings/user/:userId - Lấy đơn hàng của MỘT người dùng cụ thể
const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId })
      .populate('tourId', 'title image price duration')
      .sort({ createdAt: -1 }); 
      
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy lịch sử đặt tour' });
  }
};

// [GET] /api/bookings/track - Tra cứu đơn hàng công khai
const trackOrder = async (req, res) => {
  try {
    const { code } = req.query;
    const booking = await Booking.findById(code).populate('tourId', 'title image duration price');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã.' });
    }

    res.status(200).json({ success: true, data: [booking] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Mã đơn hàng không hợp lệ.' });
  }
};

// --- HÀM MỚI THÊM: ADMIN CẬP NHẬT TRẠNG THÁI (DUYỆT / HỦY) ---
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'paid' hoặc 'cancelled'
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }

    res.status(200).json({ success: true, message: 'Cập nhật trạng thái thành công', data: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// Cập nhật lại phần exports
module.exports = { createBooking, getAllBookings, updatePaymentStatus, getUserBookings, trackOrder, updateBookingStatus };