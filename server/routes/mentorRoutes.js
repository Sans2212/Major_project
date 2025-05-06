import express from 'express';
import bcryptjs from 'bcryptjs';
import nodemailer from 'nodemailer';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { env } from 'process';
import axios from 'axios';

// Configure environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Get environment variables from process.env or use fallbacks
const config = {
  jwtSecret: env.JWT_SECRET || 'your-secret-key',
  emailUser: env.EMAIL_USER || '',
  emailPass: env.EMAIL_PASS || ''
};

const router = express.Router();
const otpStore = {};

// ---------------------- OTP Helpers ----------------------

const isOtpExpired = (email) => {
  const expiryTime = 10 * 60 * 1000;
  const otpTimestamp = otpStore[email]?.timestamp;
  if (!otpTimestamp) return true;
  return Date.now() - otpTimestamp > expiryTime;
};

// ---------------------- Multer Config ----------------------

const uploadDir = path.join('uploads', 'mentors');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// ---------------------- OTP Routes ----------------------

router.post("/forgot-password/send-otp", async (req, res) => {
  const { email } = req.body;
  const MentorModel = req.app.locals.MentorModel;

  const mentor = await MentorModel.findOne({ email });
  if (!mentor) return res.status(404).json({ error: "Mentor not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, timestamp: Date.now() };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.emailUser,
      pass: config.emailPass,
    },
  });

  const mailOptions = {
    from: config.emailUser,
    to: email,
    subject: "Mentor Connect - OTP for Password Reset",
    text: `Hello ${mentor.firstName},\n\nYour OTP is: ${otp}\n\nValid for 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

router.post("/forgot-password/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const MentorModel = req.app.locals.MentorModel;

  const mentor = await MentorModel.findOne({ email });
  if (!mentor) return res.status(404).json({ error: "Mentor not found" });

  if (isOtpExpired(email)) {
    delete otpStore[email];
    return res.status(400).json({ error: "OTP expired. Please request a new one." });
  }

  if (otpStore[email]?.otp !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  const hashedPassword = await bcryptjs.hash(newPassword, 10);
  await MentorModel.updateOne({ email }, { password: hashedPassword });

  delete otpStore[email];
  res.json({ message: "Password reset successful!" });
});

// ---------------------- Mentor Apply Route ----------------------

router.post("/apply", upload.single("profilePhoto"), async (req, res) => {
  try {
    const MentorModel = req.app.locals.MentorModel;

    console.log("=== New Mentor Signup ===");
    console.log("Received mentor data:", {
      ...req.body,
      password: req.body.password ? "exists" : "missing",
      confirmPassword: req.body.confirmPassword ? "exists" : "missing"
    });

    const {
      firstName, lastName, email, jobTitle, company,
      location, category, skills, bio, linkedin,
      twitter, website, introVideo, password, confirmPassword
    } = req.body;

    // Validate password fields
    if (!password || !confirmPassword) {
      console.log("Password validation failed - missing fields");
      return res.status(400).json({ error: "Password and confirm password are required." });
    }

    if (password !== confirmPassword) {
      console.log("Password validation failed - passwords don't match");
      return res.status(400).json({ error: "Passwords do not match." });
    }

    if (password.length < 6) {
      console.log("Password validation failed - too short");
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    // Check if mentor already exists
    const existingMentor = await MentorModel.findOne({ email });
    if (existingMentor) {
      console.log("Mentor already exists with email:", email);
      return res.status(400).json({ error: "A mentor with this email already exists." });
    }

    const profilePhoto = req.file ? `/uploads/mentors/${req.file.filename}` : null;

    console.log("Creating new mentor with email:", email);
    const mentor = new MentorModel({
      firstName,
      lastName,
      email,
      password, // The schema's pre-save middleware will hash this
      jobTitle,
      company,
      location,
      category,
      skills,
      bio,
      linkedin,
      twitter,
      website,
      introVideo,
      profilePhoto
    });

    console.log("About to save mentor...");
    await mentor.save();
    console.log("Mentor saved successfully");

    // Create and send JWT token
    const token = jwt.sign(
      { id: mentor._id, role: 'mentor' },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    res.status(201).json({ 
      message: "Mentor registration successful!", 
      token,
      mentor: {
        id: mentor._id,
        firstName: mentor.firstName,
        lastName: mentor.lastName,
        email: mentor.email
      }
    });
  } catch (error) {
    console.error("Error saving mentor:", error);
    res.status(500).json({ error: "Failed to save mentor. " + error.message });
  }
});

// ---------------------- Profile Routes ----------------------

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: `Invalid token: ${error.message}` });
  }
};

// Get current user's profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const MentorModel = req.app.locals.UserModel;
    const mentor = await MentorModel.findById(req.userId).select('-password');
    
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    res.json(mentor);
  } catch (error) {
    console.error("Error fetching mentor profile:", error);
    res.status(500).json({ error: "Error fetching mentor profile" });
  }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const UserModel = req.app.locals.UserModel;
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




// Get mentor profile by ID
router.get("/profile/:mentorId", async (req, res) => {
  try {
    const MentorModel = req.app.locals.MentorModel;
    const mentor = await MentorModel.findById(req.params.mentorId).select('-password');
    
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    res.json(mentor);
  } catch (error) {
    console.error("Error fetching mentor profile:", error);
    res.status(500).json({ error: "Error fetching mentor profile" });
  }
});

router.put("/profile/:mentorId", async (req, res) => {
  try {
    const MentorModel = req.app.locals.MentorModel;
    const { mentorId } = req.params;
    const updateData = req.body;

    // Remove sensitive fields from update data
    delete updateData.password;
    delete updateData.email;

    const updatedMentor = await MentorModel.findByIdAndUpdate(
      mentorId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedMentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    res.json(updatedMentor);
  } catch (error) {
    console.error("Error updating mentor profile:", error);
    res.status(500).json({ error: "Error updating mentor profile" });
  }
});

// Get all mentors (for browse mentors page)
router.get("/browse", async (req, res) => {
  try {
    const MentorModel = req.app.locals.MentorModel;
    const mentors = await MentorModel.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(mentors);
  } catch (error) {
    console.error("Error fetching mentors:", error);
    res.status(500).json({ error: "Error fetching mentors" });
  }
});

// Get mentor by email
router.get("/profile-by-email/:email", async (req, res) => {
  try {
    const MentorModel = req.app.locals.MentorModel;
    const mentor = await MentorModel.findOne({ email: req.params.email }).select('-password');
    
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    res.json({ mentorId: mentor._id });
  } catch (error) {
    console.error("Error fetching mentor:", error);
    res.status(500).json({ error: "Error fetching mentor" });
  }
});

// Get mentor by username
router.get("/profile/username/:username", async (req, res) => {
  try {
    const MentorModel = req.app.locals.MentorModel;
    const mentor = await MentorModel.findOne({ username: req.params.username }).select('-password');
    
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    res.json(mentor);
  } catch (error) {
    console.error("Error fetching mentor:", error);
    res.status(500).json({ error: "Error fetching mentor" });
  }
});

// Search mentors
router.get("/search", async (req, res) => {
  try {
    const MentorModel = req.app.locals.MentorModel;
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const searchRegex = new RegExp(q, 'i');
    const mentors = await MentorModel.find({
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { username: searchRegex },
        { jobTitle: searchRegex },
        { skills: searchRegex },
        { bio: searchRegex }
      ]
    }).select('-password').limit(20);

    res.json(mentors);
  } catch (error) {
    console.error("Error searching mentors:", error);
    res.status(500).json({ error: "Error searching mentors" });
  }
});

// Middleware to verify mentee token
const verifyMenteeToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    if (decoded.role !== 'mentee') {
      return res.status(403).json({ error: 'Only mentees can rate mentors' });
    }
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Rate a mentor
router.post("/:mentorId/rate", verifyMenteeToken, async (req, res) => {
  try {
    console.log('Rating request received:', {
      mentorId: req.params.mentorId,
      userId: req.userId,
      rating: req.body.rating,
      hasReview: !!req.body.review
    });

    const MentorModel = req.app.locals.MentorModel;
    const { mentorId } = req.params;
    const { rating, review } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      console.log('Invalid rating value:', rating);
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const mentor = await MentorModel.findById(mentorId);
    if (!mentor) {
      console.log('Mentor not found:', mentorId);
      return res.status(404).json({ error: "Mentor not found" });
    }

    console.log('Current mentor stats:', {
      currentRating: mentor.rating,
      currentReviews: mentor.reviews
    });

    // Calculate new average rating
    const currentRating = mentor.rating || 0;
    const currentReviews = mentor.reviews || 0;
    const newTotalRating = (currentRating * currentReviews) + rating;
    const newReviews = currentReviews + 1;
    const newAverageRating = newTotalRating / newReviews;

    console.log('New rating calculation:', {
      newTotalRating,
      newReviews,
      newAverageRating
    });

    // Add testimonial if review is provided
    if (review) {
      mentor.testimonials = mentor.testimonials || [];
      mentor.testimonials.push({
        rating,
        content: review,
        date: new Date().toISOString()
      });
      console.log('Added new testimonial');
    }

    // Update mentor's rating and review count
    mentor.rating = newAverageRating;
    mentor.reviews = newReviews;

    await mentor.save();
    console.log('Successfully saved mentor with new rating');

    res.json({
      message: "Rating submitted successfully",
      newRating: newAverageRating,
      totalReviews: newReviews
    });
  } catch (error) {
    console.error("Error submitting rating:", error);
    res.status(500).json({ error: "Failed to submit rating. " + error.message });
  }
});

// Delete mentor account
router.delete("/delete-account", verifyToken, async (req, res) => {
  try {
    const MentorModel = req.app.locals.MentorModel;
    const mentorId = req.userId;

    const deletedMentor = await MentorModel.findByIdAndDelete(mentorId);
    if (!deletedMentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ error: "Failed to delete account" });
  }
});

// Upload or update mentor profile photo
router.post('/upload-photo', verifyToken, upload.single('profilePhoto'), async (req, res) => {
  try {
    const MentorModel = req.app.locals.MentorModel;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const mentor = await MentorModel.findById(req.userId);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }
    // Remove old photo if exists
    if (mentor.profilePhoto) {
      const oldPath = path.join(__dirname, '..', mentor.profilePhoto);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    // Save new photo path
    mentor.profilePhoto = `/uploads/mentors/${req.file.filename}`;
    await mentor.save();
    res.json({
      message: 'Photo uploaded successfully',
      user: mentor
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ message: 'Error uploading photo', error: error.message });
  }
});

// Remove mentor profile photo
router.delete('/profile/photo', verifyToken, async (req, res) => {
  try {
    const MentorModel = req.app.locals.MentorModel;
    const mentor = await MentorModel.findById(req.userId);
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    // If there's a profile photo, delete the file
    if (mentor.profilePhoto) {
      const photoPath = path.join(__dirname, '..', mentor.profilePhoto);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    // Remove photo reference from DB
    mentor.profilePhoto = null;
    await mentor.save();

    res.json({
      message: 'Profile photo removed successfully',
      user: mentor
    });
  } catch (error) {
    console.error('Error removing photo:', error);
    res.status(500).json({
      error: 'Server error',
      details: error.message
    });
  }
});

// ---------------------- Update Calendly URL Route ----------------------
router.put("/calendly-url", verifyToken, async (req, res) => {
  try {
    const MentorModel = req.app.locals.MentorModel;
    const { calendlyUrl } = req.body;

    if (!calendlyUrl) {
      return res.status(400).json({ error: "Calendly URL is required" });
    }

    // Validate URL format
    try {
      new URL(calendlyUrl);
    } catch {
      return res.status(400).json({ error: "Invalid Calendly URL format" });
    }

    // Update mentor's Calendly URL
    const mentor = await MentorModel.findByIdAndUpdate(
      req.userId,
      { calendlyUrl },
      { new: true }
    );

    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    res.json({ 
      message: "Calendly URL updated successfully",
      calendlyUrl: mentor.calendlyUrl 
    });
  } catch (error) {
    console.error("Error updating Calendly URL:", error);
    res.status(500).json({ error: "Failed to update Calendly URL" });
  }
});

// Calendly URL existence check (proxy to avoid CORS)
router.post("/check-calendly-url", async (req, res) => {
  const { calendlyUrl } = req.body;
  if (!calendlyUrl || !calendlyUrl.startsWith('https://calendly.com/')) {
    return res.status(400).json({ exists: false, error: "Invalid Calendly URL format" });
  }
  try {
    await axios.head(calendlyUrl, { timeout: 5000 });
    return res.json({ exists: true });
  } catch {
    return res.json({ exists: false });
  }
});

export default router;
