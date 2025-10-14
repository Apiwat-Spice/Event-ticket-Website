const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const { isLoggedIn, isOrganizer } = require('../middleware/auth');

const upload = multer({
  dest: path.join(__dirname, '..', 'public', 'uploads'),
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/dashboard', isLoggedIn, isOrganizer, async (req, res) => {
  const events = await Event.find({ organizer: req.session.user._id });


  res.render('organizer/dashboard', { events });
});

router.get('/events/new', isLoggedIn, isOrganizer, (req, res) => {
  res.render('organizer/event_form', { event: {} });
});

router.post('/events', isLoggedIn, isOrganizer, upload.single('image'), async (req, res) => {
  const { title, description, startDate, endDate, location, totalTickets, price } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';
  const event = new Event({
    title,
    description,
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
    location,
    totalTickets: parseInt(totalTickets) || 0,
    price: parseFloat(price) || 0,
    image: req.file ? req.file.path : '',
    organizer: req.session.user._id
  });
  await event.save();
  res.redirect('/organizer/dashboard');
});

router.get('/events/:id/edit', isLoggedIn, isOrganizer, async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).send('ไม่พบอีเวนต์2');
  if (String(event.organizer) !== String(req.session.user._id)) return res.status(403).send('ไม่อนุญาต');
  res.render('organizer/event_form', { event });
});

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

router.put('/events/:id', isLoggedIn, isOrganizer, upload.single('image'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).send('ไม่พบอีเวนต์1');
    if (String(event.organizer) !== String(req.session.user._id)) {
      return res.status(403).send('ไม่อนุญาตให้แก้ไขอีเวนต์นี้');
    }

    const { title, description, startDate, endDate, location, totalTickets, price } = req.body;
    event.title = title;
    event.description = description;
    event.startDate = startDate ? new Date(startDate) : event.startDate;
    event.endDate = endDate ? new Date(endDate) : event.endDate;
    event.location = location;
    event.totalTickets = parseInt(totalTickets) || 0;
    event.price = parseFloat(price) || 0;

    if (req.file) event.image = req.file.path;

    await event.save();
    res.redirect('/organizer/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('เกิดข้อผิดพลาดระหว่างแก้ไขอีเวนต์');
  }
});

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

files_written = 0

module.exports = router;
