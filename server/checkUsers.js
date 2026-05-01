const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const count = await User.countDocuments();
    console.log(`User count: ${count}`);
    const users = await User.find({}, 'email role');
    console.log('Users in DB:', users);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkUsers();
