const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AvailabilitySchema = new Schema({
  dayOfWeek: Number, // 0-6
  startTime: String, // '09:00'
  endTime: String
}, { _id: false });

const CoachSchema = new Schema({
  name: String,
  hourlyRate: Number,
  availability: [AvailabilitySchema],
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Coach', CoachSchema);

