/**
 * utils/seed.js
 * Seeds one demo user for each role so the system is testable immediately.
 * Run: node utils/seed.js
 */

const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const path     = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Inventory = require('../models/Inventory');

const seedUsers = [
  {
    name: 'Admin User',
    email: 'admin@dispensary.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Dr. Priya Sharma',
    email: 'doctor@dispensary.com',
    password: 'doctor123',
    role: 'doctor',
    specialization: 'General Physician',
  },
  {
    name: 'Raj Pharmacist',
    email: 'pharmacist@dispensary.com',
    password: 'pharma123',
    role: 'pharmacist',
  },
  {
    name: 'Amit Kumar',
    email: 'patient@dispensary.com',
    password: 'patient123',
    role: 'patient',
  },
];

const seedInventory = [
  { medicineName: 'Paracetamol',   quantity: 200, unit: 'tablets' },
  { medicineName: 'Amoxicillin',   quantity: 100, unit: 'capsules' },
  { medicineName: 'Ibuprofen',     quantity: 150, unit: 'tablets' },
  { medicineName: 'Cetirizine',    quantity: 80,  unit: 'tablets' },
  { medicineName: 'ORS Sachet',    quantity: 50,  unit: 'sachets' },
  { medicineName: 'Antacid Syrup', quantity: 30,  unit: 'bottles' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing demo data
    await User.deleteMany({});
    await Inventory.deleteMany({});

    // Create users (passwords are hashed via pre-save hook)
    for (const u of seedUsers) {
      await User.create(u);
      console.log(`✅  Created ${u.role}: ${u.email}`);
    }

    // Seed inventory
    await Inventory.insertMany(seedInventory);
    console.log(`✅  Seeded ${seedInventory.length} inventory items`);

    console.log('\n🎉  Seed complete! Login credentials:');
    console.log('   Admin:      admin@dispensary.com     / admin123');
    console.log('   Doctor:     doctor@dispensary.com    / doctor123');
    console.log('   Pharmacist: pharmacist@dispensary.com/ pharma123');
    console.log('   Patient:    patient@dispensary.com   / patient123');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
