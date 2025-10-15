const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const { isLoggedIn, isOrganizer } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadToCloudinary } = require('../middleware/cloudinary');

// ✅ GET dashboard
router.get('/dashboard', isLoggedIn, isOrganizer, async (req, res) => {
  const events = await Event.find({ organizer: req.session.user._id });
  res.render('organizer/dashboard', { events });
});

// ✅ GET new event form
router.get('/events/new', isLoggedIn, isOrganizer, (req, res) => {
  res.render('organizer/event_form', { event: {} });
});

// ✅ GET tickets for specific event
router.get('/events/:id/tickets', isLoggedIn, isOrganizer, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).send('ไม่พบอีเวนต์');
    if (String(event.organizer) !== String(req.session.user._id)) {
      return res.status(403).send('คุณไม่สามารถดูอีเวนต์นี้ได้');
    }

    const tickets = await Ticket.find({ event: event._id })
      .populate('buyer', 'name email')
      .sort({ purchasedAt: -1 });

    res.render('organizer/tickets', { event, tickets });
  } catch (err) {
    console.error(err);
    res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลตั๋ว');
  }
});

// ✅ GET edit form
router.get('/events/:id/edit', isLoggedIn, isOrganizer, async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).send('ไม่พบอีเวนต์2');
  if (String(event.organizer) !== String(req.session.user._id))
    return res.status(403).send('ไม่อนุญาต');
  res.render('organizer/event_form', { event });
});

// ✅ CREATE EVENT (อัปโหลดขึ้น Cloudinary)
router.post('/events', isLoggedIn, isOrganizer, upload.single('image'), async (req, res) => {
  try {
    const { title, description, startDate, endDate, location, totalTickets, price } = req.body;

    let imageUrl = '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url; // ลิงก์จริงจาก Cloudinary
    }

    const event = new Event({
      title,
      description,
      startDate,
      endDate,
      location,
      totalTickets,
      price,
      image: imageUrl,
      organizer: req.session.user._id
    });

    await event.save();
    res.redirect('/organizer/dashboard');
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).send('เกิดข้อผิดพลาดระหว่างเพิ่มอีเวนต์');
  }
});


// ✅ UPDATE EVENT (อัปโหลดรูปใหม่ขึ้น Cloudinary ถ้ามี)
router.put('/events/:id', isLoggedIn, isOrganizer, upload.single('image'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).send('ไม่พบอีเวนต์');
    if (String(event.organizer) !== String(req.session.user._id)) {
      return res.status(403).send('คุณไม่มีสิทธิ์แก้ไขอีเวนต์นี้');
    }

    const { title, description, startDate, endDate, location, totalTickets, price } = req.body;
    event.title = title;
    event.description = description;
    event.startDate = startDate ? new Date(startDate) : event.startDate;
    event.endDate = endDate ? new Date(endDate) : event.endDate;
    event.location = location;
    event.totalTickets = parseInt(totalTickets) || event.totalTickets;
    event.price = parseFloat(price) || event.price;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      event.image = result.secure_url;
    }

    await event.save();
    res.redirect('/organizer/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('เกิดข้อผิดพลาดระหว่างแก้ไขอีเวนต์');
  }
});

// ✅ DELETE EVENT
router.delete('/events/:id', isLoggedIn, isOrganizer, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).send('ไม่พบอีเวนต์3');
    if (String(event.organizer) !== String(req.session.user._id)) {
      return res.status(403).send('ไม่อนุญาตให้ลบอีเวนต์นี้');
    }
    await event.deleteOne();
    res.redirect('/organizer/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('เกิดข้อผิดพลาดระหว่างลบอีเวนต์');
  }
});

module.exports = router;
