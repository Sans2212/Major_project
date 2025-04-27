const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  createdAt: { type: Date, default: Date.now },
  otp: String,
otpExpiry: Date,

});

module.exports = userSchema;
