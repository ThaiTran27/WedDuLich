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
    const bookings = await Booking.find().populate('userId', 'name email').populate('tourId', 'title');
    // .populate() giúp lấy luôn tên người dùng và tên tour thay vì chỉ lấy ID
    
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

// Export tất cả các controller functions
module.exports = { createBooking, getAllBookings, updatePaymentStatus };