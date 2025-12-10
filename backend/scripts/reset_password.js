require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function resetPassword(email, newPassword) {
  await connectDB();
  const user = await User.findOne({ email });
  if (!user) {
    console.error('User not found:', email);
    process.exit(2);
  }
  const hash = await bcrypt.hash(newPassword, 10);
  user.password = hash;
  await user.save();
  console.log(`Password for ${email} has been updated.`);
  process.exit(0);
}

const [,, email, newPassword] = process.argv;
if (!email || !newPassword) {
  console.error('Usage: node reset_password.js <email> <newPassword>');
  process.exit(1);
}

resetPassword(email, newPassword).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
