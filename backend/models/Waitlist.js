const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WaitlistSchema = new Schema({
  slotKey: { type: String, required: true, unique: true },
  users: [{ type: Schema.Types.ObjectId }]
});

module.exports = mongoose.model('Waitlist', WaitlistSchema);

