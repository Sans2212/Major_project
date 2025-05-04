// schemas/UserSchema.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  interests: [{ type: String }],
  bio: String,
  profilePhoto: {
    url: String,
    publicId: String
  },
  createdAt: { type: Date, default: Date.now },
  otp: String,
  otpExpiry: Date,
});

// Default export
export default userSchema;
