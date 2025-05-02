import express from "express";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import UserModel from "../models/User.js";
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();
const otpStore = {}; // Temporary memory storage for OTPs

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

// Helper function to check OTP expiry
const isOtpExpired = (email) => {
  const expiryTime = 10 * 60 * 1000; // 10 minutes in milliseconds
  const otpTimestamp = otpStore[email]?.timestamp;
  if (!otpTimestamp) return true;
  return Date.now() - otpTimestamp > expiryTime;
};

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Get mentee profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update mentee profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { fullName, interests, bio } = req.body;
    const user = await UserModel.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update only allowed fields
    if (fullName) user.fullName = fullName;
    if (interests) user.interests = interests;
    if (bio) user.bio = bio;

    await user.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload profile photo
router.post('/profile/photo', verifyToken, upload.single('profilePhoto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete old photo if exists
    if (user.profilePhoto?.publicId) {
      await cloudinary.uploader.destroy(user.profilePhoto.publicId);
    }

    // Upload new photo to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'mentor-connect/profile-photos',
      transformation: [
        { width: 400, height: 400, crop: 'fill' },
        { quality: 'auto' }
      ]
    });

    // Delete temporary file
    fs.unlinkSync(req.file.path);

    // Update user's profile photo
    user.profilePhoto = {
      url: result.secure_url,
      publicId: result.public_id
    };

    await user.save();
    res.json(user.profilePhoto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove profile photo
router.delete('/profile/photo', verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.profilePhoto?.publicId) {
      await cloudinary.uploader.destroy(user.profilePhoto.publicId);
      user.profilePhoto = null;
      await user.save();
    }

    res.json({ message: 'Profile photo removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Step 1: Send OTP to mentee's email
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  // Ensure email exists and is a mentee
  const user = await UserModel.findOne({ email, role: "mentee" });
  if (!user) return res.status(404).json({ error: "Mentee not found" });

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, timestamp: Date.now() };

  // Setup nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Mentor Connect - OTP for Password Reset",
    text: `Hello ${user.fullName},\n\nYour OTP is: ${otp}\n\nValid for 10 minutes.`,
  };

  try {
    // Send OTP email
    await transporter.sendMail(mailOptions);
    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Step 2: Reset Password using OTP
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  // Ensure email exists and is a mentee
  const user = await UserModel.findOne({ email, role: "mentee" });
  if (!user) return res.status(404).json({ error: "Mentee not found" });

  // Check if OTP is expired
  if (isOtpExpired(email)) {
    delete otpStore[email]; // Clean up expired OTP
    return res.status(400).json({ error: "OTP expired. Please request a new one." });
  }

  // Verify OTP
  if (otpStore[email]?.otp !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await UserModel.updateOne({ email, role: "mentee" }, { password: hashedPassword });

  // Cleanup OTP after successful password reset
  delete otpStore[email];

  res.json({ message: "Password reset successful!" });
});

export default router;
