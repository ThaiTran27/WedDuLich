const Tour = require('../models/Tour');

// 1. [POST] /api/tours - Tạo tour mới (Dành cho Admin)
const createTour = async (req, res) => {
  try {
    const newTour = new Tour(req.body);
    const savedTour = await newTour.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Tạo tour thành công!', 
      data: savedTour 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi tạo tour', error: error.message });
  }
};

// 2. [GET] /api/tours - Lấy danh sách tất cả các tour
const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find(); 
    res.status(200).json({ 
      success: true, 
      count: tours.length, 
      data: tours 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách tour' });
  }
};

// 3. [GET] /api/tours/:id - Lấy chi tiết 1 tour theo ID
const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tour này' });
    }
    res.status(200).json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy chi tiết tour' });
  }
};

// 4. [PUT] /api/tours/:id - Cập nhật thông tin tour (Dành cho Admin)
const updateTour = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true } // Trả về dữ liệu mới sau khi đã update
    );
    res.status(200).json({
      success: true,
      message: "Cập nhật tour thành công!",
      data: updatedTour,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi khi cập nhật tour" });
  }
};

// 5. [DELETE] /api/tours/:id - Xóa tour (Dành cho Admin)
const deleteTour = async (req, res) => {
  const id = req.params.id;
  try {
    await Tour.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Đã xóa tour thành công!",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi khi xóa tour" });
  }
};

// 6. [GET] /api/tours/search/getTourBySearch - Tìm kiếm tour theo tên hoặc thành phố
const getTourBySearch = async (req, res) => {
  const city = new RegExp(req.query.city, "i"); // "i" là không phân biệt hoa thường
  try {
    const tours = await Tour.find({ city: city });
    res.status(200).json({
      success: true,
      message: "Tìm thấy kết quả",
      data: tours,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "Không tìm thấy" });
  }
};

// Export tất cả các hàm ra
module.exports = { 
  createTour, 
  getAllTours, 
  getTourById, 
  updateTour, 
  deleteTour, 
  getTourBySearch 
};