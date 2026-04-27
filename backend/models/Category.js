const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    type: { type: String, enum: ['Trong nước', 'Quốc tế'], default: 'Trong nước' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
