const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const { isLoggedIn } = require('../middleware/auth');

router.get('/register', (req, res) => res.render('register'));
router.post('/register', async (req, res) => {
  const { firstname, lastname, Username, email, role, birthdate, password, Confirmpassword } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.render('register', { error: 'อีเมลนี้ถูกใช้แล้ว' });

    if (password !== Confirmpassword) {
      return res.render('register', { error: 'รหัสผ่านไม่ตรงกัน' });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const fullName = `${firstname} ${lastname}`;
    const user = new User({
      name: fullName,
      username: Username,
      email,
      birthdate,
      passwordHash: hash,
      role: role || 'attendee'
    });

    await user.save();
    // เก็บ session
    req.session.user = { _id: user._id, name: user.name, role: user.role, email: user.email };

    res.redirect('/events');
  } catch (err) {
    console.error(err);
    res.render('register', { error: 'เกิดข้อผิดพลาด' });
  }
});


router.get('/login', (req, res) => res.render('login'));
router.post('/login', async (req, res) => {
  const { username_or_email, password } = req.body; // ใช้แค่ 2 อย่าง

  try {
    // ค้นหาผู้ใช้โดย username หรือ email
    const user = await User.findOne({
      $or: [
        { email: username_or_email },
        { username: username_or_email }
      ]
    });

    if (!user) return res.render('login', { error: 'ไม่พบผู้ใช้' });

    const ok = await user.verifyPassword(password);
    if (!ok) return res.render('login', { error: 'รหัสผ่านไม่ถูกต้อง' });

    // เก็บข้อมูล session
    req.session.user = { _id: user._id, name: user.name, role: user.role, email: user.email };

    // redirect ตาม role
    if (user.role === 'organizer') return res.redirect('/organizer/dashboard');
    res.redirect('/events');

  } catch (err) {
    console.error(err);
    res.render('login', { error: 'เกิดข้อผิดพลาด' });
  }
});



router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

router.get('/profile', isLoggedIn, async (req, res) => {
  const tickets = await Ticket.find({ buyer: req.session.user._id })
    .populate('event')
    .sort({ purchasedAt: -1 });
  res.render('profile', { tickets });
});


router.get('/wallet', isLoggedIn, async (req, res) => {
  try {
    // สมมติว่ามีการเก็บ userId ใน session หลังจาก login แล้ว undefined
    const userId = req.session.user._id;
    if (!userId) {
      return res.redirect('/login');
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    res.render('wallet', { user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.post('/addcoin', isLoggedIn, async (req, res) => {
  try {
    const userId = req.session.user._id;
    const amount = parseInt(req.body.coin); // จำนวนเหรียญที่ผู้ใช้กรอก

    // ตรวจสอบว่าจำนวนที่กรอกถูกต้องไหม
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).send('จำนวนเหรียญไม่ถูกต้อง');
    }

    // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('ไม่พบผู้ใช้');
    }

    // ✅ บวกเหรียญเพิ่ม
    user.coins += amount;

    await user.save(); // บันทึกข้อมูลกลับลงฐานข้อมูล

    // redirect กลับไปหน้า wallet พร้อมแสดงยอดใหม่
    res.render('wallet', { user });
  } catch (err) {
    console.error(err);
    res.status(500).send('เกิดข้อผิดพลาดในเซิร์ฟเวอร์');
  }
});
router.post('/delcoin', isLoggedIn, async (req, res) => {
  try {
    const userId = req.session.user._id;
    const amount = parseInt(req.body.coin); // จำนวนเหรียญที่ผู้ใช้กรอก

    // ตรวจสอบค่าที่กรอก
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).send('จำนวนเหรียญไม่ถูกต้อง');
    }

    // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('ไม่พบผู้ใช้');
    }

    // ✅ ตรวจสอบว่าเหรียญพอไหม
    if (user.coins < amount) {
      return res.status(400).send(`เหรียญไม่พอในกระเป๋า (มี ${user.coins} เหรียญ)`);
    }

    // ✅ ลบเหรียญออก
    user.coins -= amount;

    await user.save(); // บันทึกข้อมูลกลับลงฐานข้อมูล

    // render กลับหน้า wallet พร้อมยอดใหม่
    res.render('wallet', { user });
  } catch (err) {
    console.error(err);
    res.status(500).send('เกิดข้อผิดพลาดในเซิร์ฟเวอร์');
  }
});
router.get('/editprofile', isLoggedIn, async (req, res) => {
  try {
    const userId = req.session.user._id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).send('User not found');

    // แยกชื่อก่อนส่งไป EJS
    const parts = (user.name || '').trim().split(' ');
    const firstname = parts[0] || '';
    const lastname = parts.slice(1).join(' ') || '';

    res.render('editprofile', { user, firstname, lastname });
  } catch (err) {
    console.error("edit profile GET error:", err);
    res.status(500).send('Server error');
  }
});

router.post('/editprofile', isLoggedIn, async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { firstname, lastname, Username, role, birthdate } = req.body;

    // รวมชื่อให้เหมือน register
    const fullName = `${firstname} ${lastname}`;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: fullName,
        username: Username,
        role: role || 'attendee',
        birthdate
      },
      { new: true }
    );

    // อัปเดต session ด้วย (จะได้โชว์ชื่อใหม่ทันที)
    req.session.user.name = updatedUser.name;
    req.session.user.role = updatedUser.role;
    req.session.user.email = updatedUser.email;
    const tickets = await Ticket.find({ buyer: req.session.user._id })
      .populate('event')
      .sort({ purchasedAt: -1 });
    res.render('profile', { tickets }); // หรือจะ redirect ก็ได้ เช่น res.redirect('/wallet')
  } catch (err) {
    console.error("edit profile POST error:", err);
    res.status(500).send('เกิดข้อผิดพลาดในเซิร์ฟเวอร์');
  }
});



module.exports = router;
