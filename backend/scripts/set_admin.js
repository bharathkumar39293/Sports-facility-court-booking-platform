require('dotenv').config();
const { connectDB } = require('../config/db');
const User = require('../models/User');

async function setAdmin(email) {
  await connectDB();
  const user = await User.findOne({ email });
  if (!user) {
    console.error('User not found:', email);
    process.exit(2);
  }
  if (user.role === 'admin') {
    console.log(`${email} is already an admin.`);
    process.exit(0);
  }
  user.role = 'admin';
  await user.save();
  console.log(`Role for ${email} set to 'admin'.`);
  process.exit(0);
}

const [,, email] = process.argv;
if (!email) {
  console.error('Usage: node set_admin.js <email>');
  process.exit(1);
}

setAdmin(email).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
