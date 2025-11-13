require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const connectDB = require('../config/db');

(async () => {
  try {
    await connectDB();
    const email = process.env.ADMIN_EMAIL;
    const pass = process.env.ADMIN_PASSWORD;
    if (!email || !pass) {
      console.error('ADMIN_EMAIL and ADMIN_PASSWORD required in .env');
      process.exit(1);
    }

    let admin = await User.findOne({ email });
    if (admin) {
      console.log('Admin already exists:', email);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(pass, 10);
    admin = await User.create({ name: 'Admin', email, password: hashed, role: 'admin' });
    console.log('Admin created:', admin.email);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
