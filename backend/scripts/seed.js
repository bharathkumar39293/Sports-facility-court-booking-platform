require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('../config/db');
const Court = require('../models/Court');
const Coach = require('../models/Coach');
const Equipment = require('../models/Equipment');
const PricingRule = require('../models/PricingRule');
const fs = require('fs');
const path = require('path');

async function seed() {
  try {
    await connectDB();
    
    // Clear existing data
    await Court.deleteMany({});
    await Coach.deleteMany({});
    await Equipment.deleteMany({});
    await PricingRule.deleteMany({});
    
    // Load seed data
    const seedDataPath = path.join(__dirname, '../../seed-data.json');
    const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));
    
    // Insert data
    await Court.insertMany(seedData.courts);
    await Coach.insertMany(seedData.coaches);
    await Equipment.insertMany(seedData.equipment);
    await PricingRule.insertMany(seedData.pricingRules);
    
    console.log('✅ Database seeded successfully!');
    console.log(`   - ${seedData.courts.length} courts`);
    console.log(`   - ${seedData.coaches.length} coaches`);
    console.log(`   - ${seedData.equipment.length} equipment items`);
    console.log(`   - ${seedData.pricingRules.length} pricing rules`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();

