const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/acorn-globus';
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    console.error('\n💡 Solutions:');
    console.error('   1. Install MongoDB locally: https://www.mongodb.com/try/download/community');
    console.error('   2. Use MongoDB Atlas (free): https://www.mongodb.com/cloud/atlas');
    console.error('   3. Set MONGODB_URI in .env file (e.g., mongodb://localhost:27017/acorn-globus)');
    process.exit(1);
  }
};

module.exports = { connectDB };

