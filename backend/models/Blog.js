const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  excerpt: { type: String },
  content: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', blogSchema);