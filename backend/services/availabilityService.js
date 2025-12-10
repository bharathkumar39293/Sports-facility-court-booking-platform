const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');

// check overlap utility
function overlaps(aStart, aEnd, bStart, bEnd) {
  return (aStart < bEnd && bStart < aEnd);
}

async function isCourtAvailable(courtId, startTime, endTime) {
  const conflict = await Booking.findOne({ courtId, status: 'confirmed',
    $or: [
      { startTime: { $lt: endTime, $gte: startTime } },
      { endTime: { $gt: startTime, $lte: endTime } },
      { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
    ]
  });
  return !conflict;
}

async function isCoachAvailable(coachId, startTime, endTime) {
  const conflict = await Booking.findOne({ coachId, status: 'confirmed',
    $or: [
      { startTime: { $lt: endTime, $gte: startTime } },
      { endTime: { $gt: startTime, $lte: endTime } },
      { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
    ]
  });
  return !conflict;
}

async function isEquipmentAvailable(equipmentRequests, startTime, endTime) {
  // equipmentRequests: { racketCount: n, shoeCount: m }
  // fetch all bookings overlapping and count equipment usage

  const overlapping = await Booking.find({ status: 'confirmed',
    $or: [
      { startTime: { $lt: endTime, $gte: startTime } },
      { endTime: { $gt: startTime, $lte: endTime } },
      { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
    ]
  });

  // sum usage
  let usedRackets = 0, usedShoes = 0;
  overlapping.forEach(b => {
    usedRackets += (b.equipment?.racketCount || 0);
    usedShoes += (b.equipment?.shoeCount || 0);
  });

  const racketDoc = await Equipment.findOne({ type: 'racket' });
  const shoeDoc = await Equipment.findOne({ type: 'shoe' });

  const availableRackets = (racketDoc?.totalStock || 0) - usedRackets;
  const availableShoes = (shoeDoc?.totalStock || 0) - usedShoes;

  return {
    racketOk: availableRackets >= (equipmentRequests.racketCount || 0),
    shoeOk: availableShoes >= (equipmentRequests.shoeCount || 0)
  };
}

module.exports = { isCourtAvailable, isCoachAvailable, isEquipmentAvailable };

