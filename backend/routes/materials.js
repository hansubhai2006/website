const express = require('express');
const router = express.Router();
const StudyMaterial = require('../models/StudyMaterial');
const auth = require('../middleware/auth');

router.get('/class/:classNum', auth, async (req, res) => {
  try {
    const materials = await StudyMaterial.find({ class: req.params.classNum }).sort('-createdAt');
    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Only teachers can add materials' });
    const material = new StudyMaterial(req.body);
    await material.save();
    res.status(201).json(material);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Forbidden' });
    await StudyMaterial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
