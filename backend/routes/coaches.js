const express = require('express');
const router = express.Router();
const Coach = require('../models/Coach');

router.get('/', async (req, res) => {
  try {
    const coaches = await Coach.find({ isActive: true });
    res.json({ ok: true, coaches });
  } catch (err) {
    res.status(400).json({ ok: false, message: err.message });
  }
});

module.exports = router;

