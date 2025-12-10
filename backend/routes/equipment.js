const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment');

router.get('/', async (req, res) => {
  try {
    const equipment = await Equipment.find();
    res.json({ ok: true, equipment });
  } catch (err) {
    res.status(400).json({ ok: false, message: err.message });
  }
});

module.exports = router;

