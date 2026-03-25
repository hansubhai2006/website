const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String }],
  correct: { type: Number, required: true },
  points: { type: Number, default: 10 }
});

const levelSchema = new mongoose.Schema({
  levelNumber: { type: Number, required: true },
  class: { type: Number, required: true, min: 1, max: 4 },
  subject: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  questions: [questionSchema],
  passingScore: { type: Number, default: 60 },
  timeLimit: { type: Number, default: 300 },
  badge: { type: String },
  stars: { type: Number, default: 1 }
});

module.exports = mongoose.model('Level', levelSchema);
