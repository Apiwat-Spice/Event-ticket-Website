const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // เก็บ firstname + lastname รวมกัน
  username: { type: String, required: true, unique: true }, // เพิ่ม username ถ้าต้องการ
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['attendee','organizer'], default: 'attendee' },
  birthdate: { type: Date }, // เก็บวันเกิด
  coins: { type: Number, default: 100 }, // เงินเริ่มต้น 100 coin
  createdAt: { type: Date, default: Date.now }
});

// ฟังก์ชันตรวจสอบรหัสผ่าน
userSchema.methods.verifyPassword = function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
