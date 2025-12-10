const express = require('express');
const router = express.Router();
const PricingRule = require('../models/PricingRule');

router.get('/rules', async (req, res) => {
  try {
    const rules = await PricingRule.find({ isActive: true });
    res.json({ ok: true, rules });
  } catch (err) {
    res.status(400).json({ ok: false, message: err.message });
  }
});

module.exports = router;

