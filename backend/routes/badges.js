const express = require('express');
const router = express.Router();
const Badge = require('../models/Badge');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const badges = await Badge.find({ student: req.user._id }).sort('-earnedAt');
    res.json(badges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
