import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { menteeConnection } from '../config/db.js'; // Assuming this is where you're connecting to MongoDB

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["mentor", "mentee"], required: true },
  interests: [{ type: String }],
  bio: String,
  profilePhoto: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to check if the password is valid
UserSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Create UserModel if not already created, otherwise use existing
const UserModel = menteeConnection.models.User || menteeConnection.model('User', UserSchema, 'User');

export default UserModel;
