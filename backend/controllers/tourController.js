const Tour = require('../models/Tour');

// 1. [POST] /api/tours - Tạo tour mới (Dành cho Admin)
const createTour = async (req, res) => {
  try {
    // Kiểm tra dữ liệu bắt buộc
    const { title, city, price, duration, availableSeats, startDate, endDate, image, description, category } = req.body;
    
    if (!title || !city || !price || !duration || !availableSeats || !startDate || !endDate || !image || !description || !category) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin!' });
    }
    
    // Kiểm tra kiểu dữ liệu
    if (isNaN(price) || isNaN(availableSeats)) {
      return res.status(400).json({ success: false, message: 'Giá và ghế phải là con số!' });
    }
    
    if (Number(price) < 0 || Number(availableSeats) < 0) {
      return res.status(400).json({ success: false, message: 'Giá không được âm, ghế >= 0!' });
    }
    
    if (!duration || duration.trim() === '') {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập thời lượng tour (VD: 3 ngày 2 đêm)!' });
    }
    
    const newTour = new Tour(req.body);
    const savedTour = await newTour.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Tạo tour thành công!', 
      data: savedTour 
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Tên tour đã tồn tại!' });
    }
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
    const { title, city, price, duration, availableSeats, startDate, endDate, image, description, category } = req.body;
    
    // Kiểm tra dữ liệu nếu được cung cấp
    if (price !== undefined && (isNaN(price) || Number(price) < 0)) {
      return res.status(400).json({ success: false, message: 'Giá không được âm!' });
    }
    
    if (duration !== undefined && (!duration || duration.trim() === '')) {
      return res.status(400).json({ success: false, message: 'Thời lượng tour không được để trống!' });
    }
    
    if (availableSeats !== undefined && (isNaN(availableSeats) || Number(availableSeats) < 0)) {
      return res.status(400).json({ success: false, message: 'Số ghế không được âm!' });
    }
    
    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true } 
    );
    
    if (!updatedTour) {
      return res.status(404).json({ success: false, message: 'Tour không tồn tại!' });
    }
    
    res.status(200).json({
      success: true,
      message: "Cập nhật tour thành công!",
      data: updatedTour,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Tên tour đã tồn tại!' });
    }
    res.status(500).json({ success: false, message: "Lỗi khi cập nhật tour", error: err.message });
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

// 6. [GET] /api/tours/search/getTourBySearch - Tìm kiếm tour theo tên, thành phố, danh mục
const getTourBySearch = async (req, res) => {
  try {
    const { city, title, category } = req.query;
    const query = {};
    
    if (city) query.city = new RegExp(city, "i");
    if (title) query.title = new RegExp(title, "i");
    if (category) query.category = new RegExp(category, "i");
    
    const tours = await Tour.find(query);
    
    res.status(200).json({
      success: true,
      message: tours.length > 0 ? "Tìm thấy kết quả" : "Không tìm thấy tour phù hợp",
      count: tours.length,
      data: tours,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi khi tìm kiếm", error: err.message });
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