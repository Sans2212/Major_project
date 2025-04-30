import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { mentorConnection } from '../config/db.js';

const mentorSchema = new mongoose.Schema({
  profilePhoto: {
    type: String,
    default: null
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { 
    type: String, 
    unique: true, 
    required: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters long']
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
}, {
  timestamps: true
});

// Hash password before saving
mentorSchema.pre('save', async function(next) {
  try {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
      console.log('Password not modified, skipping hashing');
      return next();
    }

    console.log('Hashing password for mentor:', this.email);
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(this.password, salt);
    console.log('Password hashed successfully');
    this.password = hashedPassword;
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error);
  }
});

// Method to check if password is valid
mentorSchema.methods.isValidPassword = async function(password) {
  try {
    console.log('Validating password for mentor:', this.email);
    console.log('Stored hashed password:', this.password);
    console.log('Attempting to compare with provided password');
    const isValid = await bcryptjs.compare(password, this.password);
    console.log('Password validation result:', isValid);
    return isValid;
  } catch (error) {
    console.error('Error validating password:', error);
    throw error;
  }
};

const Mentor = mentorConnection.models.Mentor || mentorConnection.model('Mentor', mentorSchema);

export default Mentor;
