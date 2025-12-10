const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EquipmentSchema = new Schema({
  name: String,
  type: { type: String },
  totalStock: Number,
  pricePerItem: Number
});

module.exports = mongoose.model('Equipment', EquipmentSchema);

