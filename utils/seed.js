require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Event = require('../models/Event');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('connected');

  const pass = await bcrypt.hash('password', 10);

  const organizer = new User({ name:'Organizer One', email:'org@example.com', passwordHash: pass, role:'organizer' });
  const attendee = new User({ name:'Attendee A', email:'att@example.com', passwordHash: pass, role:'attendee' });

  await User.deleteMany({});
  await Event.deleteMany({});
  await organizer.save();
  await attendee.save();

  const ev = new Event({
    title: 'งานคอนเสิร์ตตัวอย่าง',
    description: 'รายละเอียดงานตัวอย่าง',
    date: new Date(Date.now() + 7*24*3600*1000),
    location: 'สนามกีฬา A',
    totalTickets: 100,
    price: 500,
    organizer: organizer._id
  });
  await ev.save();

  console.log('seeded');
  process.exit(0);
})();
