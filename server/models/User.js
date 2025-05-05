import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { menteeConnection } from '../config/db.js'; // Assuming this is where you're connecting to MongoDB

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // Hide password by default
  role: { type: String, enum: ["mentor", "mentee"], required: true },
  interests: [{ type: String }],
  bio: String,
  profilePhoto: {
    url: String,
    publicId: String
  },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      console.log('Hashing password for user:', this.email);
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(this.password, salt);
      console.log('Password hashed successfully');
      this.password = hashedPassword;
    }
    next();
  } catch (error) {
    console.error('Error in pre-save hook:', error);
    next(error);
  }
});

// Method to check if the password is valid
UserSchema.methods.isValidPassword = async function (password) {
  try {
    console.log('Validating password for user:', this.email);
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

// Create UserModel if not already created, otherwise use existing
const UserModel = menteeConnection.models.User || menteeConnection.model('User', UserSchema, 'User');

export default UserModel;
