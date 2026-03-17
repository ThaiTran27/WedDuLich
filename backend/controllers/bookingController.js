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

// [PUT] /api/bookings/:id/pay - Cập nhật trạng thái thanh toán thành công
const updatePaymentStatus = async (req, res) => {
  try {
    // Tìm đơn hàng theo ID và cập nhật status thành 'paid'
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id, 
      { status: 'paid' }, 
      { new: true } // Trả về dữ liệu mới sau khi cập nhật
    );

    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn đặt tour' });
    }

    res.status(200).json({ success: true, message: 'Thanh toán thành công', data: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi cập nhật thanh toán', error: error.message });
  }
};

// [GET] /api/bookings/user/:userId - Lấy đơn hàng của MỘT người dùng cụ thể
const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    // Tìm đơn hàng theo ID của user, lấy thêm thông tin Tour và sắp xếp mới nhất lên đầu
    const bookings = await Booking.find({ userId })
      .populate('tourId', 'title image price duration')
      .sort({ createdAt: -1 }); 
      
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy lịch sử đặt tour' });
  }
};

// Nhớ export thêm getUserBookings nhé:
module.exports = { createBooking, getAllBookings, updatePaymentStatus, getUserBookings };