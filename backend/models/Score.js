const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  level: { type: mongoose.Schema.Types.ObjectId, ref: 'Level', required: true },
  score: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  percentage: { type: Number, required: true },
  timeSpent: { type: Number },
  attempts: { type: Number, default: 1 },
  passed: { type: Boolean, default: false },
  completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Score', scoreSchema);
