const { createBooking } = require('../services/bookingService');
const { calculatePrice } = require('../services/pricingService');

exports.previewPrice = async (req, res) => {
  try {
    const { courtId, startTime, endTime, equipment, coachId } = req.body;
    const Court = require('../models/Court');
    const Coach = require('../models/Coach');
    const court = await Court.findById(courtId);
    const coach = coachId ? await Coach.findById(coachId) : null;
    const breakdown = await calculatePrice({ court, startTime, endTime, equipment, coach });
    res.json({ ok: true, breakdown });
  } catch (err) {
    res.status(400).json({ ok: false, message: err.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { userId: bodyUserId, courtId, coachId, equipment, startTime, endTime } = req.body;
    // use authenticated user id unless caller is admin and provided a different userId
    const requester = req.user;
    const userId = (requester && requester.role === 'admin' && bodyUserId) ? bodyUserId : (requester && requester.id);
    if (!userId) return res.status(401).json({ ok: false, message: 'Not authenticated' });
    const booking = await createBooking({ userId, courtId, coachId, equipment, startTime, endTime });
    res.json({ ok: true, booking });
  } catch (err) {
    res.status(400).json({ ok: false, message: err.message });
  }
};

exports.history = async (req, res) => {
  try {
    const Booking = require('../models/Booking');
    const userId = req.params.userId;
    const requester = req.user;
    if (!requester) return res.status(401).json({ ok: false, message: 'Not authenticated' });

    const isAll = requester.role === 'admin' && userId === 'all';
    if (!isAll && requester.role !== 'admin' && requester.id !== userId) {
      return res.status(403).json({ ok: false, message: 'Forbidden' });
    }

    const query = isAll ? {} : { userId };
    const list = await Booking.find(query)
      .populate('userId', 'name email')
      .populate('courtId', 'name type')
      .populate('coachId', 'name')
      .sort({ startTime: -1 })
      .limit(isAll ? 200 : 100);
    res.json({ ok: true, list });
  } catch (err) {
    res.status(400).json({ ok: false, message: err.message });
  }
};

exports.cancel = async (req, res) => {
  try {
    const Booking = require('../models/Booking');
    const { bookingId } = req.params;
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: 'cancelled' },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ ok: false, message: 'Booking not found' });
    }
    // only allow owner or admin to cancel
    const requester = req.user;
    if (!requester) return res.status(401).json({ ok: false, message: 'Not authenticated' });
    const ownerId = booking.userId?.toString();
    if (requester.role !== 'admin' && requester.id !== ownerId) {
      return res.status(403).json({ ok: false, message: 'Forbidden' });
    }
    res.json({ ok: true, booking });
  } catch (err) {
    res.status(400).json({ ok: false, message: err.message });
  }
};

