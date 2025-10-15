const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, default: 1 },
  purchasedAt: { type: Date, default: Date.now },
  qrCodeData: { type: String }, 
  qrCodeId: { type: String, unique: true } 
});

module.exports = mongoose.model('Ticket', ticketSchema);
