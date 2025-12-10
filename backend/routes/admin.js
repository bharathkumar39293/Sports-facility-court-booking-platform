const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Protect admin routes: must be authenticated and an admin
router.use(authMiddleware);
router.use(adminMiddleware);
const Court = require('../models/Court');
const Coach = require('../models/Coach');
const Equipment = require('../models/Equipment');
const PricingRule = require('../models/PricingRule');
const Booking = require('../models/Booking');
const User = require('../models/User');

// ========== COURTS ==========
router.get('/courts', async (req, res) => {
  try {
    const courts = await Court.find();
    res.json({ ok: true, courts });
  } catch (err) {
    res.status(400).json({ ok: false, message: err.message });
  }
});

router.post('/courts', async (req, res) => {
  try {
    const { name, type, basePrice } = req.body;
    const court = new Court({ name, type, basePrice });
    await court.save();
    res.json({ ok: true, court });
  } catch (err) {
    res.status(400).json({ ok: false, message: err.message });
  }
});

router.put('/courts/:id', async (req, res) => {
  try {
    const { name, type, basePrice, isActive } = req.body;
    const court = await Court.findByIdAndUpdate(
      req.params.id,
      { name, type, basePrice, isActive },
      { new: true }
    );
    res.json({ ok: true, court });
  } catch (err) {
    res.status(400).json({ ok: false, message: err.message });
  }
});

router.delete('/courts/:id', async (req, res) => {
  try {
    await Court.findByIdAndDelete(req.params.id);
    res.json({ ok: true, message: 'Court deleted' });
  } catch (err) {
    res.status(400).json({ ok: false, message: err.message });
  }
});

// ========== COACHES ==========
router.get('/coaches', async (req, res) => {
  try {
    const coaches = await Coach.find();
    res.json({ ok: true, coaches });
  } catch (err) {
    res.status(400).json({ ok: false, message: err.message });
  }
});

router.post('/coaches', async (req, res) => {
  try {
    const { name, hourlyRate, availability, isActive } = req.body;
    const coach = new Coach({ name, hourlyRate, availability, isActive });
    await coach.save();
    res.json({ ok: true, coach });
  } catch (err) {
    res.status(400).json({ ok: false, message: err.message });
  }
});

router.put('/coaches/:id', async (req, res) => {
  try {
    const { name, hourlyRate, availability, isActive } = req.body;
    const coach = await Coach.findByIdAndUpdate(
      req.params.id,
      { name, hourlyRate, availability, isActive },
      { new: true }
    );
    res.json({ ok: true, coach });
  } catch (err) {
    res.status(400).json({ ok: false, message: err.message });
  }
});

router.delete('/coaches/:id', async (req, res) => {
  try {
    await Coach.findByIdAndDelete(req.params.id);
    res.json({ ok: true, message: 'Coach deleted' });
  } catch (err) {
    res.status(400).json({ ok: false, message: err.message });
  }
});

// ========== EQUIPMENT ==========
router.get('/equipment', async (req, res) => {
  try {
    const equipment = await Equipment.find();
    res.json({ ok: true, equipment });
  } catch (err) {
    res.status(400).json({ ok: false, message: err.message });
  }
});

router.post('/equipment', async (req, res) => {
  try {
    const { name, type, totalStock, pricePerItem } = req.body;
    const equipment = new Equipment({ name, type, totalStock, pricePerItem });
    await equipment.save();
    res.json({ ok: true, equipment });
  } catch (err) {
    res.status(400).json({ ok: false, message: err.message });
  }
});

router.put('/equipment/:id', async (req, res) => {
  try {
    const { name, type, totalStock, pricePerItem } = req.body;
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      { name, type, totalStock, pricePerItem },
      { new: true }
    );
    res.json({ ok: true, equipment });
  } catch (err) {
    res.status(400).json({ ok: false, message: err.message });
  }
});

router.delete('/equipment/:id', async (req, res) => {
  try {
    await Equipment.findByIdAndDelete(req.params.id);
    res.json({ ok: true, message: 'Equipment deleted' });
  } catch (err) {
    res.status(400).json({ ok: false, message: err.message });
  }
});

// ========== PRICING RULES ==========
router.get('/pricing-rules', async (req, res) => {
  try {
    const rules = await PricingRule.find();
    res.json({ ok: true, rules });
  } catch (err) {
    res.status(400).json({ ok: false, message: err.message });
  }
});

router.post('/pricing-rules', async (req, res) => {
  try {
    const { name, ruleType, isActive, config } = req.body;
    const rule = new PricingRule({ name, ruleType, isActive, config });
    await rule.save();
    res.json({ ok: true, rule });
  } catch (err) {
    res.status(400).json({ ok: false, message: err.message });
  }
});

router.put('/pricing-rules/:id', async (req, res) => {
  try {
    const { name, ruleType, isActive, config } = req.body;
    const rule = await PricingRule.findByIdAndUpdate(
      req.params.id,
      { name, ruleType, isActive, config },
      { new: true }
    );
    res.json({ ok: true, rule });
  } catch (err) {
    res.status(400).json({ ok: false, message: err.message });
  }
});

router.delete('/pricing-rules/:id', async (req, res) => {
  try {
    await PricingRule.findByIdAndDelete(req.params.id);
    res.json({ ok: true, message: 'Pricing rule deleted' });
  } catch (err) {
    res.status(400).json({ ok: false, message: err.message });
  }
});

// ========== BOOKINGS ==========
router.get('/bookings', async (req, res) => {
  try {
    const list = await Booking.find({})
      .populate('userId', 'name email')
      .populate('courtId', 'name type')
      .populate('coachId', 'name')
      .sort({ startTime: -1 })
      .limit(200);
    res.json({ ok: true, list });
  } catch (err) {
    res.status(400).json({ ok: false, message: err.message });
  }
});

module.exports = router;

