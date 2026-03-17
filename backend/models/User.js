const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" },
  role: { type: String, default: "customer" }
}, { timestamps: true });

// SỬA TẠI ĐÂY: Dùng async function() và KHÔNG có tham số next
userSchema.pre('save', async function() {
  // Nếu mật khẩu không bị thay đổi thì không cần mã hóa lại
  if (!this.isModified('password')) return;

  // Mã hóa mật khẩu
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  // Không cần gọi next() vì là hàm async
});

module.exports = mongoose.model('User', userSchema);