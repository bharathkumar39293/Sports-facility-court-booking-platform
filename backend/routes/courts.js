const express = require('express');
const router = express.Router();
const Court = require('../models/Court');
const Booking = require('../models/Booking');

router.get('/', async (req, res) => {
  try {
    const courts = await Court.find({ isActive: true });
    res.json({ ok: true, courts });
  } catch (err) {
    res.status(400).json({ ok: false, message: err.message });
  }
});

router.get('/slots', async (req, res) => {
  try {
    const { date } = req.query;
    const courts = await Court.find({ isActive: true });
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      startTime: { $gte: startOfDay, $lte: endOfDay },
      status: 'confirmed'
    });

    const slots = [];
    for (let hour = 8; hour < 22; hour++) {
      for (const court of courts) {
        const slotStart = new Date(startOfDay);
        slotStart.setHours(hour, 0, 0, 0);
        const slotEnd = new Date(slotStart);
        slotEnd.setHours(hour + 1, 0, 0, 0);

        const isBooked = bookings.some(b => 
          b.courtId.toString() === court._id.toString() &&
          b.startTime < slotEnd && b.endTime > slotStart
        );

        slots.push({
          courtId: court._id,
          courtName: court.name,
          startTime: slotStart,
          endTime: slotEnd,
          available: !isBooked
        });
      }
    }

    res.json({ ok: true, slots });
  } catch (err) {
    res.status(400).json({ ok: false, message: err.message });
  }
});

module.exports = router;

