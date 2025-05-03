import express from "express";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import UserModel from "../models/User.js";
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = express.Router();
const otpStore = {}; // Temporary memory storage for OTPs

// Get current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for file upload
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

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

// Photo upload route
router.post('/upload-photo', verifyToken, upload.single('profilePhoto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get the user ID from the verified token
    const userId = req.userId;
    console.log('Uploading photo for user:', userId);

    // Create the mentees directory if it doesn't exist
    const menteeDir = path.join(__dirname, '../uploads/mentees');
    if (!fs.existsSync(menteeDir)) {
      fs.mkdirSync(menteeDir, { recursive: true });
    }

    // Move the file to the mentees directory
    const oldPath = req.file.path;
    const newPath = path.join(menteeDir, req.file.filename);
    
    try {
      fs.renameSync(oldPath, newPath);
    } catch (moveError) {
      console.error('Error moving file:', moveError);
      // If rename fails, try copy and delete
      fs.copyFileSync(oldPath, newPath);
      fs.unlinkSync(oldPath);
    }

    // Update the user's profile with the new photo filename
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { profilePhoto: req.file.filename },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send back the updated user data with the correct photo URL
    const userResponse = {
      ...updatedUser.toObject(),
      profilePhoto: updatedUser.profilePhoto ? `/uploads/mentees/${updatedUser.profilePhoto}` : null
    };

    res.json({
      message: 'Photo uploaded successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    // Clean up the uploaded file if there was an error
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error cleaning up file:', unlinkError);
      }
    }
    res.status(500).json({ message: 'Error uploading photo', error: error.message });
  }
});

// Remove profile photo
router.delete('/profile/photo', verifyToken, async (req, res) => {
  try {
    console.log('Attempting to remove photo for user:', req.userId);
    
    const user = await UserModel.findById(req.userId);
    if (!user) {
      console.log('User not found:', req.userId);
      return res.status(404).json({ error: 'User not found' });
    }

    // Convert user to plain object to safely access properties
    const userObj = user.toObject();
    console.log('Current user profile photo:', userObj.profilePhoto);

    // If there's a profile photo, delete the file
    if (userObj.profilePhoto) {
      const photoPath = path.join(__dirname, '../uploads/mentees', userObj.profilePhoto);
      console.log('Attempting to delete file at:', photoPath);
      
      try {
        if (fs.existsSync(photoPath)) {
          fs.unlinkSync(photoPath);
          console.log('File deleted successfully');
        } else {
          console.log('File does not exist at path:', photoPath);
        }
      } catch (fileError) {
        console.error('Error deleting file:', fileError);
        // Continue with the update even if file deletion fails
      }
    } else {
      console.log('No profile photo found for user');
    }

    // Update user profile to remove photo reference
    user.profilePhoto = null;
    await user.save();
    console.log('User profile updated successfully');

    // Convert the updated user to a plain object for the response
    const updatedUser = user.toObject();
    delete updatedUser.password; // Remove sensitive data

    res.json({ 
      message: 'Profile photo removed successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error in photo removal route:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
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
