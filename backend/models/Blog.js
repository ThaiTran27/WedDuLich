const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true }, // Nội dung chi tiết của bài viết
  image: { type: String, required: true },
  author: { type: String, default: 'Admin Du Lịch Việt' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', blogSchema);