// server/models/mentorModel.js
const { mentorConnection } = require('../config/db');
const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  profilePhoto: Buffer,
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  jobTitle: String,
  company: String,
  location: String,
  category: String,
  skills: String,
  bio: String,
  linkedin: String,
  twitter: String,
  website: String,
  introVideo: String,
  createdAt: { type: Date, default: Date.now },
});

// ✅ Fix: use a unique model name like 'Mentor'
const MentorModel = mentorConnection.models.Mentor || mentorConnection.model('Mentor', mentorSchema);

module.exports = MentorModel;
