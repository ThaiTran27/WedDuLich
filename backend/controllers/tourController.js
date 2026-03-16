const Tour = require('../models/Tour');

// [POST] /api/tours - Tạo tour mới (Dành cho Admin)
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

// [GET] /api/tours - Lấy danh sách tất cả các tour
const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find(); // Lấy toàn bộ dữ liệu từ bảng Tour
    res.status(200).json({ 
      success: true, 
      count: tours.length, 
      data: tours 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách tour' });
  }
};

// [GET] /api/tours/:id - Lấy chi tiết 1 tour theo ID
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

// Đừng quên export nó ra nhé
module.exports = { createTour, getAllTours, getTourById }; // <-- Sửa lại dòng này