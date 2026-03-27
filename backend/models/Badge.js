const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  badgeName: { type: String, required: true },
  badgeIcon: { type: String, default: '🏆' },
  description: { type: String },
  earnedAt: { type: Date, default: Date.now }
});
//
module.exports = mongoose.model('Badge', badgeSchema);
