const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const classNum = req.user.class || req.query.class;
    const messages = await Message.find({ class: classNum }).sort({ createdAt: 1 }).limit(100);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ message: 'Message cannot be empty' });
    const message = new Message({
      sender: req.user._id,
      senderName: req.user.name,
      content: content.trim(),
      isFromStudent: req.user.role === 'student',
      class: req.user.class || req.body.class
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
