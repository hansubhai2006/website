const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
  class: { type: Number, required: true, min: 1, max: 4 },
  subject: { type: String, required: true },
  type: { type: String, enum: ['video', 'pdf', 'notes'], required: true },
  title: { type: String, required: true },
  description: { type: String },
  link: { type: String, required: true },
  thumbnail: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
