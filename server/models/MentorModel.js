import mongoose from 'mongoose';
import { mentorConnection } from '../config/db.js';

const mentorSchema = new mongoose.Schema({
  profilePhoto: {
    type: String,
    default: null
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: {
    type: String,
    required: true,
  },
  
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

const Mentor = mentorConnection.models.Mentor || mentorConnection.model('Mentor', mentorSchema, 'Mentor');

export default Mentor;
