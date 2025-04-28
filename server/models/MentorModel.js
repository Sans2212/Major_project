// server/models/MentorModel.js
const mongoose = require('mongoose');
const { mentorConnection } = require('../config/db');

// Define the schema
const mentorSchema = new mongoose.Schema({
  profilePhoto: Buffer,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
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
  createdAt: { type: Date, default: Date.now },
});

// Register the model only once, and always with the same case: 'Mentor'
const MentorModel = mentorConnection.models.Mentor || mentorConnection.model('Mentor', mentorSchema, 'Mentor');


module.exports = MentorModel;
