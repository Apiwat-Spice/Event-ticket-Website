const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, default: 1 },
  purchasedAt: { type: Date, default: Date.now },
  qrCodeId: { type: String, unique: true },
  qrCodeData: { type: String }, // ✅ เพิ่มฟิลด์นี้
  checkedIn: { type: Boolean, default: false }
});

module.exports = mongoose.model('Ticket', ticketSchema);
