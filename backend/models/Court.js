const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourtSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['indoor', 'outdoor'], required: true },
  basePrice: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Court', CourtSchema);

