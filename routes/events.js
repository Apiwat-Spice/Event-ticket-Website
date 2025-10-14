const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const { isLoggedIn } = require('../middleware/auth');

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

router.post('/:id/book', isLoggedIn, async (req, res) => {
  try {
    const { quantity } = req.body;
    const event = await Event.findById(req.params.id);
    const user = await User.findById(req.session.user._id);

    if (!event) return res.status(404).send('ไม่พบอีเวนต์5');
    if (!user) return res.status(404).send('ไม่พบผู้ใช้');

    const qty = parseInt(quantity) || 1;
    const totalPrice = event.price * qty; // 💰 คำนวณราคารวม

    // ตรวจสอบจำนวนตั๋ว
    if ((event.soldTickets + qty) > event.totalTickets) {
      return res.render('events/detail', { event, error: 'ตั๋วไม่เพียงพอ' });
    }

    // ตรวจสอบเหรียญในกระเป๋า
    if (user.coins < totalPrice) {
      return res.render('events/detail', { event, error: 'เหรียญไม่เพียงพอ กรุณาเติมเหรียญก่อนจอง' });
    }

    // ✅ หักเหรียญ
    user.coins -= totalPrice;

    // ✅ สร้างตั๋วใหม่
    const ticket = new Ticket({
      event: event._id,
      buyer: user._id,
      quantity: qty,
      totalPrice: totalPrice,
    });

    // ✅ อัปเดตยอดขายอีเวนต์
    event.soldTickets += qty;

    // ✅ บันทึกข้อมูลทั้งหมด
    await Promise.all([user.save(), ticket.save(), event.save()]);

    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('เกิดข้อผิดพลาดในเซิร์ฟเวอร์');
  }
});


module.exports = router;
