const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { name, regNo, password, role, class: studentClass } = req.body;
    if (!name || !regNo || !password) return res.status(400).json({ message: 'All fields are required' });
    const existing = await User.findOne({ regNo });
    if (existing) return res.status(400).json({ message: 'Registration number already exists' });
    const user = new User({ name, regNo, password, role: role || 'student', class: studentClass });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, regNo: user.regNo, role: user.role, class: user.class, totalPoints: 0, currentLevel: 1 }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { regNo, password } = req.body;
    if (!regNo || !password) return res.status(400).json({ message: 'RegNo and password required' });
    const user = await User.findOne({ regNo });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    user.lastLogin = new Date();
    user.loginStreak = (user.loginStreak || 0) + 1;
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user._id, name: user.name, regNo: user.regNo, role: user.role, class: user.class, totalPoints: user.totalPoints, currentLevel: user.currentLevel, loginStreak: user.loginStreak }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
