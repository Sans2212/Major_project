import mongoose from 'mongoose';

const mentorSchema = new mongoose.Schema({
  profilePhoto: Buffer,
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, required: true },
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
  createdAt: { type: Date, default: Date.now }
});

export default mentorSchema; // Use export default in ES module syntax
