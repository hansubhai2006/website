const express = require('express');
const router = express.Router();
const Score = require('../models/Score');
const Badge = require('../models/Badge');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.get('/report', auth, async (req, res) => {
  try {
    const studentId = (req.user.role === 'teacher' && req.query.studentId) ? req.query.studentId : req.user._id;
    const scores = await Score.find({ student: studentId }).populate('level', 'title subject levelNumber class');
    const badges = await Badge.find({ student: studentId });
    const user = await User.findById(studentId).select('-password');

    const totalAttempts = scores.reduce((sum, s) => sum + s.attempts, 0);
    const passedLevels = scores.filter(s => s.passed).length;
    const avgScore = scores.length ? Math.round(scores.reduce((sum, s) => sum + s.percentage, 0) / scores.length) : 0;

    res.json({
      user,
      scores,
      badges,
      stats: { totalAttempts, passedLevels, avgScore, totalPoints: user.totalPoints, loginStreak: user.loginStreak }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/students', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Forbidden' });
    const query = { role: 'student' };
    if (req.query.class) query.class = req.query.class;
    const students = await User.find(query).select('-password');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
