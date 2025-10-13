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
  const { title, description, date, location, totalTickets, price } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';
  const event = new Event({
    title, description, date: date ? new Date(date) : undefined,
    location, totalTickets: parseInt(totalTickets) || 0, price: parseFloat(price) || 0,
    image, organizer: req.session.user._id
  });
  await event.save();
  res.redirect('/organizer/dashboard');
});

router.get('/events/:id/edit', isLoggedIn, isOrganizer, async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).send('ไม่พบอีเวนต์');
  if (String(event.organizer) !== String(req.session.user._id)) return res.status(403).send('ไม่อนุญาต');
  res.render('organizer/event_form', { event });
});

files_written = 0

module.exports = router;
