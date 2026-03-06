const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

// POST /api/auth/signup
router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password, phone, adminSecret } = req.body;
    if (!name || !email || !password || !phone) return res.status(400).json({ message: 'Name, email, password and phone are required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    let isAdmin = false;
    const total = await User.countDocuments();
    if (total === 0) isAdmin = true; // first user is admin
    if (!isAdmin && adminSecret && adminSecret === process.env.ADMIN_SECRET) isAdmin = true;

    const user = await User.create({ name, email, password: hashed, phone, isAdmin });
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, isAdmin: user.isAdmin } });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, isAdmin: user.isAdmin } });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me - get current user profile
router.get('/me', auth(), async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ id: user._id, name: user.name, email: user.email, phone: user.phone, isAdmin: user.isAdmin });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
