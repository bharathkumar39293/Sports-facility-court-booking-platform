const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/acorn-globus';
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    console.error('\n💡 Solutions:');
    
    if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.error('\n🔴 IP ADDRESS NOT WHITELISTED:');
      console.error('   1. Go to MongoDB Atlas → Network Access');
      console.error('   2. Click "Add IP Address"');
      console.error('   3. Click "Add Current IP Address" (for local dev)');
      console.error('   4. Or add 0.0.0.0/0 (allows all IPs - for production)');
      console.error('   5. Wait 1-2 minutes, then try again');
      console.error('   Link: https://cloud.mongodb.com/v2#/security/network/list');
    }
    
    if (error.message.includes('authentication') || error.message.includes('bad auth')) {
      console.error('\n🔴 AUTHENTICATION ERROR:');
      console.error('   1. Check username and password in MONGODB_URI');
      console.error('   2. If password has special characters, URL encode them:');
      console.error('      @ = %40, # = %23, $ = %24, % = %25, & = %26, + = %2B, / = %2F');
      console.error('   3. Verify database user exists in Atlas → Database Access');
    }
    
    console.error('\n📋 Troubleshooting:');
    console.error('   1. Check if .env file exists in backend/ directory');
    console.error('   2. Verify MONGODB_URI format in .env:');
    console.error('      ✅ Correct: mongodb+srv://user:pass@cluster.mongodb.net/dbname');
    console.error('      ❌ Wrong: mongodb://user:pass@cluster.mongodb.net/dbname (missing +srv)');
    console.error('   3. Copy connection string from Atlas → Connect → Connect your application');
    console.error('   4. Replace <password> and <dbname> with actual values');
    console.error('   5. For local MongoDB: mongodb://localhost:27017/acorn-globus');
    process.exit(1);
  }
};

module.exports = { connectDB };

