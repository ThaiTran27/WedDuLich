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

// [PUT] /api/bookings/:id/pay - Cập nhật trạng thái thanh toán
const updatePaymentStatus = async (req, res) => {
  try {
    // Lấy phương thức thanh toán từ Frontend gửi lên (nếu có)
    const { paymentMethod } = req.body; 

    // Mặc định là đã thanh toán, nhưng nếu khách chọn tiền mặt thì đổi thành chờ xác nhận
    let newStatus = 'paid'; 
    if (paymentMethod === 'cash') {
      newStatus = 'pending_confirmation';
    }

    // Tìm đơn hàng theo ID và cập nhật status mới
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id, 
      { status: newStatus }, 
      { new: true } // Trả về dữ liệu mới sau khi cập nhật
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
    // Tìm đơn hàng theo ID của user, lấy thêm thông tin Tour và sắp xếp mới nhất lên đầu
    const bookings = await Booking.find({ userId })
      .populate('tourId', 'title image price duration')
      .sort({ createdAt: -1 }); 
      
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy lịch sử đặt tour' });
  }
};

// [GET] /api/bookings/track - Tra cứu đơn hàng công khai (Không cần đăng nhập)
const trackOrder = async (req, res) => {
  try {
    const { code } = req.query;
    
    // Tìm kiếm đơn hàng theo Mã đơn (chính là _id của MongoDB)
    const booking = await Booking.findById(code).populate('tourId', 'title image duration price');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã.' });
    }

    // Trả về dưới dạng mảng để Frontend dễ xử lý hiển thị
    res.status(200).json({ success: true, data: [booking] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Mã đơn hàng không hợp lệ.' });
  }
};

// Export tất cả ra ngoài
module.exports = { createBooking, getAllBookings, updatePaymentStatus, getUserBookings, trackOrder };