const express = require('express');
const router = express.Router();
const Level = require('../models/Level');
const Score = require('../models/Score');
const Badge = require('../models/Badge');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.get('/class/:classNum', auth, async (req, res) => {
  try {
    const levels = await Level.find({ class: req.params.classNum }).select('-questions').sort('levelNumber');
    const scores = await Score.find({ student: req.user._id });
    const scoreMap = {};
    scores.forEach(s => { scoreMap[s.level.toString()] = s; });
    const levelsWithProgress = levels.map(l => ({
      ...l.toObject(),
      userScore: scoreMap[l._id.toString()] || null
    }));
    res.json(levelsWithProgress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const level = await Level.findById(req.params.id);
    if (!level) return res.status(404).json({ message: 'Level not found' });
    res.json(level);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/submit', auth, async (req, res) => {
  try {
    const { answers, timeSpent } = req.body;
    const level = await Level.findById(req.params.id);
    if (!level) return res.status(404).json({ message: 'Level not found' });

    let earned = 0;
    let maxScore = 0;
    const results = level.questions.map((q, i) => {
      maxScore += q.points;
      const correct = Number(answers[i]) === q.correct;
      if (correct) earned += q.points;
      return { correct, correctAnswer: q.correct, yourAnswer: answers[i] };
    });

    const percentage = Math.round((earned / maxScore) * 100);
    const passed = percentage >= level.passingScore;

    const existing = await Score.findOne({ student: req.user._id, level: level._id });
    if (existing) {
      existing.attempts += 1;
      if (earned > existing.score) {
        existing.score = earned;
        existing.percentage = percentage;
        existing.passed = passed;
        existing.timeSpent = timeSpent;
      }
      await existing.save();
    } else {
      await Score.create({ student: req.user._id, level: level._id, score: earned, maxScore, percentage, timeSpent, passed });
    }

    if (passed) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { totalPoints: earned },
        $set: { currentLevel: level.levelNumber + 1 }
      });
      if (level.badge) {
        const badgeExists = await Badge.findOne({ student: req.user._id, badgeName: level.badge });
        if (!badgeExists) {
          await Badge.create({ student: req.user._id, badgeName: level.badge, description: `Completed Level ${level.levelNumber}: ${level.title}` });
        }
      }
    }

    res.json({ earned, maxScore, percentage, passed, results, passingScore: level.passingScore });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Teacher: create level
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Only teachers can create levels' });
    const level = new Level(req.body);
    await level.save();
    res.status(201).json(level);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
