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
  username: {
    type: String,
    unique: true,
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
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  responseTime: { type: String, default: "Usually responds within 24 hours" },
  lastActive: { type: Date, default: Date.now },
  calendlyUrl: { type: String, default: null },
  
  // New fields for enhanced profile
  plans: [{
    name: String,
    price: Number,
    description: String,
    spotsLeft: Number,
    features: [String],
    calendlyEventType: String
  }],
  sessions: [{
    name: String,
    duration: String,
    price: Number,
    description: String,
    calendlyEventType: String
  }],
  experience: [{
    role: String,
    company: String,
    duration: String,
    description: String,
    achievements: [String]
  }],
  education: [{
    degree: String,
    institution: String,
    year: String,
    achievements: String,
    courses: [String]
  }],
  certifications: [{
    name: String,
    issuer: String,
    year: String,
    description: String
  }],
  expertiseDetails: [{
    category: String,
    skills: [String]
  }],
  languages: [{
    language: String,
    proficiency: String
  }],
  testimonials: [{
    name: String,
    rating: Number,
    plan: String,
    duration: String,
    content: String,
    date: String
  }],
  articles: [{
    type: String,
    title: String,
    description: String
  }],
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

    // Always generate username if it doesn't exist
    if (!this.username || this.isModified('firstName') || this.isModified('lastName')) {
      let baseUsername = `${this.firstName.toLowerCase()}-${this.lastName.toLowerCase()}`;
      baseUsername = baseUsername.replace(/[^a-z0-9-]/g, '-'); // Replace invalid chars with dash
      
      // Check if username exists and append number if needed
      let username = baseUsername;
      let counter = 1;
      while (true) {
        const existingMentor = await this.constructor.findOne({ username });
        if (!existingMentor || existingMentor._id.equals(this._id)) {
          break;
        }
        username = `${baseUsername}-${counter}`;
        counter++;
      }
      this.username = username;
      console.log('Generated username:', username);
    }
    next();
  } catch (error) {
    console.error('Error in pre-save middleware:', error);
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
