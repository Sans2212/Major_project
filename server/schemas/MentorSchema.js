const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  profilePhoto: Buffer,
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  jobTitle: String,
  company: String,
  country: String,
  category: String,
  skills: String,
  bio: String,
  linkedin: String,
  twitter: String,
  website: String,
  introVideo: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mentorSchema;
