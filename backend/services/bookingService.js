const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const { isCourtAvailable, isCoachAvailable, isEquipmentAvailable } = require('./availabilityService');
const { calculatePrice } = require('./pricingService');

async function createBooking({ userId, courtId, coachId, equipment, startTime, endTime }) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // 1. availability checks
    const courtOk = await isCourtAvailable(courtId, startTime, endTime);
    if (!courtOk) throw new Error('Court not available');

    if (coachId) {
      const coachOk = await isCoachAvailable(coachId, startTime, endTime);
      if (!coachOk) throw new Error('Coach not available');
    }

    const equipOk = await isEquipmentAvailable(equipment, startTime, endTime);
    if (!equipOk.racketOk || !equipOk.shoeOk) throw new Error('Equipment not available');

    // 2. fetch court and coach models for pricing
    const Court = require('../models/Court');
    const Coach = require('../models/Coach');
    const court = await Court.findById(courtId);
    const coach = coachId ? await Coach.findById(coachId) : null;

    // 3. calculate pricing
    const pricingBreakdown = await calculatePrice({ court, startTime, endTime, equipment, coach });

    // 4. create booking
    const booking = new Booking({ userId, courtId, coachId, equipment, startTime, endTime, pricingBreakdown });
    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();
    return booking;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

module.exports = { createBooking };

