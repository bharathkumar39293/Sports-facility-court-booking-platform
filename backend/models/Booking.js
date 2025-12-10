const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  courtId: { type: Schema.Types.ObjectId, ref: 'Court', required: true },
  coachId: { type: Schema.Types.ObjectId, ref: 'Coach' },
  equipment: {
    racketCount: { type: Number, default: 0 },
    shoeCount: { type: Number, default: 0 }
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  pricingBreakdown: Schema.Types.Mixed,
  status: { type: String, enum: ['confirmed', 'cancelled', 'waitlist'], default: 'confirmed' },
  createdAt: { type: Date, default: Date.now }
});

BookingSchema.index({ courtId: 1, startTime: 1, endTime: 1 });
module.exports = mongoose.model('Booking', BookingSchema);

