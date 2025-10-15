const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const upload = require('../middleware/upload');
const { uploadToCloudinary } = require('../middleware/cloudinary');
const { isLoggedIn, isOrganizer } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');

//get
router.get('/', async (req, res) => {
  const q = req.query.q || '';
  const filter = q ? { title: new RegExp(q, 'i') } : {};
  const events = await Event.find(filter).sort({ startDate: 1 }).populate('organizer');
  res.render('events/list', { events, q });
});

router.get('/:id', async (req, res) => {
  const event = await Event.findById(req.params.id).populate('organizer');
  if (!event) return res.status(404).send('ไม่พบอีเวนต์4');
  res.render('events/detail', { event });
});
//post
router.post('/:id/book', isLoggedIn, async (req, res) => {
  try {
    const { quantity } = req.body;
    const event = await Event.findById(req.params.id);
    const user = await User.findById(req.session.user._id);

    if (!event) return res.status(404).send('ไม่พบอีเวนต์');
    if (!user) return res.status(404).send('ไม่พบผู้ใช้');

    const qty = parseInt(quantity) || 1;
    const totalPrice = event.price * qty;

    if ((event.soldTickets + qty) > event.totalTickets) {
      return res.render('events/detail', { event, error: 'ตั๋วไม่เพียงพอ' });
    }

    if (user.coins < totalPrice) {
      return res.render('events/detail', { event, error: 'เหรียญไม่เพียงพอ กรุณาเติมเหรียญก่อนจอง' });
    }

    // หักเหรียญผู้ซื้อ
    user.coins -= totalPrice;

    // สร้างตั๋วแยกตามจำนวนที่ซื้อ
    const tickets = [];
    for (let i = 0; i < qty; i++) {
      const ticketId = uuidv4();
      const qrData = `http://localhost:3000/organizer/api/checkin/${ticketId}`;
      const qrCodeImage = await QRCode.toDataURL(qrData);

      const ticket = new Ticket({
        event: event._id,
        buyer: user._id,
        quantity: 1, // ใบละ 1
        totalPrice: event.price, // ราคาต่อตั๋ว
        qrCodeId: ticketId,
        qrCodeData: qrCodeImage
      });

      tickets.push(ticket);
    }

    // อัปเดตยอดขายอีเวนต์
    event.soldTickets += qty;

    // เพิ่มเงินให้ organizer
    const organizer = await User.findById(event.organizer);
    if (organizer) {
      organizer.coins += totalPrice;
      await organizer.save();
    }

    // บันทึก user, event และทุก ticket
    await Promise.all([user.save(), event.save(), ...tickets.map(t => t.save())]);

    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('เกิดข้อผิดพลาดในเซิร์ฟเวอร์');
  }
});



module.exports = router;
